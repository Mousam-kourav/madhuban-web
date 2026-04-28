/**
 * Custom zodResolver for Zod v4.
 * @hookform/resolvers v5 ships types compiled against Zod v4.0.x; our project
 * uses v4.3.x. The `_zod.version.minor` literal (3 vs 0) breaks the overload
 * match at compile time. This wrapper calls safeParseAsync directly so no
 * version-gated overload is needed.
 */
import type { Resolver, FieldValues, FieldErrors } from "react-hook-form";
import type { ZodType } from "zod";

export function zodV4Resolver<T extends FieldValues>(schema: ZodType<T>): Resolver<T> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors: FieldErrors<T> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".");
      if (!key) continue;
      // Only record the first error per field
      if (!(key in errors)) {
        // @ts-expect-error — FieldErrors<T> index signature is too narrow for dynamic keys
        errors[key] = { type: issue.code, message: issue.message };
      }
    }
    return { values: {}, errors };
  };
}
