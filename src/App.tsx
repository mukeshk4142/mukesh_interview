import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Portfolio } from "./components/Portfolio";
import { AdminDashboard } from "./components/AdminDashboard";
import { ManageHR } from "./components/ManageHR";
import { Login } from "./components/Login";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/hr" 
          element={
            <ProtectedRoute>
              <ManageHR />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
