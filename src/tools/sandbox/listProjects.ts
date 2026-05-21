import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listProjects(): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandbox projects");

    const projects = await mailtrap.testing.projects.getList();

    return buildSuccessResponse(JSON.stringify(projects ?? [], null, 2));
  } catch (error) {
    return buildErrorResponse("list sandbox projects", error);
  }
}

export default listProjects;
