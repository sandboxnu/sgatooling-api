// Controller class for the Event API endpoints
// The controller has a class and method that call the repository.
import {
  parseDataToEventType,
} from "../types/event";
import { parseTagType } from "../types/tags";
import { PrismaClient } from "@prisma/client";

class EventsController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllEvents() {
    const events = await this.prisma.event.findMany({
      select: {
        uuid: true,
        event_name: true,
        start_time: true,
        end_time: true,
        sign_in_closed: true,
        description: true,
        location: true,
        GroupExpectedAtEvent: {
          select: {
            membership_group: true,
          },
        },
      },
    });
    return events.map((event) => ({
      ...event,
      membership_group: event.GroupExpectedAtEvent.map((group) => parseTagType(group)),
    }));
  }

  async getEventsForMemberRecord(id: string) {
    const record = await this.prisma.attendanceRecord.findMany({
      include: {
        event: true
      },
      where: {
        person_id: id
      }
    })
    return record;
  }

  async getEvent(id: string) {
    const data = await this.prisma.event.findFirst({
      where:{
        uuid: id
      }
    })
    const eventTags = await this.prisma.groupExpectedAtEvent.findMany({
      select: {
        membership_group: true
      },
      where: {
        event_id: id
      }
    })

    const Tags = eventTags.map((tag) =>
      parseTagType({
        membership_group: tag.membership_group,
      })
    );

    // Tags returns a list of dictionaries
    // for instance [{membersip_group: 'abc}, {mebership_group: 'cba'}]
    // pull out the value for each dictionary
    const group_names = Tags.map((item) => item.membership_group);
    const joined_groups = group_names.join(",");

    // merge back with original Event
    const mergedEvent = {
      ...data,
      ...{ membership_group: joined_groups },
    };

    // throw into parser
    const parsedEvent = parseDataToEventType(mergedEvent);

    return parsedEvent;
  }
}

export default EventsController;
