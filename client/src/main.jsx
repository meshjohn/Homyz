import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider domain="dev-sbpud2ugulilvnq0.us.auth0.com" clientId="hpInVKaHrVDyPdHAnXsfkMQ5MR0OBy5K" authorizationParams={{
     redirect_uri: window.location.origin,
    }}
    audience="https://full-stack-real-estate-eight.vercel.app"
    scope="openid profile email"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);