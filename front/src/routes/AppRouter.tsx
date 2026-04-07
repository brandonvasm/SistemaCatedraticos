import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import DocentesViews from "../pages/DocentesView";
import TeacherDetail from "../pages/TeacherDetail";
import CoursesView from "../pages/CoursesView";
import CourseDetailView from "../pages/CourseDetailView";
import { ProtectedRoute } from "../ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import SaludCarrera from "../pages/CareerHealth";
import Settings from "../pages/Settings";
import Recommendations from "../pages/Recommendations";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. RUTA PÚBLICAS */}
        <Route path="/login" element={<Login />} />
      

        {/* RUTAS PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>
      
          <Route element={<DashboardLayout />}>
            

            <Route path="/dashboard" element={<Dashboard />} />
          
            <Route path="/usuarios" element={<Users />} />
            

            <Route path="/docentes" element={<DocentesViews />} />
            <Route path="/docentes/:id" element={<TeacherDetail />} />
            

            <Route path="/cursos" element={<CoursesView />} />
            <Route path="/cursos/:id" element={<CourseDetailView />} />
            
            <Route path="/salud" element={<SaludCarrera/>} />

            <Route path="/recomendaciones" element={<Recommendations/>} />
  
            <Route path="/configuracion" element={<Settings/>} />
            
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}