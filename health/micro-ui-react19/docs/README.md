# HCM Frontend — Documentation

Documentation for the HCM health frontend (`health/micro-ui-react19`).

Documentation lives at the level it describes: product-wide release notes here, module-specific notes inside each module.

---

## Product release notes

Cover all modules in a release — what shipped, what changed, and what must be configured before upgrading.

| Release | Notes |
|---|---|
| HCM v2.2 | [releases/v2.2/RELEASE-NOTES.md](releases/v2.2/RELEASE-NOTES.md) |
| HCM v2.1 | [releases/v2.1/RELEASE-NOTES.md](releases/v2.1/RELEASE-NOTES.md) |

Start here if you want the whole picture of a release. Go to the module docs below for implementation detail.

---

## Module documentation

Each module keeps its own release notes and technical documentation per release, under `docs/releases/<version>/`.

| Module | Path | v2.1 | v2.2 |
|---|---|---|---|
| Campaign Manager | `web/packages/modules/campaign-manager/docs` | ✅ | ✅ |
| Health DSS | `web/packages/modules/health-dss/docs` | ✅ | ✅ |
| Health HRMS | `web/packages/modules/health-hrms/docs` | ✅ | ✅ |
| Health Payments | `web/packages/modules/health-payments/docs` | ✅ | ✅ |
| Complaints Management (PGR) | `web/packages/modules/pgr/docs` | ✅ | ✅ |

Each version folder holds:

- `RELEASE-NOTES.md` — what changed for users, written for programme and QA readers
- `TECHNICAL-DOC.md` — implementation detail, file-level changes, and the PR change history

---

## Design documents

Feature design documents are not tied to a release and live outside the version folders:

| Document | Location |
|---|---|
| Group Vaccination HLD / LLD | `web/packages/modules/campaign-manager/docs/designDocs/` |

---

## Conventions

- A document lives at the level it describes — product docs here, module docs in the module.
- Version folders are lowercase and match the git tag (`v2.1`, `v2.2` for `HCM-v2.1`, `HCM-v2.2`).
- The version is carried by the folder, so filenames do not repeat it.
- A module with no changes in a release still gets a release folder, stating that explicitly.
