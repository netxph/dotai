Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Get-Command pi -ErrorAction SilentlyContinue)) {
  throw 'pi not found in PATH'
}

$packages = @(
  'npm:pi-openplan',
  'npm:pi-powershell',
  'npm:pi-lmstudio',
  'npm:pi-web-access',
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

Write-Host 'done'
