import { requireClient } from "../../client";
import { UpdateProjectRequest } from "../../types/mailtrap";
import { buildErrorResponse } from "../utils/responses";

async function updateProject({
  project_id,
  name,
}: UpdateProjectRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandbox projects");

    const project = await mailtrap.testing.projects.update(project_id, name);

    return {
      content: [
        {
          type: "text",
          text: `Sandbox project updated successfully:\n\n• Name: ${project.name}\n• ID: ${project.id}`,
        },
      ],
    };
  } catch (error) {
    return buildErrorResponse("update sandbox project", error);
  }
}

export default updateProject;
