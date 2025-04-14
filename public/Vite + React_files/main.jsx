import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/main.jsx");import.meta.env = {"BASE_URL": "/", "DEV": true, "MODE": "development", "PROD": false, "SSR": false, "VITE_DEV_URL": "http://localhost:8080", "VITE_ENV": "development", "VITE_GITHUB_CLIENT_ID": "Ov23ct3LV66bJ8IhOoc1", "VITE_GITHUB_CLIENT_SECRET": "72e0aefb639b759d9421edd2c2c58b8d8b53cdd8", "VITE_GOOGLE_CLIENT_ID": "952635713256-b26p7n75c8h436b1gmpc593bb4jh09n7.apps.googleusercontent.com", "VITE_GOOGLE_CLIENT_SECRET": "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", "VITE_LOGIN": "users/login", "VITE_PRO_URL": "https://pr-backend-wf4y.onrender.com/", "VITE_SIGNUP": "users/signup"};import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=c97f713e"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;
if (import.meta.hot && !inWebWorker) {
  if (!window.__vite_plugin_react_preamble_installed__) {
    throw new Error("@vitejs/plugin-react can't detect preamble. Something is wrong. See https://github.com/vitejs/vite-plugin-react/pull/11#discussion_r430879201");
  }
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    RefreshRuntime.register(type, "D:/pr_frontend/src/main.jsx " + id);
  };
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=c97f713e"; const createRoot = __vite__cjsImport3_reactDom_client["createRoot"];
import App from "/src/App.jsx?t=1744632915415";
import "/src/index.css?t=1744632915415";
import { BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=c97f713e";
import { Provider } from "/node_modules/.vite/deps/react-redux.js?v=c97f713e";
import { store } from "/src/redux/store.js";
import { GoogleOAuthProvider } from "/node_modules/.vite/deps/@react-oauth_google.js?v=c97f713e";
import __vite__cjsImport10_react from "/node_modules/.vite/deps/react.js?v=c97f713e"; const useEffect = __vite__cjsImport10_react["useEffect"];
const GoogleApiInitializer = ({ children }) => {
  _s();
  useEffect(() => {
    const loadGoogleApi = async () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => {
        window.gapi.load("client", () => {
          window.gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
          });
        });
      };
      document.body.appendChild(script);
    };
    loadGoogleApi();
  }, []);
  return children;
};
_s(GoogleApiInitializer, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = GoogleApiInitializer;
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxDEV(GoogleOAuthProvider, { clientId: `${import.meta.env.VITE_GOOGLE_CLIENT_ID}`, children: /* @__PURE__ */ jsxDEV(Provider, { store, children: /* @__PURE__ */ jsxDEV(BrowserRouter, { children: /* @__PURE__ */ jsxDEV(GoogleApiInitializer, { children: /* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
    fileName: "D:/pr_frontend/src/main.jsx",
    lineNumber: 39,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "D:/pr_frontend/src/main.jsx",
    lineNumber: 38,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "D:/pr_frontend/src/main.jsx",
    lineNumber: 37,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "D:/pr_frontend/src/main.jsx",
    lineNumber: 36,
    columnNumber: 5
  }, this) }, void 0, false, {
    fileName: "D:/pr_frontend/src/main.jsx",
    lineNumber: 35,
    columnNumber: 3
  }, this)
);
var _c;
$RefreshReg$(_c, "GoogleApiInitializer");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("D:/pr_frontend/src/main.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/pr_frontend/src/main.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBc0NVOzJCQXRDVjtBQUFtQixNQUFRLHFCQUFrQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUM3QyxPQUFPQSxTQUFTO0FBQ2hCLE9BQU87QUFDUCxTQUFTQyxxQkFBcUI7QUFDOUIsU0FBU0MsZ0JBQWdCO0FBQ3pCLFNBQVNDLGFBQWE7QUFDdEIsU0FBU0MsMkJBQTJCO0FBQ3BDLFNBQVNDLGlCQUFpQjtBQUcxQixNQUFNQyx1QkFBdUJBLENBQUMsRUFBRUMsU0FBUyxNQUFNO0FBQUFDLEtBQUE7QUFDN0NILFlBQVUsTUFBTTtBQUVkLFVBQU1JLGdCQUFnQixZQUFZO0FBQ2hDLFlBQU1DLFNBQVNDLFNBQVNDLGNBQWMsUUFBUTtBQUM5Q0YsYUFBT0csTUFBTTtBQUNiSCxhQUFPSSxTQUFTLE1BQU07QUFDcEJDLGVBQU9DLEtBQUtDLEtBQUssVUFBVSxNQUFNO0FBQy9CRixpQkFBT0MsS0FBS0UsT0FBT0MsS0FBSztBQUFBLFlBQ3RCQyxRQUFRQyxZQUFZQyxJQUFJQztBQUFBQSxZQUN4QkMsZUFBZSxDQUFDLCtEQUErRDtBQUFBLFVBQ2pGLENBQUM7QUFBQSxRQUNILENBQUM7QUFBQSxNQUNIO0FBQ0FiLGVBQVNjLEtBQUtDLFlBQVloQixNQUFNO0FBQUEsSUFDbEM7QUFFQUQsa0JBQWM7QUFBQSxFQUNoQixHQUFHLEVBQUU7QUFFTCxTQUFPRjtBQUNUO0FBQUVDLEdBckJJRixzQkFBb0I7QUFBQXFCLEtBQXBCckI7QUF1Qk5zQixXQUFXakIsU0FBU2tCLGVBQWUsTUFBTSxDQUFDLEVBQUVDO0FBQUFBLEVBQzFDLHVCQUFDLHVCQUFvQixVQUFVLEdBQUdULFlBQVlDLElBQUlTLHFCQUFxQixJQUNyRSxpQ0FBQyxZQUFTLE9BQ1IsaUNBQUMsaUJBQ0MsaUNBQUMsd0JBQ0MsaUNBQUMsU0FBRDtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBQUksS0FETjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBRUEsS0FIRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBSUEsS0FMRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBTUEsS0FQRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBUUE7QUFDRjtBQUFFLElBQUFKO0FBQUFLLGFBQUFMLElBQUEiLCJuYW1lcyI6WyJBcHAiLCJCcm93c2VyUm91dGVyIiwiUHJvdmlkZXIiLCJzdG9yZSIsIkdvb2dsZU9BdXRoUHJvdmlkZXIiLCJ1c2VFZmZlY3QiLCJHb29nbGVBcGlJbml0aWFsaXplciIsImNoaWxkcmVuIiwiX3MiLCJsb2FkR29vZ2xlQXBpIiwic2NyaXB0IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3JjIiwib25sb2FkIiwid2luZG93IiwiZ2FwaSIsImxvYWQiLCJjbGllbnQiLCJpbml0IiwiYXBpS2V5IiwiaW1wb3J0IiwiZW52IiwiVklURV9HT09HTEVfQVBJX0tFWSIsImRpc2NvdmVyeURvY3MiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJfYyIsImNyZWF0ZVJvb3QiLCJnZXRFbGVtZW50QnlJZCIsInJlbmRlciIsIlZJVEVfR09PR0xFX0NMSUVOVF9JRCIsIiRSZWZyZXNoUmVnJCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJtYWluLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVSb290IH0gZnJvbSBcInJlYWN0LWRvbS9jbGllbnRcIjtcclxuaW1wb3J0IEFwcCBmcm9tIFwiLi9BcHAuanN4XCI7XHJcbmltcG9ydCBcIi4vaW5kZXguY3NzXCI7XHJcbmltcG9ydCB7IEJyb3dzZXJSb3V0ZXIgfSBmcm9tIFwicmVhY3Qtcm91dGVyLWRvbVwiO1xyXG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gXCIuL3JlZHV4L3N0b3JlLmpzXCI7XHJcbmltcG9ydCB7IEdvb2dsZU9BdXRoUHJvdmlkZXIgfSBmcm9tIFwiQHJlYWN0LW9hdXRoL2dvb2dsZVwiO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbi8vIEdvb2dsZSBBUEkgaW5pdGlhbGl6YXRpb24gY29tcG9uZW50XHJcbmNvbnN0IEdvb2dsZUFwaUluaXRpYWxpemVyID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAvLyBMb2FkIHRoZSBHb29nbGUgQVBJIGNsaWVudFxyXG4gICAgY29uc3QgbG9hZEdvb2dsZUFwaSA9IGFzeW5jICgpID0+IHtcclxuICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgIHNjcmlwdC5zcmMgPSAnaHR0cHM6Ly9hcGlzLmdvb2dsZS5jb20vanMvYXBpLmpzJztcclxuICAgICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICB3aW5kb3cuZ2FwaS5sb2FkKCdjbGllbnQnLCAoKSA9PiB7XHJcbiAgICAgICAgICB3aW5kb3cuZ2FwaS5jbGllbnQuaW5pdCh7XHJcbiAgICAgICAgICAgIGFwaUtleTogaW1wb3J0Lm1ldGEuZW52LlZJVEVfR09PR0xFX0FQSV9LRVksXHJcbiAgICAgICAgICAgIGRpc2NvdmVyeURvY3M6IFsnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vZGlzY292ZXJ5L3YxL2FwaXMvY2FsZW5kYXIvdjMvcmVzdCddLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuICAgIH07XHJcblxyXG4gICAgbG9hZEdvb2dsZUFwaSgpO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgcmV0dXJuIGNoaWxkcmVuO1xyXG59O1xyXG5cclxuY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIikpLnJlbmRlcihcclxuICA8R29vZ2xlT0F1dGhQcm92aWRlciBjbGllbnRJZD17YCR7aW1wb3J0Lm1ldGEuZW52LlZJVEVfR09PR0xFX0NMSUVOVF9JRH1gfT5cclxuICAgIDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxyXG4gICAgICA8QnJvd3NlclJvdXRlcj5cclxuICAgICAgICA8R29vZ2xlQXBpSW5pdGlhbGl6ZXI+XHJcbiAgICAgICAgICA8QXBwIC8+XHJcbiAgICAgICAgPC9Hb29nbGVBcGlJbml0aWFsaXplcj5cclxuICAgICAgPC9Ccm93c2VyUm91dGVyPlxyXG4gICAgPC9Qcm92aWRlcj5cclxuICA8L0dvb2dsZU9BdXRoUHJvdmlkZXI+XHJcbik7XHJcbiJdLCJmaWxlIjoiRDovcHJfZnJvbnRlbmQvc3JjL21haW4uanN4In0=