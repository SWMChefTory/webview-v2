import { z } from "zod";

const VideoInfoSchema = z.object({
  videoThumbnailUrl: z.string(),
  videoId: z.string(),
  videoSeconds: z.number(),
  // videoLastPlaySeconds: z.number(),
  videoTitle: z.string(),
  videoType: z.enum(["SHORTS", "NORMAL"]).optional(),
});

export { VideoInfoSchema };