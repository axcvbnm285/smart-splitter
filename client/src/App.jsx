import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { BillProvider } from "./context/BillContext";
import ErrorBoundary from "./components/Common/ErrorBoundary";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const BillEditor = lazy(() => import("./pages/BillEditor"));
const Summary = lazy(() => import("./pages/Summary"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const PreviewPage = lazy(() => import("./pages/PreviewPage"));
const BillsHistory = lazy(() => import("./pages/BillsHistory"));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BillProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/preview" element={<PreviewPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/edit" element={<BillEditor />} />
                <Route path="/summary" element={<Summary />} />
                <Route path="/history" element={<BillsHistory />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </BillProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
