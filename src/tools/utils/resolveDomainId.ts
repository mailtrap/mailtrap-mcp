import { DomainIdRequest } from "../../types/mailtrap";
import { parseResolvedId } from "./resolveId";

/** Domain and company info tools: domain_id, then the legacy sending_domain_id. */
function resolveDomainId({
  domain_id,
  sending_domain_id,
}: DomainIdRequest): number {
  return parseResolvedId(
    domain_id ?? sending_domain_id,
    "domain_id (or sending_domain_id) must be a valid number",
    "Provide domain_id"
  );
}

/** A tool's input without its domain ID params. */
export function omitDomainId<T extends DomainIdRequest>({
  domain_id: _domainId,
  sending_domain_id: _sendingDomainId,
  ...params
}: T): Omit<T, keyof DomainIdRequest> {
  return params;
}

/** Splits a tool's input into its resolved domain ID and the remaining params. */
export function splitDomainId<T extends DomainIdRequest>(
  input: T
): [number, Omit<T, keyof DomainIdRequest>] {
  return [resolveDomainId(input), omitDomainId(input)];
}

export default resolveDomainId;
