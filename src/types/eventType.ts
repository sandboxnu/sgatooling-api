// Event type
// Interface for the event
export interface Event {
    // These types aren't defined correctly
    // TODO: fix this
    id: number;
    event_name: string;
    groups_called: groups[];
    start_time: time;
    end_time: time;
    sign_in_closed: boolean;
}