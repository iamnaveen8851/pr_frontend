import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";

// Google API initialization component
const GoogleApiInitializer = ({ children }) => {
  useEffect(() => {
    // Load the Google API client
    const loadGoogleApi = async () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => {
        window.gapi.load("client", () => {
          window.gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
            ],
          });
        });
      };
      document.body.appendChild(script);
    };

    loadGoogleApi();
  }, []);

  return children;
};

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={`${import.meta.env.VITE_GOOGLE_CLIENT_ID}`}>
    <Provider store={store}>
      <BrowserRouter>
        <GoogleApiInitializer>
          <App />
        </GoogleApiInitializer>
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
);
