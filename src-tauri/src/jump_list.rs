use tauri::{AppHandle, Manager, Runtime};
use tauri_plugin_shell::ShellExt;

pub struct JumpListItem {
    name: String,
    description: String,
    device_id: String,
}

pub fn setup_jump_list<R: Runtime>(app: &AppHandle<R>) -> Result<(), Box<dyn std::error::Error>> {
    // Define the devices you want to include in the jump list
    let devices = vec![
        JumpListItem {
            name: "iPhone 15".to_string(),
            description: "Open with iPhone 15".to_string(),
            device_id: "iphone-15".to_string(),
        },
        JumpListItem {
            name: "iPhone 16 Pro".to_string(),
            description: "Open with iPhone 16 Pro".to_string(),
            device_id: "iphone-16-pro".to_string(),
        },
        // Add more devices as needed
    ];

    // Create the jump list
    #[cfg(target_os = "windows")]
    {
        use tauri_plugin_window_state::{AppHandleExt, StateFlags};
        use windows::Win32::UI::Shell::{
            SHAddToRecentDocs, SHARDAPPIDINFO, SHARDAPPIDINFOIDLIST, SHARD_APPIDINFO,
        };

        let mut jump_list = windows_jump_list::JumpList::new()?;
        jump_list.set_app_id("com.mobily.responsive")?;

        // Create a custom category for devices
        let mut category = windows_jump_list::JumpListCategory::new("Devices")?;

        // Add items to the category
        for device in devices {
            let mut item = windows_jump_list::JumpListItem::new(
                &device.description,
                &app.path_resolver()
                    .resolve_resource("icon.ico")
                    .unwrap()
                    .to_string_lossy(),
            )?;

            // Set the arguments to pass to the application
            item.set_arguments(&format!("--device={}", device.device_id))?;

            category.add_item(item)?;
        }

        jump_list.add_category(category)?;
        jump_list.apply()?;
    }

    Ok(())
}

// Function to handle device selection from jump list
pub fn handle_jump_list_args<R: Runtime>(app: &AppHandle<R>, args: Vec<String>) {
    if let Some(arg) = args.iter().find(|arg| arg.starts_with("--device=")) {
        let device_id = arg.replace("--device=", "");

        // Emit an event to the frontend with the selected device
        app.emit_all("device-selected", device_id).unwrap();
    }
}
