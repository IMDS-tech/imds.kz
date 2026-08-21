# IMDS TECH Gmail logo via BIMI + CMC

## Target

Display the IMDS TECH brand mark next to authenticated mail from `@imds.kz` in mailbox providers that support BIMI with a Common Mark Certificate (CMC), including Gmail.

## Prepared asset

- BIMI SVG Tiny P/S: `public/.well-known/bimi/imds.svg`
- Production URL after deployment: `https://imds.kz/.well-known/bimi/imds.svg`
- The asset is square, has a solid background, contains no scripts, animation, external references, or embedded raster images, and stays below the BIMI 32 KB recommendation.

## Authentication gate

Do not publish the final BIMI record until all of these remain true for legitimate mail:

- SPF passes and aligns with the visible `From: imds.kz` domain, or aligned DKIM passes.
- DKIM passes and aligns with `imds.kz`.
- DMARC is enforced at 100%: `p=quarantine` or `p=reject` and `pct=100`.
- Subdomain policy is enforced (`sp=quarantine` or `sp=reject`) where applicable.

The IMDS Google DMARC aggregate report dated 2026-08-20 already showed SPF=pass, DKIM=pass, strict alignment, `p=quarantine`, `sp=quarantine`, and `pct=100` for mail from `89.207.250.55`. Re-check live DNS immediately before BIMI activation.

## CMC order

Use a Common Mark Certificate for the existing IMDS TECH logo as a Prior Use Mark. The logo has been publicly used for at least 12 months, which is the key prior-use criterion stated by DigiCert for this CMC path.

Expected validation material:

1. Legal organization details for IMDS TECH.
2. Proof that the applicant controls `imds.kz`.
3. Evidence that the submitted IMDS logo has been publicly used for at least 12 months; archived pages or other dated public evidence may be requested.
4. Identity/video validation requested by the certificate authority.
5. The exact BIMI SVG mark submitted for certificate issuance should match the mark we publish.

## Certificate hosting

After the CMC is issued, store the authority-provided PEM certificate at:

`public/.well-known/bimi/imds-cmc.pem`

Production URL:

`https://imds.kz/.well-known/bimi/imds-cmc.pem`

Do not create a fake or self-signed file at this location. The certificate must be the issued Mark Certificate from the certificate authority.

## Final DNS record

Only after the issued certificate is deployed and publicly reachable over HTTPS, publish this TXT record:

Host:

`default._bimi.imds.kz`

Value:

`v=BIMI1; l=https://imds.kz/.well-known/bimi/imds.svg; a=https://imds.kz/.well-known/bimi/imds-cmc.pem`

Use one BIMI TXT record for the selector. Do not publish multiple conflicting values.

## Activation verification

Before calling the rollout complete, verify:

1. `https://imds.kz/.well-known/bimi/imds.svg` returns HTTP 200 and `image/svg+xml`.
2. `https://imds.kz/.well-known/bimi/imds-cmc.pem` returns HTTP 200 and the issued certificate chain/data expected by the CA.
3. `_dmarc.imds.kz` remains at enforcement with `pct=100`.
4. `default._bimi.imds.kz` resolves to the exact final BIMI TXT value.
5. A fresh message from `@imds.kz` passes SPF, DKIM, and DMARC at Gmail.
6. Gmail recognizes the BIMI/CMC brand mark. Provider display remains subject to mailbox-provider reputation and eligibility checks.

## Important limitation

CMC can provide the sender logo in Gmail, but it does not provide the blue verified checkmark associated with a VMC-backed registered trademark. If IMDS later registers the mark, the BIMI deployment can be upgraded from CMC to VMC without changing the mail architecture.
