import { requireClient } from "../../client";
import { ContactField } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listContactFields(): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contact fields");

    const raw = (await mailtrap.contactFields.getList()) as
      | ContactField[]
      | { data?: ContactField[] }
      | null
      | undefined;
    const fields: ContactField[] = Array.isArray(raw) ? raw : raw?.data ?? [];

    if (fields.length === 0) {
      return buildSuccessResponse(
        "No contact fields in your Mailtrap account."
      );
    }

    return buildSuccessResponse(JSON.stringify(fields, null, 2));
  } catch (error) {
    return buildErrorResponse("list contact fields", error);
  }
}

export default listContactFields;
