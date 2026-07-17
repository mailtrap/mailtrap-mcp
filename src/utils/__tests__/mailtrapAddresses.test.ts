import {
  buildFromAddress,
  normalizeAddressList,
  normalizeToRecipients,
  parseSandboxTo,
  toMailtrapAddress,
} from "../mailtrapAddresses";

describe("toMailtrapAddress", () => {
  it("wraps a plain email string", () => {
    expect(toMailtrapAddress(" john@example.com ")).toEqual({
      email: "john@example.com",
    });
  });

  it("keeps email and trimmed name from an object", () => {
    expect(
      toMailtrapAddress({ email: "john@example.com", name: " John " })
    ).toEqual({
      email: "john@example.com",
      name: "John",
    });
  });

  it("drops an empty name", () => {
    expect(
      toMailtrapAddress({ email: "john@example.com", name: "  " })
    ).toEqual({
      email: "john@example.com",
    });
  });

  it("revives a JSON-stringified object", () => {
    expect(
      toMailtrapAddress('{"email": "john@example.com", "name": "John"}')
    ).toEqual({ email: "john@example.com", name: "John" });
  });

  it("throws on an address without a usable email", () => {
    expect(() => toMailtrapAddress("   ")).toThrow("Invalid address");
    expect(() => toMailtrapAddress({ email: "" })).toThrow("Invalid address");
  });
});

describe("buildFromAddress", () => {
  it("falls back to the default email when from is undefined", () => {
    expect(buildFromAddress(undefined, "default@example.com")).toEqual({
      email: "default@example.com",
    });
  });

  it("throws when from is undefined and no default is set", () => {
    expect(() => buildFromAddress(undefined, undefined)).toThrow(
      "Provide 'from' or set DEFAULT_FROM_EMAIL"
    );
  });

  it("normalizes an explicit from address", () => {
    expect(
      buildFromAddress(
        { email: "sender@example.com", name: "Sender" },
        undefined
      )
    ).toEqual({ email: "sender@example.com", name: "Sender" });
  });
});

describe("normalizeToRecipients", () => {
  it("accepts a single email string", () => {
    expect(normalizeToRecipients("john@example.com")).toEqual([
      { email: "john@example.com" },
    ]);
  });

  it("accepts a single address object", () => {
    expect(
      normalizeToRecipients({ email: "john@example.com", name: "John" })
    ).toEqual([{ email: "john@example.com", name: "John" }]);
  });

  it("accepts a mixed array of strings and objects", () => {
    expect(
      normalizeToRecipients([
        "a@example.com",
        { email: "b@example.com", name: "B" },
      ])
    ).toEqual([
      { email: "a@example.com" },
      { email: "b@example.com", name: "B" },
    ]);
  });

  it("drops entries without a usable email", () => {
    expect(
      normalizeToRecipients(["  ", { email: "" }, "a@example.com"])
    ).toEqual([{ email: "a@example.com" }]);
  });

  // Some MCP clients strip `oneOf` from property schemas and then deliver
  // array/object arguments as JSON-encoded strings.
  it("revives a JSON-stringified array of strings", () => {
    expect(normalizeToRecipients('["john@example.com"]')).toEqual([
      { email: "john@example.com" },
    ]);
  });

  it("revives a JSON-stringified array of objects (pretty-printed)", () => {
    expect(
      normalizeToRecipients(
        '[{"email": "john@example.com", "name": "John Doe"}]'
      )
    ).toEqual([{ email: "john@example.com", name: "John Doe" }]);
  });

  it("revives a JSON-stringified single object", () => {
    expect(normalizeToRecipients('{"email":"john@example.com"}')).toEqual([
      { email: "john@example.com" },
    ]);
  });

  it("keeps a string that merely looks JSON-ish but does not parse", () => {
    expect(normalizeToRecipients("[not-json]")).toEqual([
      { email: "[not-json]" },
    ]);
  });

  it("drops nested arrays instead of recursing into them", () => {
    expect(normalizeToRecipients([["a@example.com"]] as never)).toEqual([]);
    const depth = 10000;
    const nested = `${"[".repeat(depth)}"a@example.com"${"]".repeat(depth)}`;
    expect(normalizeToRecipients(nested)).toEqual([]);
  });
});

describe("normalizeAddressList", () => {
  it("normalizes an array of mixed entries", () => {
    expect(
      normalizeAddressList(["a@example.com", { email: "b@example.com" }])
    ).toEqual([{ email: "a@example.com" }, { email: "b@example.com" }]);
  });

  it("revives JSON-stringified items inside a real array", () => {
    expect(
      normalizeAddressList(['{"email": "a@example.com", "name": "A"}'])
    ).toEqual([{ email: "a@example.com", name: "A" }]);
  });

  it("revives the whole list when it arrives JSON-stringified", () => {
    expect(
      normalizeAddressList('[{"email": "a@example.com"}, "b@example.com"]')
    ).toEqual([{ email: "a@example.com" }, { email: "b@example.com" }]);
  });
});

describe("parseSandboxTo", () => {
  it("parses a comma-separated string of plain emails", () => {
    expect(parseSandboxTo("a@example.com, b@example.com")).toEqual([
      { email: "a@example.com" },
      { email: "b@example.com" },
    ]);
  });

  it("skips invalid entries in a comma-separated string", () => {
    expect(parseSandboxTo("a@example.com, not-an-email, ")).toEqual([
      { email: "a@example.com" },
    ]);
  });

  it("normalizes an array of address params", () => {
    expect(
      parseSandboxTo([{ email: "a@example.com", name: "A" }, "b@example.com"])
    ).toEqual([
      { email: "a@example.com", name: "A" },
      { email: "b@example.com" },
    ]);
  });

  it("revives a JSON-stringified array of objects (pretty-printed)", () => {
    expect(
      parseSandboxTo('[{"email": "john@example.com", "name": "John Doe"}]')
    ).toEqual([{ email: "john@example.com", name: "John Doe" }]);
  });

  it("revives a JSON-stringified array of strings", () => {
    expect(parseSandboxTo('["john@example.com"]')).toEqual([
      { email: "john@example.com" },
    ]);
  });
});
