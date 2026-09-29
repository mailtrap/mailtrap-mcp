/** Single sandbox_id param (preferred everywhere except legacy test_inbox_id tools). */
export const sandboxIdProperty = {
  sandbox_id: {
    type: "number",
    description:
      "Mailtrap sandbox (test inbox) ID. Optional if MAILTRAP_SANDBOX_ID env var is set.",
  },
};

/** get/update/delete/clean-sandbox-inbox: preferred sandbox_id, legacy inbox_id. */
export const sandboxInboxIdProperties = {
  sandbox_id: {
    type: "number",
    description:
      "Preferred. Sandbox (test inbox) ID. On get-sandbox-inbox, optional if MAILTRAP_SANDBOX_ID is set.",
  },
  inbox_id: {
    type: "number",
    description: "Legacy alias for sandbox_id on sandbox inbox tools.",
  },
};

/** send-sandbox-email, get-sandbox-messages, show-sandbox-email-message only. */
export const legacySandboxInboxIdProperties = {
  sandbox_id: {
    type: "number",
    description:
      "Preferred. Mailtrap sandbox (test inbox) ID. Optional if MAILTRAP_SANDBOX_ID env var is set.",
  },
  test_inbox_id: {
    type: "number",
    description:
      "Legacy alias for sandbox_id. Used when sandbox_id is omitted.",
  },
};
