import { requireClient } from "../../client";
import { UpdateProjectRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function updateProject({
  project_id,
  name,
}: UpdateProjectRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandbox projects");

    const project = await mailtrap.testing.projects.update(project_id, name);

    return buildSuccessResponse(
      `Sandbox project ${project_id} updated.\n\n${JSON.stringify(
        project,
        null,
        2
      )}`
    );
  } catch (error) {
    return buildErrorResponse("update sandbox project", error);
  }
}

export default updateProject;
