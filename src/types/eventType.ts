// Event type
// Interface for the event
export interface Event {
  id: number;
  event_name: string;
  groups_called: string;
  start_time: Date;
  end_time: Date;
  sign_in_closed: boolean;
}
