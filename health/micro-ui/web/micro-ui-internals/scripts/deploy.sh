#!/bin/bash

curl -v -X POST "https://builds.digit.org/job/builds/job/Digit-Frontend/job/health/job/workbench-ui/buildWithParameters" \
  --user jagankumar-egov:11d7ebf352c32b2e2ad0ab6a339a4a2baa \
  --data-urlencode BRANCH="origin/console"


# curl https://builds.digit.org/job/builds/job/digit-ui/lastBuild/api/json | grep --color result\":null

