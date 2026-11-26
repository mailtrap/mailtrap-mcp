import { requireClient } from "../../client";
import { CreateProjectRequest } from "../../types/mailtrap";
import { buildErrorResponse } from "../utils/responses";

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
    return buildErrorResponse("create sandbox project", error);
  }
}

export default createProject;
