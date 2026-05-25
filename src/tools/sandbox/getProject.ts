import { requireClient } from "../../client";
import { GetProjectRequest } from "../../types/mailtrap";

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
        : "  (no inboxes)";

    const text = [
      `Sandbox project: ${project.name} (ID: ${project.id})`,
      `Inboxes (${inboxCount}):`,
      inboxLines,
    ].join("\n");

    return {
      content: [{ type: "text", text }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to get sandbox project: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default getProject;
