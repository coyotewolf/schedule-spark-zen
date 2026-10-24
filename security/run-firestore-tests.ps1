param([Parameter(Mandatory=$true)][string]$ValidationToolsDirectory)
$ErrorActionPreference = 'Stop'
# Supply an isolated directory with firebase-tools 15.34.1,
# @firebase/rules-unit-testing 6.0.0 and firebase 13 installed.
$toolsDir = (Resolve-Path -LiteralPath $ValidationToolsDirectory).Path
$rules = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../firestore.rules')).Path
$fixture = Join-Path ([IO.Path]::GetTempPath()) ('schedule-security-' + [guid]::NewGuid())
New-Item -ItemType Directory -Path $fixture | Out-Null
$config = @{firestore=@{rules=$rules};emulators=@{firestore=@{host='127.0.0.1';port=8787};ui=@{enabled=$false};singleProjectMode=$true}}
[IO.File]::WriteAllText((Join-Path $fixture 'firebase.json'),($config | ConvertTo-Json -Depth 5))
$old = @{}
foreach($key in 'CI','NO_UPDATE_NOTIFIER','XDG_CONFIG_HOME','NODE_PATH') { $old[$key]=[Environment]::GetEnvironmentVariable($key,'Process') }
$before = @(Get-CimInstance Win32_Process -Filter "name='java.exe'" | Select-Object -ExpandProperty ProcessId)
$result = 1
try {
  $env:CI='true'; $env:NO_UPDATE_NOTIFIER='1'; $env:XDG_CONFIG_HOME=$fixture; $env:NODE_PATH=Join-Path $toolsDir 'node_modules'
  Push-Location $PSScriptRoot
  try {
    & (Join-Path $toolsDir 'node_modules/.bin/firebase.cmd') emulators:exec --only firestore --project demo-security-audit --config (Join-Path $fixture 'firebase.json') 'node --test firestore.test.cjs'
    $result=$LASTEXITCODE
  } finally { Pop-Location }
} finally {
  # Some Windows CLI versions leave Java alive after a successful shutdown.
  # Never stop a pre-existing emulator or a process with another rules file.
  Get-CimInstance Win32_Process -Filter "name='java.exe'" | Where-Object {
    $_.ProcessId -notin $before -and $_.CommandLine.Contains('cloud-firestore-emulator') -and
    $_.CommandLine.Contains('--project_id demo-security-audit') -and $_.CommandLine.Contains($rules)
  } | ForEach-Object { Stop-Process -Id $_.ProcessId }
  foreach($key in $old.Keys) { [Environment]::SetEnvironmentVariable($key,$old[$key],'Process') }
}
# Keep the unique fixture/log directory for diagnosis; no recursive deletion.
Write-Output "Fixture: $fixture"
exit $result
