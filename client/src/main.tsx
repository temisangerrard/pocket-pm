import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./env-check"; // Import environment check

// Log that the application is starting
console.log("Application starting...");

createRoot(document.getElementById("root")!).render(<App />);
