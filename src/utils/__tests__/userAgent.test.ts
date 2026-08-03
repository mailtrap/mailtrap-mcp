import config from "../../config";
import { buildUserAgent, formatClientInfo } from "../userAgent";

describe("formatClientInfo", () => {
  it("returns null when no info is provided", () => {
    expect(formatClientInfo(undefined)).toBeNull();
  });

  it("returns null when the name is empty or whitespace", () => {
    expect(formatClientInfo({ name: "", version: "1.0.0" })).toBeNull();
    expect(formatClientInfo({ name: "   ", version: "1.0.0" })).toBeNull();
  });

  it("renders name/version", () => {
    expect(formatClientInfo({ name: "Claude Desktop", version: "1.5.3" })).toBe(
      "Claude Desktop/1.5.3"
    );
  });

  it("renders just the name when no version is reported", () => {
    expect(formatClientInfo({ name: "Cursor" })).toBe("Cursor");
    expect(formatClientInfo({ name: "Cursor", version: "" })).toBe("Cursor");
  });

  it("strips parentheses and control characters that could break the header", () => {
    expect(
      formatClientInfo({ name: "Evil\n(client)", version: "1.0\r\n" })
    ).toBe("Evil client/1.0");
  });

  it("caps overly long tokens", () => {
    const longName = "a".repeat(200);
    const formatted = formatClientInfo({ name: longName, version: "1.0.0" });
    expect(formatted).toBe(`${"a".repeat(64)}/1.0.0`);
  });
});

describe("buildUserAgent", () => {
  it("returns the base user-agent when no client info is present", () => {
    expect(buildUserAgent(undefined)).toBe(config.USER_AGENT);
    expect(buildUserAgent({ name: "" })).toBe(config.USER_AGENT);
  });

  it("appends the client identity when present", () => {
    expect(buildUserAgent({ name: "Claude Desktop", version: "1.5.3" })).toBe(
      `${config.USER_AGENT} (client: Claude Desktop/1.5.3)`
    );
  });
});
