export interface Member {
    id: number,
    nuid: string,
    first_name: string,
    last_name: string,
    email: string,
    active: boolean,
    can_vote: boolean,
    receive_email_notifs: boolean,
    include_in_quorum: boolean,
    receive_not_present_email: boolean,
    can_log_in: boolean
}