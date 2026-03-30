import { requireClient } from "../../client";
import { CreateProjectRequest } from "../../types/mailtrap";

async function createProject({ name }: CreateProjectRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandbox projects");

    const project = await mailtrap.testing.projects.create(name);

    return {
      content: [
        {
          type: "text",
          text: `Sandbox project created successfully:\n\n• Name: ${project.name}\n• ID: ${project.id}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to create sandbox project: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default createProject;
