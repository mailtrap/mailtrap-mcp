import createSuppression from "../createSuppression";
import { requireClient } from "../../../client";

const mockClient = {
  suppressions: {
    create: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const created = {
  id: "abc-1",
  email: "alice@example.com",
  type: "manual import",
  sending_stream: "transactional",
  domain_name: "example.com",
  created_at: "2026-05-19T10:00:00Z",
};

describe("createSuppression", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates the suppression and reports the result", async () => {
    mockClient.suppressions.create.mockResolvedValue({ data: created });

    const result = await createSuppression({
      email: "alice@example.com",
      domain_id: 4321,
      sending_stream: "transactional",
    });

    expect(requireClient).toHaveBeenCalledWith("suppressions");
    expect(mockClient.suppressions.create).toHaveBeenCalledWith({
      email: "alice@example.com",
      domain_id: 4321,
      sending_stream: "transactional",
    });
    expect(result.content[0].text).toBe(
      "Suppression created: alice@example.com (ID: abc-1, type: manual import, stream: transactional, domain: example.com)."
    );
    expect(result.isError).toBeUndefined();
  });

  it("forwards type when provided", async () => {
    mockClient.suppressions.create.mockResolvedValue({ data: created });

    await createSuppression({
      email: "alice@example.com",
      domain_id: 4321,
      sending_stream: "bulk",
      type: "unsubscription",
    });

    expect(mockClient.suppressions.create).toHaveBeenCalledWith({
      email: "alice@example.com",
      domain_id: 4321,
      sending_stream: "bulk",
      type: "unsubscription",
    });
  });

  it("rejects a sending stream the endpoint does not accept", async () => {
    const result = await createSuppression({
      email: "alice@example.com",
      domain_id: 4321,
      sending_stream: "any",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("sending_stream");
    expect(mockClient.suppressions.create).not.toHaveBeenCalled();
  });

  it("rejects a missing domain id", async () => {
    const result = await createSuppression({
      email: "alice@example.com",
      sending_stream: "transactional",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("domain_id");
    expect(mockClient.suppressions.create).not.toHaveBeenCalled();
  });

  it("rejects unknown properties", async () => {
    const result = await createSuppression({
      email: "alice@example.com",
      domain_id: 4321,
      sending_stream: "transactional",
      reason: "typo for type",
    });

    expect(result.isError).toBe(true);
    expect(mockClient.suppressions.create).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.suppressions.create.mockRejectedValue(
      new Error("domain not found")
    );

    const result = await createSuppression({
      email: "alice@example.com",
      domain_id: 4321,
      sending_stream: "transactional",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create suppression: domain not found"
    );
  });
});
