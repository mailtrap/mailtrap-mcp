const listTrackingOptOutsSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      description:
        "Optional email filter. Returns tracking opt-outs matching this address.",
    },
    start_time: {
      type: "string",
      description:
        "Only opt-outs created at or after this time (ISO 8601, e.g. 2026-08-01T00:00:00Z).",
    },
    end_time: {
      type: "string",
      description:
        "Only opt-outs created at or before this time (ISO 8601, e.g. 2026-08-31T23:59:59Z).",
    },
    last_id: {
      type: "string",
      description:
        "Pagination cursor — the `last_id` from the previous response, to fetch the next page.",
    },
  },
  additionalProperties: false,
};

export default listTrackingOptOutsSchema;
