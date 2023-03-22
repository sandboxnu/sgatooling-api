// Attendance Type
// Interface for attendance 
export interface Attendance {
  name: string,
  time_submitted: date,
  date_of_change: date,
  type: string,
  change_status: string,
  reason: string,
  time_arriving: date,
  time_leaving: date
}