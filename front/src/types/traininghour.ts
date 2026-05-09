export interface TrainingHourRecord {
  id: number;
  teacher: number | string;
  faculty: number | string;
  initiation_count: number;
  transition_count: number;
  autonomy_count: number;
  complementary_count: number;
  created_at: string;
}