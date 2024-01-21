import * as z from "zod";

export const createSchema = z.object({
  title: z.string().min(1, {
    message: "Title must be at least 1 characters.",
  }),
  description: z.string().min(1, {
    message: "Description must be at least 1 characters.",
  }),
  streetViewUrl: z.string().url({
    message: "Street view url must be a valid url.",
  }),
  long: z.number(),
  lat: z.number(),
  pitch: z.number(),
  fov: z.number(),
  zoom: z.number(),
});
