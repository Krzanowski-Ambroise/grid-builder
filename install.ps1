# Script d'installation PowerShell pour Grid Builder

Write-Host "🚀 Installation de Grid Builder..." -ForegroundColor Cyan

# Vérifier Node.js
Write-Host "`n📦 Vérification de Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js détecté : $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Vérifier npm
Write-Host "`n📦 Vérification de npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm détecté : $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm n'est pas installé." -ForegroundColor Red
    exit 1
}

# Installation des dépendances
Write-Host "`n📥 Installation des dépendances..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dépendances installées avec succès !" -ForegroundColor Green
} else {
    Write-Host "✗ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    exit 1
}

# Lancer le serveur de dev
Write-Host "`n🎉 Installation terminée !" -ForegroundColor Green
Write-Host "`n🚀 Lancement du serveur de développement..." -ForegroundColor Cyan
Write-Host "   Ouvrez http://localhost:5173 dans votre navigateur`n" -ForegroundColor Cyan

npm run dev

