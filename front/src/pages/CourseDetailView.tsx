import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CourseHeader from "../components/CourseDetailView/CourseHeader";
import CourseStats from "../components/CourseDetailView/CourseStats";
import CourseCharts from "../components/CourseDetailView/CourseCharts";
import TeachersList from "../components/CourseDetailView/TeachersList";
import { courseService } from "../services/courseService";
import type { CourseTable } from "../types/courseTable";

export default function CourseDetailView() {
  const { id } = useParams<{ id: string }>();
  
  const [course, setCourse] = useState<CourseTable | null>(null);

  useEffect(() => {
    if (id) {
      courseService.getCourseDetail(id)
        .then((data) => {
          setCourse(data);
        })
        .catch((err) => {
          console.error("Error al conectar el Header:", err);
        });
    }
  }, [id]);

  return (
    <div className="min-h-screen w-full px-6 py-6 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <CourseHeader course={course} />

        <CourseStats
        credits={course?.credits} 
        score={course?.score} 
        loading={!course}
        />
        

        <CourseCharts courseId={id} />

        <TeachersList courseId={id} />

      </div>
    </div>
  );
}