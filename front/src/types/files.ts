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

export interface FileRequirement {
  id: string;
  name: string;
}

export interface ProcessFileResponse {
  detail?: string;
  task_id?: string;
  file_id: number;
  file_name?: string;
  file_type?: string;
  processed?: boolean;
  processed_at?: string;
}

export interface ProcessFileStatus {
  task_id: string;
  state: "PENDING" | "STARTED" | "PROGRESS" | "SUCCESS" | "FAILURE" | string;
  status?: "completed" | "failed" | string;
  error?: string;
  first_error?: string;
  insert_result?: {
    errors?: string[];
  };
  file_id?: number;
  file_name?: string;
  file_type?: string;
  message?: string;
  meta?: {
    step?: string;
    records_count?: number;
  };
  result?: {
    status?: "completed" | "failed" | string;
    error?: string;
    first_error?: string;
    file_name?: string;
    insert_result?: {
      errors?: string[];
    };
    records_count?: number;
  };
}
