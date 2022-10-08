#!/bin/bash
# a bash script to replace the build date in src/electron/licencing/buildDate.ts
# with the current date and time

EPOCH=(Get-Date).ToUniversalTime() -Format "yyyy-MM-ddTHH:mm:ssZ"

Add-Content src/electron/licencing/buildSettings.ts "// The contents of this file are overwritten by the release process."
Add-Content src/electron/licencing/buildSettings.ts "// *********************************************************************"
Add-Content src/electron/licencing/buildSettings.ts "export const buildDate = '${EPOCH}'"
Add-Content src/electron/licencing/buildSettings.ts "export const useStoreLicence = ${env:USE_STORE_LICENSE}"