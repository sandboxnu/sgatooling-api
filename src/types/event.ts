import { z } from "zod";

const EventSchema = z
  .object({
    id: z.string(),
    eventName: z.string(),
    startTime: z.date().optional(),
    endTime: z.date().optional(),
    signInClosed: z.boolean(),
    description: z.string(),
    location: z.string(),
    membershipGroup: z
      .array(z.enum(["New Senators Fall 2022", "All active"]))
      .optional(),
  })
  .strict();

export const parseDataToEventType = (data: any) => {
  const splitMembership = data.membership_group.split(",");
  const typedEvent = EventSchema.parse({
    id: data.uuid,
    eventName: data.event_name,
    ...(data.start_time && { startTime: new Date(data.start_time) }),
    ...(data.end_time && { endTime: new Date(data.end_time) }),
    signInClosed: !!data.sign_in_closed,
    description: data.description,
    location: data.location,
    membershipGroup: splitMembership,
  });
  return typedEvent as EventType;
};

export const parseEventType = (body: any): EventType => {
  const parsedEvent = EventSchema.parse(body);

  return parsedEvent as EventType;
};

export type EventType = z.infer<typeof EventSchema>;
