Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Get-Command pi -ErrorAction SilentlyContinue)) {
  throw 'pi not found in PATH'
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw 'npm not found in PATH'
}

$packages = @(
  'npm:pi-openplan',
  'npm:pi-lmstudio',
  'npm:pi-web-access',
  'npm:pi-agent-browser-native',
  'git:github.com/DietrichGebert/ponytail'
)

$installed = try { pi list | Out-String } catch { '' }

foreach ($pkg in $packages) {
  if ($installed -like "*$pkg*") {
    Write-Host "skip  $pkg"
  }
  else {
    Write-Host "install $pkg"
    pi install $pkg
  }
}

if (Get-Command agent-browser -ErrorAction SilentlyContinue) {
  Write-Host 'skip  agent-browser'
}
else {
  Write-Host 'install agent-browser'
  npm install -g agent-browser
}

Write-Host 'done'
