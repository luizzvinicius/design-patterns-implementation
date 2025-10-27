import { HTTPException } from "hono/http-exception";
import z from "zod";

export function validateWithSchema<T>(schema: z.ZodSchema<T>, value: unknown): T {
	const result = schema.safeParse(value);
	if (!result.success) {
		throw new HTTPException(400, {
			message: z.prettifyError(result.error),
		});
	}
	return result.data as T;
}