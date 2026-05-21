import { requireClient } from "../../client";
import { CreateProjectRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function createProject({
  name,
}: CreateProjectRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandbox projects");

    const project = await mailtrap.testing.projects.create(name);

    return buildSuccessResponse(
      `Sandbox project "${name}" created.\n\n${JSON.stringify(
        project,
        null,
        2
      )}`
    );
  } catch (error) {
    return buildErrorResponse("create sandbox project", error);
  }
}

export default createProject;
