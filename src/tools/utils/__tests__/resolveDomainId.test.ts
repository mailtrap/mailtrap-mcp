import resolveDomainId from "../resolveDomainId";

describe("resolveDomainId", () => {
  it("uses domain_id when provided", () => {
    expect(resolveDomainId({ domain_id: 10 })).toBe(10);
  });

  it("prefers domain_id over sending_domain_id", () => {
    expect(resolveDomainId({ domain_id: 10, sending_domain_id: 20 })).toBe(10);
  });

  it("falls back to the legacy sending_domain_id", () => {
    expect(resolveDomainId({ sending_domain_id: 20 })).toBe(20);
  });

  it("throws when neither param is set", () => {
    expect(() => resolveDomainId({})).toThrow("Provide domain_id");
  });

  it("rejects a blank domain_id instead of resolving to 0", () => {
    expect(() =>
      resolveDomainId({ domain_id: " " as unknown as number })
    ).toThrow("Provide domain_id");
  });

  it.each(["abc", "0x10", "1e3"])(
    "rejects the non-decimal domain_id %p",
    (id) => {
      expect(() =>
        resolveDomainId({ domain_id: id as unknown as number })
      ).toThrow("domain_id (or sending_domain_id) must be a positive integer");
    }
  );

  it.each([0, -5, 1.5])("rejects the out-of-range domain_id %p", (id) => {
    expect(() => resolveDomainId({ domain_id: id })).toThrow(
      "domain_id (or sending_domain_id) must be a positive integer"
    );
  });
});
