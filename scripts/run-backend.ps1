param([switch]$ServeFrontend, [int]$Port = 3000)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
if (-not $env:JAVA_HOME) {
    $portableJdk = Get-ChildItem -LiteralPath (Join-Path $projectRoot '.tools') -Directory -Filter 'jdk-21*' -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($portableJdk) { $env:JAVA_HOME = $portableJdk.FullName }
}
if (-not $env:JAVA_HOME -or -not (Test-Path -LiteralPath (Join-Path $env:JAVA_HOME 'bin/javac.exe'))) {
    throw 'Configure JAVA_HOME com um JDK 21 (não apenas um JRE).'
}
Push-Location $projectRoot
try {
    if ($ServeFrontend) {
        Push-Location frontend
        try { & npm.cmd ci; if ($LASTEXITCODE -ne 0) { throw 'Falha no npm ci.' }; & npm.cmd run build; if ($LASTEXITCODE -ne 0) { throw 'Falha no build React.' } }
        finally { Pop-Location }
    }
    Push-Location backend
    try {
        & .\mvnw.cmd -B -DskipTests package
        if ($LASTEXITCODE -ne 0) { throw 'Falha no build Java.' }
        $env:PORT = $Port.ToString()
        if ($ServeFrontend) { $env:SERVE_FRONTEND = 'true'; $env:FRONTEND_PATH = '../frontend/dist' }
        & (Join-Path $env:JAVA_HOME 'bin/java.exe') -jar target/serv-api.jar
    } finally { Pop-Location }
} finally { Pop-Location }
