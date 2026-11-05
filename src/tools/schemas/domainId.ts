import { z } from "zod";

/** domain_id, plus the legacy sending_domain_id it replaced. */
export const domainIdProperties = {
  domain_id: {
    type: "integer",
    minimum: 1,
    description:
      "Domain ID, as returned by list-domains. Required unless the legacy sending_domain_id is given.",
  },
  sending_domain_id: {
    type: "integer",
    minimum: 1,
    description: "Legacy alias for domain_id.",
  },
};

/** Zod counterpart of domainIdProperties; resolve the ID with resolveDomainId. */
export const domainIdZodShape = {
  domain_id: z.number().int().min(1).optional(),
  sending_domain_id: z.number().int().min(1).optional(),
};
