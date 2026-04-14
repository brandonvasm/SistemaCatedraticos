export interface UploadedFile {
  id: number;
  name: string;
  url: string;
  size: number;
  uploaded_at: string;
  format: string;
  processed: boolean;
  processed_at: string;
  user: number;
  semester: number;
  faculty: number;
}

export interface DownloadResponse {
  download_url: string;
}
