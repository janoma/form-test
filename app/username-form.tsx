"use client";

import {
  mergeForm,
  useForm,
  useStore,
  useTransform,
} from "@tanstack/react-form";
import { initialFormState } from "@tanstack/react-form/nextjs";
import { useActionState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { formOpts } from "./schema";
import processUsername from "./form-process";
import FieldInfo from "./field-info";

export default function UsernameForm() {
  const [actionState, action, isPending] = useActionState(
    processUsername,
    initialFormState
  );

  const form = useForm({
    ...formOpts,
    defaultValues: { username: "" },
    transform: useTransform(
      (baseForm) => {
        if (actionState.values && actionState.errors.length === 0) {
          baseForm.reset(actionState);
          toast.success("Username saved");
        } else if (actionState.errors.length > 0) {
          toast.error("Username not saved");
        }
        return mergeForm(baseForm, actionState);
      },
      [actionState]
    ),
  });

  const serverErrors = useStore(
    form.store,
    (state) => state.errorMap["onServer"]
  );

  return (
    <form
      action={action}
      className="space-y-4"
      onSubmit={() => void form.handleSubmit()}
    >
      <h1>Edit your username</h1>
      <p>
        <code>&quot;homer&quot;</code> fails during{" "}
        <code>onServerValidate</code>, <code>&quot;bart&quot;</code> fails with
        some DB error. Other values pass, as long as they satisfy the schema.
      </p>
      <form.Field name="username">
        {(field) => (
          <div>
            <Input
              name={field.name}
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>
      {serverErrors && (
        <div className="border-red-500 bg-red-100 rounded-lg p-4 text-sm">
          <div>Server says...</div>
          {serverErrors}
        </div>
      )}
      <form.Subscribe
        selector={(state) => [
          state.canSubmit,
          state.isSubmitting,
          state.isDefaultValue,
        ]}
      >
        {([canSubmit, isSubmitting, isDefaultValue]) => (
          <Button
            className="w-full sm:w-auto"
            disabled={!canSubmit || isDefaultValue || isSubmitting || isPending}
            type="submit"
          >
            {isSubmitting || isPending ? "Saving..." : "Save"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
