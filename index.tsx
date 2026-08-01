import React, { Component, ErrorInfo, ReactNode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "40px 20px",
            color: "#fff",
            backgroundColor: "#05050a",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontFamily: "Cairo, sans-serif",
          }}
        >
          <h2 style={{ fontSize: "24px", color: "#ef4444", marginBottom: "16px" }}>
            حدث خطأ أثناء تحميل التطبيق
          </h2>
          <p style={{ color: "#a0aec0", maxWidth: "500px", marginBottom: "24px" }}>
            {this.state.error?.message || "يرجى إعادة تحميل الصفحة لمتابعة الاستخدام."}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 28px",
              backgroundColor: "#fca311",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Remove static loader if present
const removeLoader = () => {
  const loader = document.getElementById("app-loader");
  if (loader) {
    loader.remove();
  }
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

// Ensure loader is removed after initial render
setTimeout(removeLoader, 100);
