# FormConfig GitOps

Devs manage HCM FormConfig(Template) JSON files here. CI validates every PR and
deploys merged configs to MDMS automatically.

## Flow

```
dev commits config -> raises PR
        |
        v
  [FormConfig Validate]  (pull_request, automatic, no credentials needed)
   - runs tools/form-config-corrector on each changed config
   - PR check fails if the config needs fixes
   - corrected JSON + report uploaded as workflow artifact
        |
        v  merge to master
  Local push (run by a deploy engineer, prompted for credentials EACH time)
   $ node tools/form-config-corrector/ci.js push \
       --file form-configs/unified-uat/registration.json --env unified-uat
   DIGIT username for https://unified-uat.digit.org: _
   DIGIT password: ********
   - re-validates + auto-fixes
   - creates/updates the MDMS record (matched by data.name)
   - upserts generated localizations (module + hcm-appconfiguration)
```

DIGIT credentials are **never stored in GitHub**. The push step asks for the
username and password interactively on every run (password input is masked) and
only holds them in memory for that run. Requires Node.js 18+. Useful flags:
`--dry-run` (show what would change without writing), `--ai-key <key>` (AI-enhance
generated messages), `--token <token>` (reuse an existing access token).

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
4. Merge. A deploy engineer then runs the local push command shown above and
   enters DIGIT credentials when prompted.

You can also run the exact same validation locally:

```bash
node tools/form-config-corrector/ci.js validate --file form-configs/unified-uat/registration.json
```

## Optional: deploying from GitHub Actions instead

The **FormConfig Deploy** workflow (manual trigger only) can push from CI for
teams that are OK storing a service-account credential in GitHub. Create a
GitHub **Environment** (repo Settings -> Environments) named after each folder
(`unified-dev`, `unified-qa`, `unified-uat`) with these secrets:

| Secret | Purpose |
|---|---|
| `DIGIT_USERNAME` | DIGIT employee username used for MDMS/localization APIs |
| `DIGIT_PASSWORD` | Password for that user |
| `ANTHROPIC_API_KEY` | Only needed when AI enhancement is turned on (see below) |

To also deploy automatically on merge, add a `push: branches: [master]` trigger
back to `.github/workflows/form-config-deploy.yml`.

### Require approval on every CI deploy

On each environment, enable **Required reviewers** and add the people allowed to
approve. GitHub then pauses every deploy to that environment — including
merge-triggered ones — and asks a reviewer to click **Approve deployment**
before anything is pushed to MDMS:

1. Settings -> Environments -> (environment) -> check **Required reviewers**
2. Add up to 6 users/teams -> Save protection rules
3. Every run of *FormConfig Deploy* now waits on the run page under
   "Review deployments" until someone approves (or rejects) it

Credentials are never re-entered per run — the stored environment secrets are
only released to the job after a reviewer approves.

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
