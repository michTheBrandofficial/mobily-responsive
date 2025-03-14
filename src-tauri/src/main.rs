// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(windows)]
extern crate winapi;

fn main() {
    #[cfg(target_os = "windows")]
    unsafe {
        winapi::um::shellscalingapi::SetProcessDpiAwareness(1);
    }
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
