import { requireClient } from "../../client";
import { DeleteProjectRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function deleteProject({
  project_id,
}: DeleteProjectRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandbox projects");

    const project = await mailtrap.testing.projects.delete(project_id);

    return buildSuccessResponse(
      `Sandbox project ${project_id} deleted.\n\n${JSON.stringify(
        project,
        null,
        2
      )}`
    );
  } catch (error) {
    return buildErrorResponse("delete sandbox project", error);
  }
}

export default deleteProject;
