#!/bin/bash
# a bash script to replace the build date in src/electron/licencing/buildDate.ts
# with the current date and time

EPOCH=$( date -u +"%Y-%m-%dT%H:%M:%SZ" )

echo "// The contents of this file are overwritten by the release process." > src/electron/licencing/buildSettings.ts
echo "// *********************************************************************" >> src/electron/licencing/buildSettings.ts
echo "export const buildDate = '$EPOCH'" >> src/electron/licencing/buildSettings.ts
echo "export const useStoreLicence = $USE_STORE_LICENSE" >> src/electron/licencing/buildSettings.ts