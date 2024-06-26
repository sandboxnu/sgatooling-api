// Controller class for the Event API endpoints
// The controller has a class and method that call the repository.
import { pool } from "../utils";
import { RowDataPacket } from "mysql2";
import { TagSchema, parseDataToEventType } from "../types/types";

class EventsController {
  async getAllEvents() {
    const [data] = await pool.query(
      "SELECT uuid, event_name, start_time, end_time,sign_in_closed, description, location, GROUP_CONCAT(membership_group) as membership_group FROM Event JOIN GroupExpectedAtEvent ON event_id = Event.uuid GROUP BY event_id"
    );

    const parsedRowData = data as RowDataPacket[];
    const Events = parsedRowData
      .map((event) => {
        try {
          const parsedEvent = parseDataToEventType(event);
          return parsedEvent;
        } catch (err) {
          return null;
        }
      })
      .filter(Boolean);

    return Events;
  }

  async getEvent(id: string) {
    const [data] = await pool.query(`SELECT * FROM Event WHERE uuid = ?`, [id]);
    const parsedRowData = (data as RowDataPacket)[0];

    const [eventTags] = await pool.query(
      `SELECT membership_group FROM Event JOIN GroupExpectedAtEvent ON GroupExpectedAtEvent.event_id = Event.uuid WHERE event_id = ?`,
      [id]
    );

    const parsedTags = eventTags as RowDataPacket[];

    const Tags = parsedTags.map((tag) =>
      TagSchema.parse({
        membership_group: tag.membership_group,
      })
    );

    //Tags returns a list of dictionaries
    // for instance [{membersip_group: 'abc}, {mebership_group: 'cba'}]
    // pull out the value for each dictionary
    const group_names = Tags.map((item) => item.membership_group);
    const joined_groups = group_names.join(",");

    // merge back with original Event
    const mergedEvent = {
      ...parsedRowData,
      ...{ membership_group: joined_groups },
    };

    // throw into parser
    const parsedEvent = parseDataToEventType(mergedEvent);

    return parsedEvent;
  }
}

export default EventsController;
