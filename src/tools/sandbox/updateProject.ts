import { requireClient } from "../../client";
import { UpdateProjectRequest } from "../../types/mailtrap";

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
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to update sandbox project: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default updateProject;
