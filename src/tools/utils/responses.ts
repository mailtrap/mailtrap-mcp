export interface ToolResponse {
  content: { type: string; text: string }[];
  isError?: boolean;
}

export function buildSuccessResponse(text: string): ToolResponse {
  return {
    content: [{ type: "text", text }],
  };
}

export function buildErrorResponse(
  action: string,
  error: unknown
): ToolResponse {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return {
    content: [{ type: "text", text: `Failed to ${action}: ${errorMessage}` }],
    isError: true,
  };
}
