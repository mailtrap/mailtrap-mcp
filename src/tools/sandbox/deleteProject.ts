import { requireClient } from "../../client";
import { DeleteProjectRequest } from "../../types/mailtrap";
import { buildErrorResponse } from "../utils/responses";

async function deleteProject({ project_id }: DeleteProjectRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandbox projects");

    const project = await mailtrap.testing.projects.delete(project_id);

    return {
      content: [
        {
          type: "text",
          text: `Sandbox project deleted successfully:\n\n• Name: ${project.name}\n• ID: ${project.id}`,
        },
      ],
    };
  } catch (error) {
    return buildErrorResponse("delete sandbox project", error);
  }
}

export default deleteProject;
