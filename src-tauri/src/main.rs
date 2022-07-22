#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::time::Duration;

use enigo::{Enigo, MouseControllable, MouseButton};
use tauri::State;
use tauri::async_runtime::Mutex;
use tokio::time;

struct AppState {
  click: Mutex<bool>
}

impl AppState {
  fn new() -> Self {
    AppState { click: Mutex::new(false) }
  }
}

#[tauri::command]
async fn start_click(state: State<'_, AppState>, millis: u64) -> Result<(), ()> {
  *state.click.lock().await = true;

  let mut enigo = Enigo::new();
  let mut interval = time::interval(Duration::from_millis(millis));
  while *state.click.lock().await {
    interval.tick().await;
    enigo.mouse_click(MouseButton::Left);
  }

  Ok(())
}

#[tauri::command]
async fn stop_click(state: State<'_, AppState>) -> Result<(), ()> {
  *state.click.lock().await = false;

  Ok(())
}

fn main() {
  tauri::Builder::default()
    .manage(AppState::new())
    .invoke_handler(tauri::generate_handler![start_click, stop_click])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
