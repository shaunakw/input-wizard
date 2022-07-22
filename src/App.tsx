import { invoke } from "@tauri-apps/api";

export default function App() {
  const start = () => {
    invoke("start_click", { millis: 100 });
  };

  const stop = () => {
    invoke("stop_click");
  };

  return (
    <div>
      <h1 onClick={start}>Start</h1>
      <h1 onClick={stop}>Stop</h1>
    </div>
  );
}
