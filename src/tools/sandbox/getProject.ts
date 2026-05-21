import { requireClient } from "../../client";
import { GetProjectRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getProject({
  project_id,
}: GetProjectRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandbox projects");

    const project = await mailtrap.testing.projects.getById(project_id);

    return buildSuccessResponse(JSON.stringify(project, null, 2));
  } catch (error) {
    return buildErrorResponse("get sandbox project", error);
  }
}

export default getProject;
