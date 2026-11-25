import { requireClient } from "../../client";
import { buildErrorResponse } from "../utils/responses";

async function listProjects(): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandbox projects");

    const projects = await mailtrap.testing.projects.getList();

    if (!projects || projects.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No sandbox projects found in your Mailtrap account.",
          },
        ],
      };
    }

    const projectList = projects
      .map((project: any) => {
        const inboxCount = project.inboxes?.length ?? 0;
        const inboxLines =
          project.inboxes && project.inboxes.length > 0
            ? project.inboxes
                .map(
                  (inbox: any) =>
                    `    - ${inbox.name} (ID: ${inbox.id}, emails: ${
                      inbox.emails_count ?? 0
                    })`
                )
                .join("\n")
            : "    (no sandboxes)";
        return `• ${project.name} (ID: ${project.id})\n  Sandboxes (${inboxCount}):\n${inboxLines}`;
      })
      .join("\n\n");

    return {
      content: [
        {
          type: "text",
          text: `Sandbox projects (${projects.length}):\n\n${projectList}`,
        },
      ],
    };
  } catch (error) {
    return buildErrorResponse("list sandbox projects", error);
  }
}

export default listProjects;
