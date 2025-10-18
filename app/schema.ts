import { formOptions } from "@tanstack/react-form/nextjs";
import { z } from "zod";

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Too short")
    .max(20, "Too long"),
});

export const formOpts = formOptions({
  defaultValues: {
    username: "",
  },
  validators: {
    onChange: schema,
  },
});
