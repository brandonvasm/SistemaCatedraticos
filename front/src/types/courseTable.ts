export interface CourseTable {
  id: number;
  name: string;
  code: string;
  category: string;

  evaluations: number;
  teachers: number;
  avg: number;
  trend: number;
  rec: number;
  teacher: string;
}