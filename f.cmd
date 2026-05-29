@echo off
set OUTPUT=upload-files.txt

if exist %OUTPUT% del %OUTPUT%

for %%F in (
  backend\server.js
  src\api\ObjectApi.ts
  src\pages\AdminPage.tsx
  src\pages\EditObjectPage.tsx
  src\pages\ObjectPage.tsx
  src\types\ObjectData.ts
  src\styles\_layout.scss
  package.json
) do (
  if exist %%F (
    echo. >> %OUTPUT%
    echo ============================================================ >> %OUTPUT%
    echo DATEI: %%F >> %OUTPUT%
    echo ============================================================ >> %OUTPUT%
    echo. >> %OUTPUT%
    type %%F >> %OUTPUT%
    echo. >> %OUTPUT%
  )
)

echo Fertig. Datei wurde erstellt: %OUTPUT%
pause