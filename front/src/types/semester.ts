export interface Semester {
  id: number;
  year: number;
  number: number;
  ceat_loaded: boolean;
  comments_loaded: boolean;
  control_loaded: boolean;
  evaluation_loaded: boolean;
  status: "uploading" | "completed" | "idle";
  faculty: number;
}