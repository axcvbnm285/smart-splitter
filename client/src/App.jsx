import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BillProvider } from "./context/BillContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BillEditor from "./pages/BillEditor";
import Summary from "./pages/Summary";
import UploadPage from "./pages/UploadPage";
import PreviewPage from "./pages/PreviewPage";

function App() {
  return (
    <AuthProvider>
      <BillProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/edit" element={<BillEditor />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </BrowserRouter>
      </BillProvider>
    </AuthProvider>
  );
}

export default App;
