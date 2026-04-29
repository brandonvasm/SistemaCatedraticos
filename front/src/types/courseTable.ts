export interface CourseTable {
  id: number;
  code: string;
  name: string;
  credits: number;
  score: number;
  trend: number | null; 
  category?: string;
}

export interface CourseChartPoint {
  name: string;
  [courseName: string]: string | number;
}