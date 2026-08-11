# FormConfig GitOps

Devs manage HCM FormConfig(Template) JSON files here. CI validates every PR and
deploys merged configs to MDMS automatically.

## Flow

```
dev commits config -> raises PR
        |
        v
  [FormConfig Validate]  (pull_request)
   - runs tools/form-config-corrector on each changed config
   - PR check fails if the config needs fixes
   - corrected JSON + report uploaded as workflow artifact
        |
        v  merge to master
  [FormConfig Deploy]    (push)
   - re-validates + auto-fixes
   - creates/updates the MDMS record (matched by data.name)
   - upserts generated localizations (module + hcm-appconfiguration)
```

## Layout

```
form-configs/
  environments.json        environment name -> { url, tenant, locale, schema }
  <environment>/           one folder per target environment
    <module>.json          a FormConfig(Template) JSON (single object, array, or MDMS wrapper)
```

The folder name decides where a config is deployed. `form-configs/unified-uat/registration.json`
merges to master -> pushed to `https://unified-uat.digit.org`.

## Adding a config

1. Create/edit a JSON file under `form-configs/<environment>/`.
2. Raise a PR. The **FormConfig Validate** check runs automatically.
3. If it fails, download the `formconfig-corrected` artifact from the workflow run —
   it contains the auto-corrected JSON — or fix the reported issues manually,
   then push again.
4. Merge. The **FormConfig Deploy** workflow pushes the config and localizations to MDMS.

You can also run the exact same validation locally:

```bash
node tools/form-config-corrector/ci.js validate --file form-configs/unified-uat/registration.json
```

## Required GitHub setup (one time, per environment)

Create a GitHub **Environment** (repo Settings -> Environments) named after each
folder (`unified-dev`, `unified-qa`, `unified-uat`) with these secrets:

| Secret | Purpose |
|---|---|
| `DIGIT_USERNAME` | DIGIT employee username used for MDMS/localization APIs |
| `DIGIT_PASSWORD` | Password for that user |
| `ANTHROPIC_API_KEY` | Only needed when AI enhancement is turned on (see below) |

Add required reviewers on the environment if pushes to that env should need
manual approval before deploying.

## AI-enhanced localization messages (optional)

Generated localization messages are rule-based by default (`REGISTRATION_HEAD_NAME`
-> "Head Name"). An optional AI pass rewrites them into more natural labels and
error messages. It is **off by default** and controlled by a boolean:

| Trigger | Toggle |
|---|---|
| Deploy on merge to master | Variable `AI_ENHANCE=true` (Settings -> Variables, repo- or environment-level) |
| Manual run (workflow_dispatch) | `ai_enhance` checkbox on the run form |

When the toggle is on, the `ANTHROPIC_API_KEY` secret must be set on the target
environment. If the toggle is on but the key is missing, the deploy still runs
and falls back to rule-based messages (with a warning).
