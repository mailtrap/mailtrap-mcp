import { requireClient } from "../../client";
import { GetProjectRequest } from "../../types/mailtrap";
import { buildErrorResponse } from "../utils/responses";

async function getProject({ project_id }: GetProjectRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandbox projects");

    const project = await mailtrap.testing.projects.getById(project_id);

    const inboxCount = project.inboxes?.length ?? 0;
    const inboxLines =
      project.inboxes && project.inboxes.length > 0
        ? project.inboxes
            .map(
              (inbox: any) =>
                `  - ${inbox.name} (ID: ${inbox.id}, emails: ${
                  inbox.emails_count ?? 0
                })`
            )
            .join("\n")
        : "  (no sandboxes)";

    const text = [
      `Sandbox project: ${project.name} (ID: ${project.id})`,
      `Sandboxes (${inboxCount}):`,
      inboxLines,
    ].join("\n");

    return {
      content: [{ type: "text", text }],
    };
  } catch (error) {
    return buildErrorResponse("get sandbox project", error);
  }
}

export default getProject;
