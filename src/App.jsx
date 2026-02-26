import { Toaster } from "react-hot-toast";
import { toastOptions } from "./config/toastConfig";
import ErrorBoundary from "./components/common/ErrorBoundary";
import AppRouter from "./routes/Router";

export default function App() {
  return (
    <ErrorBoundary>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        toastOptions={toastOptions}
      />
      <AppRouter />
    </ErrorBoundary>
  );
}
