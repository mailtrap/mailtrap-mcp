const deleteTrackingOptOutSchema = {
  type: "object",
  properties: {
    tracking_opt_out_id: {
      type: "string",
      description: "ID of the tracking opt-out to delete",
    },
  },
  required: ["tracking_opt_out_id"],
  additionalProperties: false,
};

export default deleteTrackingOptOutSchema;
