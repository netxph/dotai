Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Get-Command pi -ErrorAction SilentlyContinue)) {
  throw 'pi not found in PATH'
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw 'npm not found in PATH'
}

$packages = @(
  'npm:@plannotator/pi-extension',
  'npm:pi-lmstudio',
  'npm:pi-web-access',
  'npm:pi-agent-browser-native',
  'npm:pi-powerline-footer',
  'npm:pi-codebase-memory-mcp',
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

if (Get-Command codebase-memory-mcp -ErrorAction SilentlyContinue) {
  Write-Host 'skip  codebase-memory-mcp'
}
else {
  $installer = Join-Path $env:TEMP 'codebase-memory-mcp-install.ps1'
  Write-Host 'install codebase-memory-mcp'
  Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.ps1' -OutFile $installer
  Unblock-File $installer
  & $installer
  Remove-Item $installer -Force
}

Write-Host 'done'
