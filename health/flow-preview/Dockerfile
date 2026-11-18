# HCM flow preview: the field worker app's flow screens as a Flutter web
# build, served by nginx at /flow-preview/ on the campaign console's
# (workbench-ui) domain. The console's "Preview in app" drawer embeds it.
#
# The source lives in egovernments/health-campaign-field-worker-app
# (apps/flow_preview); this file only lets DIGIT-Frontend's Build Pipeline
# (.github/workflows/build.yaml, pipeline "flow-preview") build and push it.
# Keep the build steps in sync with apps/flow_preview/docker/Dockerfile there.
#
# Build args (set in build/build-config.yml):
#   HCM_REF   branch of health-campaign-field-worker-app to build
#   HCM_REPO  repository URL (default: the egovernments repository)

ARG HCM_REPO=https://github.com/egovernments/health-campaign-field-worker-app
ARG HCM_REF=master

# --- Build ------------------------------------------------------------------
FROM ghcr.io/cirruslabs/flutter:3.22.2 AS build
ARG HCM_REPO
ARG HCM_REF

# The branch's current commit. ADD of a URL is re-checked on every build, so
# a new commit on HCM_REF invalidates the cached clone below; a plain
# `git clone` layer would otherwise be reused from the build cache.
ADD https://api.github.com/repos/egovernments/health-campaign-field-worker-app/commits/${HCM_REF} /tmp/hcm-commit.json

RUN set -eu; \
    sha=$(sed -n 's/^  "sha": "\([0-9a-f]\{40\}\)",$/\1/p' /tmp/hcm-commit.json | head -n 1); \
    test -n "$sha" || { echo "Could not read the commit of ${HCM_REF}"; cat /tmp/hcm-commit.json; exit 1; }; \
    git init -q /src; \
    git -C /src fetch -q --depth 1 "${HCM_REPO}.git" "$sha"; \
    git -C /src checkout -q FETCH_HEAD; \
    echo "Building health-campaign-field-worker-app ${HCM_REF} at $sha"; \
    echo "$sha" > /src/HCM_COMMIT

WORKDIR /src/apps/flow_preview
# Exactly what pubspec.lock pins (including the digit_ui_components git
# dependency).
RUN flutter pub get --enforce-lockfile

# --pwa-strategy=none        no service worker (see web/flutter_bootstrap.js)
# --no-web-resources-cdn     CanvasKit served from this image, not gstatic.com
# --base-href /flow-preview/ path the ingress routes to this service
RUN flutter build web --release \
      --pwa-strategy=none \
      --no-web-resources-cdn \
      --base-href /flow-preview/ \
 && cp /src/HCM_COMMIT build/web/HCM_COMMIT

# --- Serve ------------------------------------------------------------------
FROM nginx:mainline-alpine

COPY --from=build /src/apps/flow_preview/build/web /var/web/flow-preview
COPY --from=build /src/apps/flow_preview/docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
