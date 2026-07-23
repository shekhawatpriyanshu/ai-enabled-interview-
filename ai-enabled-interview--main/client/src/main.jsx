import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { CodingProvider } from "./admin/context/CodingContext";
import { QuestionProvider } from "./admin/context/QuestionContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AuthProvider>
      <CodingProvider>
        <QuestionProvider>
      <App />

        </QuestionProvider>

      </CodingProvider>
    </AuthProvider>
  </React.StrictMode>
);