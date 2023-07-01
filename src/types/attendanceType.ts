// Attendance Type
// Interface for attendance
export interface Attendance extends Body {
  id: string;
  memberID: string;
  time_submitted: Date;
  eventID: string;
  request_type: string;
  change_status: string;
  reason: string;
  time_arriving?: Date;
  time_leaving?: Date;
}
