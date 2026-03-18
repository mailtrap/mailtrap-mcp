import parseEmlBuffer from "../utils/parseEmlBuffer";

function multipartEml(): Buffer {
  const lines = [
    "From: a@b.c",
    "To: x@y.z",
    "Subject: T",
    "MIME-Version: 1.0",
    'Content-Type: multipart/alternative; boundary="b"',
    "",
    "--b",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    "Hello plain",
    "--b",
    "Content-Type: text/html; charset=UTF-8",
    "",
    "<p>Hello html</p>",
    "--b--",
  ];
  return Buffer.from(lines.join("\r\n"), "utf8");
}

describe("parseEmlBuffer", () => {
  it("extracts html and plain from multipart/alternative", async () => {
    const { htmlContent, textContent } = await parseEmlBuffer(multipartEml());
    expect(htmlContent).toContain("<p>Hello html</p>");
    expect(textContent).toContain("Hello plain");
  });

  it("returns empty html and text when no text parts", async () => {
    const emptyMime = Buffer.from(
      [
        "From: a@b.c",
        "To: x@y.z",
        "Subject: T",
        "MIME-Version: 1.0",
        "Content-Type: application/octet-stream",
        "",
        "binary only",
      ].join("\r\n"),
      "utf8"
    );
    const { htmlContent, textContent } = await parseEmlBuffer(emptyMime);
    expect(htmlContent).toBe("");
    expect(textContent).toBe("");
  });
});
