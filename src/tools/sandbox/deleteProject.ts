import { requireClient } from "../../client";
import { DeleteProjectRequest } from "../../types/mailtrap";

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
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to delete sandbox project: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default deleteProject;
