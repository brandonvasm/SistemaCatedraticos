export interface CourseTable {
  id: number;
  code: string;
  name: string;
  credits: number;
  is_active: boolean; 
  careers: Career[];  
  score: number;
  trend: number | null; 
  category?: string;
}

export interface CourseChartPoint {
  name: string;
  [courseName: string]: string | number;
}

export interface Career {
  id: number;
  name: string;
}