import warnDeprecated from "../deprecation";

describe("warnDeprecated", () => {
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it("logs the old and new name to stderr", () => {
    warnDeprecated("OLD_NAME_A", "NEW_NAME_A");

    expect(consoleError).toHaveBeenCalledWith(
      "[mailtrap-mcp] OLD_NAME_A is deprecated and will be removed in a future major release; use NEW_NAME_A instead."
    );
  });

  it("logs each old name only once", () => {
    warnDeprecated("OLD_NAME_B", "NEW_NAME_B");
    warnDeprecated("OLD_NAME_B", "NEW_NAME_B");
    warnDeprecated("OLD_NAME_C", "NEW_NAME_C");

    expect(consoleError).toHaveBeenCalledTimes(2);
  });
});
