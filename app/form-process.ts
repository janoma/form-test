"use server";

import {
  createServerValidate,
  initialFormState,
  ServerFormState,
  ServerValidateError,
} from "@tanstack/react-form/nextjs";
import "server-only";

import { formOpts } from "./schema";

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (value.username === "homer") {
      return "Username cannot be homer";
    }
  },
});

export default async function processUsername(
  _prev: unknown,
  formData: FormData
) {
  try {
    const validatedData = await serverValidate(formData);
    const { username } = validatedData;

    if (username === "bart") {
      return {
        errors: ["Unexpected DB error"],
        values: { ...validatedData },
      }
    }

    // Success
    return { ...initialFormState, values: { ...validatedData } };
  } catch (e) {
    if (e instanceof ServerValidateError) {
      // You'll get here when the value is "homer"
      return e.formState;
    }

    // Some other error occurred while validating your form
    throw e;
  }
}
