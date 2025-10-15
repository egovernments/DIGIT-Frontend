#!/bin/sh

  set -e

  BRANCH="$(git branch --show-current 2>/dev/null || echo 'main')"

  echo "Main Branch: $BRANCH"

  STUDIO_REPO="DIGIT-Studio"
  INTERNALS="frontend/web/micro-ui-internals"

  if [ ! -d "$STUDIO_REPO" ]; then
      echo "Cloning DIGIT-Studio repository..."
      if [ -n "$GIT_TOKEN" ]; then
          git clone -b STUDIO-UI-4 "https://${GIT_TOKEN}@github.com/egovernments/DIGIT-Studio.git" "$STUDIO_REPO"
      else
          git clone -b STUDIO-UI-4 "https://github.com/egovernments/DIGIT-Studio.git" "$STUDIO_REPO"
      fi
  fi
  
  # Check if the internals path exists in the cloned repo and create symlink
  if [ -d "$STUDIO_REPO/$INTERNALS" ]; then
      echo "Creating micro-ui-internals symlink..."
      ln -sf "$STUDIO_REPO/$INTERNALS" micro-ui-internals
      INTERNALS="$STUDIO_REPO/$INTERNALS"
  elif [ -d "$STUDIO_REPO" ]; then
      echo "Creating micro-ui-internals symlink to root..."
      ln -sf "$STUDIO_REPO" micro-ui-internals
      INTERNALS="$STUDIO_REPO"
  fi

  if [ -f "$INTERNALS/example/src/UICustomizations.js" ]; then
      echo "Copying UICustomizations.js..."
      mkdir -p src/Customisations
      cp "$INTERNALS/example/src/UICustomizations.js" src/Customisations/
  else
      echo "Warning: UICustomizations.js not found, skipping copy"
  fi

  if [ -d "$INTERNALS" ]; then
      echo "Copying INTERNALS to micro-ui-internals folder..."
      rm -rf micro-ui-internals
      cp -r "$INTERNALS" micro-ui-internals
      cd ..
  else
      echo "Warning: INTERNALS directory not found, skipping copy"
      
  fi

  echo "Dependencies installation completed"