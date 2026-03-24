import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import DocentesViews from "../pages/DocentesView"
import TeacherDetail from "../pages/TeacherDetail"
import CoursesView from "../pages/CoursesView"
import CourseDetailView from "../pages/CourseDetailView"

export default function AppRouter() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/docentesView" element={<DocentesViews />} />
        <Route path="/teacher/:id" element={<TeacherDetail />} />
        <Route path="/coursesView" element={<CoursesView />} />
        <Route path="/courses/:id" element={<CourseDetailView />} />
      </Routes>

    </BrowserRouter>

  )

}