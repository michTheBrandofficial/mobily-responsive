// src-tauri/src/jump_list.rs

use std::ptr;
use tauri::{AppHandle, Manager};
use windows::{
    core::{HSTRING, PCWSTR},
    Win32::{
        System::Com::{CoCreateInstance, CLSCTX_INPROC_SERVER, STGM_READ},
        UI::Shell::{
            IApplicationDocumentLists, ICustomDestinationList, IObjectArray, IShellItem,
            SHAddToRecentDocs, SHCreateItemFromParsingName, KNOWNDESTCATEGORY, SHARD,
            SHCNE_ASSOCCHANGED, SHCNF_IDLIST,
        },
    },
};

pub struct JumpListManager {
    app_handle: AppHandle,
}

impl JumpListManager {
    pub fn new(app_handle: AppHandle) -> Self {
        Self { app_handle }
    }

    pub fn setup_jump_list(&self) -> windows::core::Result<()> {
        unsafe {
            // Create the Custom Destination List
            let destination_list: ICustomDestinationList = CoCreateInstance(
                &windows::Win32::UI::Shell::CLSID_DestinationList,
                None,
                CLSCTX_INPROC_SERVER,
            )?;

            // Set the App ID
            let app_id = HSTRING::from("YourCompany.DeviceSimulator");
            destination_list.SetAppID(&app_id)?;

            // Begin the list building process
            let mut removed_count = 0;
            let removed_items: Option<IObjectArray> = None;
            destination_list.BeginList(
                &mut removed_count,
                &IObjectArray::IID,
                removed_items.as_mut(),
            )?;

            // Add "Devices" category
            destination_list
                .AppendCategory(&HSTRING::from("Devices"), self.create_device_list()?)?;

            // Commit the list
            destination_list.CommitList()?;

            Ok(())
        }
    }

    fn create_device_list(&self) -> windows::core::Result<IObjectArray> {
        unsafe {
            // Create an object collection for the devices
            let collection: windows::Win32::UI::Shell::IObjectCollection = CoCreateInstance(
                &windows::Win32::UI::Shell::CLSID_EnumerableObjectCollection,
                None,
                CLSCTX_INPROC_SERVER,
            )?;

            // Add iPhone 16 Pro to the collection
            let iphone16_link = self.create_shortcut(
                "iPhone 16 Pro",
                "iphone16pro",
                "Launch iPhone 16 Pro simulator",
            )?;
            collection.AddObject(&iphone16_link)?;

            // Add iPhone 15 Pro to the collection
            let iphone15_link = self.create_shortcut(
                "iPhone 15 Pro",
                "iphone15pro",
                "Launch iPhone 15 Pro simulator",
            )?;
            collection.AddObject(&iphone15_link)?;

            // Get the final collection as an IObjectArray
            let object_array: IObjectArray = collection.cast()?;
            Ok(object_array)
        }
    }

    fn create_shortcut(
        &self,
        title: &str,
        device_id: &str,
        description: &str,
    ) -> windows::core::Result<windows::Win32::UI::Shell::IShellLink> {
        unsafe {
            // Create a shell link
            let shell_link: windows::Win32::UI::Shell::IShellLink = CoCreateInstance(
                &windows::Win32::UI::Shell::CLSID_ShellLink,
                None,
                CLSCTX_INPROC_SERVER,
            )?;

            // Get the executable path
            let exe_path = std::env::current_exe().unwrap();
            let exe_path_str = exe_path.to_string_lossy().to_string();

            // Set the path to the exe
            shell_link.SetPath(&HSTRING::from(exe_path_str))?;

            // Set arguments (device ID to launch specific simulator)
            shell_link.SetArguments(&HSTRING::from(format!("--device={}", device_id)))?;

            // Set description
            shell_link.SetDescription(&HSTRING::from(description))?;

            // Set the icon (optional)
            // shell_link.SetIconLocation(&HSTRING::from(exe_path_str), 0)?;

            // Set the title (property store)
            let prop_store: windows::Win32::System::Com::IPropertyStore = shell_link.cast()?;
            // Set title property (simplified - would need actual property key setup)

            Ok(shell_link)
        }
    }

    pub fn handle_jumplist_args(&self, args: &[String]) {
        // Parse command line arguments for --device parameter
        if let Some(device_arg) = args.iter().find(|arg| arg.starts_with("--device=")) {
            let device_id = device_arg.trim_start_matches("--device=");

            // Emit event to the frontend with the selected device
            self.app_handle
                .emit_all("device-selected", device_id)
                .unwrap();
        }
    }
}
