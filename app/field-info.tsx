import { AnyFieldApi } from "@tanstack/react-form";

export default function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <div>
      {field.state.meta.isTouched && !field.state.meta.isValid
        ? field.state.meta.errors.map((err: { message: string }) => (
            <p
              className="text-destructive text-sm"
              key={err.message}
              role="alert"
            >
              {err.message}
            </p>
          ))
        : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </div>
  );
}
