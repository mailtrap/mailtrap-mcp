const createContactEventSchema = {
  type: "object",
  properties: {
    contact_identifier: {
      type: "string",
      description: "Contact ID or email to attach the event to.",
    },
    name: {
      type: "string",
      description:
        "Event name. Used to match contact-list automations triggered by this event.",
    },
    params: {
      type: "object",
      description:
        "Arbitrary key/value parameters for the event. Values may be string, number, boolean, or null.",
      additionalProperties: {
        type: ["string", "number", "boolean", "null"],
      },
    },
  },
  required: ["contact_identifier", "name", "params"],
  additionalProperties: false,
};

export default createContactEventSchema;
