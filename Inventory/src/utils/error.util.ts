export function createError(statusCode: number, errorMessage: string) {
  return { statusCode, errorMessage };
}
