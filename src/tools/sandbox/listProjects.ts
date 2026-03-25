import { requireClient } from "../../client";

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
            : "    (no inboxes)";
        return `• ${project.name} (ID: ${project.id})\n  Inboxes (${inboxCount}):\n${inboxLines}`;
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to list sandbox projects: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default listProjects;
