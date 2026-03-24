import type { Teacher } from "../types/teacher";

const teachers: Teacher[] = [
  { id: "1", name: "Dr. Carlos Méndez", students: 187, score: 1.8, courses: 3, trend: "+0.3", isTrendUp: true },
  { id: "2", name: "Ing. Luis García", students: 201, score: 4.5, courses: 3, trend: "+0.5", isTrendUp: true },
  { id: "3", name: "Dra. Ana Rodríguez", students: 142, score: 4.7, courses: 2, trend: "0.0", isTrendUp: true },
  { id: "4", name: "MSc. Jorge Ramírez", students: 165, score: 4.2, courses: 2, trend: "+0.2", isTrendUp: true },
  { id: "5", name: "Lic. Roberto Mejía", students: 118, score: 3.2, courses: 2, trend: "-0.4", isTrendUp: false },
  { id: "6", name: "Ing. Claudia Juárez", students: 176, score: 4.4, courses: 2, trend: "+0.3", isTrendUp: true },
];

export default teachers;