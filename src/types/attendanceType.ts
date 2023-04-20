// Attendance Type
// Interface for attendance
export interface Attendance extends Body {
  name: string;
  time_submitted: Date;
  date_of_change: Date;
  type: string;
  change_status: string;
  reason: string;
  time_arriving?: Date;
  time_leaving?: Date;
}
