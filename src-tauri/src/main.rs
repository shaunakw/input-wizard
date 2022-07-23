#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::time::Duration;

use rdev::{Button, EventType};
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
async fn start_click(state: State<'_, AppState>, millis: u64, button: &str) -> Result<(), ()> {
  if !*state.click.lock().await {
    *state.click.lock().await = true;

    let button = match button {
      "Left" => Button::Left,
      "Right" => Button::Right,
      "Middle" => Button::Middle,
      _ => Button::Left
    };

    let mut interval = time::interval(Duration::from_millis(millis));
    while *state.click.lock().await {
      interval.tick().await;
      rdev::simulate(&EventType::ButtonPress(button)).unwrap();
      rdev::simulate(&EventType::ButtonRelease(button)).unwrap();
    }
  }

  Ok(())
}

#[tauri::command]
async fn stop(state: State<'_, AppState>) -> Result<(), ()> {
  *state.click.lock().await = false;

  Ok(())
}

fn main() {
  tauri::Builder::default()
    .manage(AppState::new())
    .invoke_handler(tauri::generate_handler![start_click, stop])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
