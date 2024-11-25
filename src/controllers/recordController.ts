import { PrismaClient } from "@prisma/client";

export class RecordController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  //would not have this if we just had event as an attribute (very easy with prisma)  :(
  async getRecordForMember(id: string) {
    const records = await this.prisma.attendanceRecord.findMany({
      where: {
        person_id: id,
      },
    });

    const evenIids = records.map((record) => record.event_id);
    const events = await this.prisma.event.findMany({
      where: {
        uuid: { in: evenIids },
      },
    });

    return records.map((record) => ({
      ...record,
      event: events.find((event) => event.uuid === record.event_id),
    }));
  }

  async getEventsForMemberRecord(id: string) {
    const records = await this.prisma.attendanceRecord.findMany({
      where: {
        person_id: id,
      },
    });

    const eventIds = records.map((record) => record.event_id);
    const events = await this.prisma.attendanceRecord.findMany({
      where: {
        event_id: { in: eventIds },
      },
    });
    return events;
  }
}
