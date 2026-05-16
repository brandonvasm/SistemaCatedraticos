export interface CourseChartPoint {
  name: string;
  sortKey: number;
  [courseName: string]: string | number;
}