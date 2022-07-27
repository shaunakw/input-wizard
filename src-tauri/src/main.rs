#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::time::Duration;

use rdev::{Button, EventType};
use tauri::{State, Manager};
use tauri::async_runtime::Mutex;
use tokio::time;

struct AppState {
  on: Mutex<bool>
}

impl AppState {
  fn new() -> Self {
    AppState { on: Mutex::new(false) }
  }
}

#[tauri::command]
async fn start_click(state: State<'_, AppState>, millis: u64, button: &str) -> Result<(), ()> {
  let on = &state.on;
  if !*on.lock().await {
    *on.lock().await = true;

    let button = match button {
      "Left" => Button::Left,
      "Right" => Button::Right,
      "Middle" => Button::Middle,
      _ => Button::Left
    };

    let mut interval = time::interval(Duration::from_millis(millis));
    while *on.lock().await {
      interval.tick().await;
      rdev::simulate(&EventType::ButtonPress(button)).unwrap();
      rdev::simulate(&EventType::ButtonRelease(button)).unwrap();
    }
  }

  Ok(())
}

#[tauri::command]
async fn stop(state: State<'_, AppState>) -> Result<(), ()> {
  let on = &state.on;
  *on.lock().await = false;

  Ok(())
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let app_handle = app.app_handle();
      tauri::async_runtime::spawn(async move {
        loop {
          std::thread::sleep(Duration::from_millis(100));
          app_handle.emit_all("keydown", rdev::Key::Alt).unwrap();
        }
      });
      // tauri::async_runtime::spawn(async {
      //   rdev::listen(move |event| {
      //     if let EventType::KeyPress(key) = event.event_type {
      //       app_handle.emit_all("keydown", key).unwrap();
      //     }
      //   }).unwrap();
      // });

      Ok(())
    })
    .manage(AppState::new())
    .invoke_handler(tauri::generate_handler![start_click, stop])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
