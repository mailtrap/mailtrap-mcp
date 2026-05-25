import { buildErrorResponse, buildSuccessResponse } from "../responses";

describe("buildSuccessResponse", () => {
  it("wraps text into a single content item", () => {
    const result = buildSuccessResponse("Done.");

    expect(result).toEqual({
      content: [{ type: "text", text: "Done." }],
    });
    expect(result.isError).toBeUndefined();
  });

  it("preserves empty strings", () => {
    const result = buildSuccessResponse("");

    expect(result.content).toEqual([{ type: "text", text: "" }]);
  });

  it("preserves multi-line text verbatim", () => {
    const multiline = "Line 1\nLine 2\nLine 3";

    const result = buildSuccessResponse(multiline);

    expect(result.content[0].text).toBe(multiline);
  });
});

describe("buildErrorResponse", () => {
  it("formats Error instances using their message", () => {
    const result = buildErrorResponse(
      "do thing",
      new Error("something exploded")
    );

    expect(result).toEqual({
      content: [
        { type: "text", text: "Failed to do thing: something exploded" },
      ],
      isError: true,
    });
  });

  it("coerces non-Error values via String()", () => {
    const result = buildErrorResponse("do thing", "raw string failure");

    expect(result.content[0].text).toBe(
      "Failed to do thing: raw string failure"
    );
    expect(result.isError).toBe(true);
  });

  it("handles null and undefined errors", () => {
    expect(buildErrorResponse("do thing", null).content[0].text).toBe(
      "Failed to do thing: null"
    );
    expect(buildErrorResponse("do thing", undefined).content[0].text).toBe(
      "Failed to do thing: undefined"
    );
  });

  it("interpolates the action verb into the message", () => {
    const result = buildErrorResponse(
      "list sandboxes",
      new Error("network down")
    );

    expect(result.content[0].text).toBe(
      "Failed to list sandboxes: network down"
    );
  });
});
