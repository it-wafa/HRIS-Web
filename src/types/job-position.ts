// ════════════════════════════════════════════
// JOB POSITION TYPES
// ════════════════════════════════════════════

export interface JobPosition {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreatePositionPayload {
  title: string;
}

export interface UpdatePositionPayload {
  title?: string;
}
