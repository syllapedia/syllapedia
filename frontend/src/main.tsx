import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="1009241786601-qj6al5sr1e98t7f2i3q16smua7govo54.apps.googleusercontent.com">
    {/* <React.StrictMode> */}
      <Provider store={store}>
        <App />
      </Provider>
    {/* </React.StrictMode> */}
  </GoogleOAuthProvider>
)
