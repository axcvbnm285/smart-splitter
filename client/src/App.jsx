import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { BillProvider } from "./context/BillContext";
import ErrorBoundary from "./components/Common/ErrorBoundary";

const Home = lazy(() => import("./pages/Home"));
const BillEditor = lazy(() => import("./pages/BillEditor"));
const Summary = lazy(() => import("./pages/Summary"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const PreviewPage = lazy(() => import("./pages/PreviewPage"));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <BillProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/preview" element={<PreviewPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/edit" element={<BillEditor />} />
              <Route path="/summary" element={<Summary />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </BillProvider>
    </ErrorBoundary>
  );
}

export default App;
