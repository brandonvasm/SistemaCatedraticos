import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import { ProtectedRoute } from "../ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/*rutas publicas*/}
        <Route path="/" element={<Login />} />
       
       

        {/* ruta protediga solo con Login */}
        <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/usuarios" element={<Users />} />
        
          
        
        </Route>
      </Routes>
    </BrowserRouter>
  );
}