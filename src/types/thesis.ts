
export interface ThesisSubmission {
  id: string;
  created_at: string;
  user_type: "lpu" | "non-lpu";
  name: string;
  student_number?: string;
  program_department?: string;
  school_name?: string;
  thesis_title: string;
}
