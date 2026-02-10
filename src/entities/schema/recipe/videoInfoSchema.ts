import { z } from "zod";

const enum VideoType {
  SHORTS = "SHORTS",
  NORMAL = "NORMAL",
}

const VideoInfoSchema = z.object({
  videoId: z.string(),
  videoTitle: z.string(),
  channelTitle: z.string(),
  videoThumbnailUrl: z.string(),
  videoSeconds: z.number(),
  videoType: z.enum([VideoType.SHORTS, VideoType.NORMAL]),
});

export { VideoInfoSchema, VideoType };

