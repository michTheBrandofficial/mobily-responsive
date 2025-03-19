// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod jump_list;

use jump_list::JumpListManager;
use tauri::AppHandle;

#[cfg(windows)]
extern crate winapi;

#[tauri::command]
fn initialize_jump_list(app_handle: AppHandle) -> String {
    let jump_list = JumpListManager::new(app_handle);
    match jump_list.setup_jump_list() {
        Ok(_) => "Jump List initialized successfully".to_string(),
        Err(e) => format!("Failed to initialize Jump List: {}", e),
    }
}

fn main() {
    #[cfg(target_os = "windows")]
    unsafe {
        winapi::um::shellscalingapi::SetProcessDpiAwareness(1);
    }
    tauri::Builder::default()
        .setup(|app| {
            // Get the app handle for later use
            let app_handle = app.handle();

            // Set up jump list on Windows only
            #[cfg(target_os = "windows")]
            {
                let jump_list = JumpListManager::new(app_handle.clone());
                if let Err(e) = jump_list.setup_jump_list() {
                    eprintln!("Failed to setup jump list: {:?}", e);
                }

                // Handle command line arguments (for when app is launched from jump list)
                let args: Vec<String> = std::env::args().collect();
                jump_list.handle_jumplist_args(&args);
            }

            Ok(())
        })
        // Register the command for frontend use
        .invoke_handler(tauri::generate_handler![initialize_jump_list])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
