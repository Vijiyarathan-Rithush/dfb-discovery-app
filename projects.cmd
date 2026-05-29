@echo off
set OUTPUT=projekt-inhalt.txt

if exist %OUTPUT% del %OUTPUT%

echo Projekt Export > %OUTPUT%
echo Erstellt am: %date% %time% >> %OUTPUT%
echo. >> %OUTPUT%

for %%F in (
  package.json
  vite.config.ts
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  index.html
  src\App.tsx
  src\main.tsx
  src\App.css
  src\styles\global.scss
  src\styles\_tokens.scss
  src\styles\_base.scss
  src\styles\_mixins.scss
  src\styles\_reset.scss
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