import { z } from "zod";

export const TagSchema = z.object({
  membership_group: z.string(),
});

export const parseTagType = (body: any) => {
  const parsedTag = TagSchema.parse(body);

  return parsedTag as Tags;
};

export type Tags = z.infer<typeof TagSchema>;
