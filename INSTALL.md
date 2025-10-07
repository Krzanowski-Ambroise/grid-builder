# Installation

## Prérequis
- Node.js >= 18
- npm ou yarn

## Installation rapide

### Méthode 1 : Commandes simples
```bash
cd grid-builder
npm install
npm run dev
```

### Méthode 2 : Script PowerShell (Windows)
```powershell
cd grid-builder
.\install.ps1
```

### Méthode 3 : Build de production
```bash
cd grid-builder
npm install
npm run build
npm run preview
```

## Vérification de l'installation

Après `npm run dev`, ouvrez http://localhost:5173

Vous devriez voir l'interface Grid Builder avec :
- Une barre d'outils en haut
- Un panneau de contrôles à gauche
- Une surface de travail au centre
- Un panneau de code à droite

## Dépannage

### Port déjà utilisé
Si le port 5173 est occupé, Vite utilisera automatiquement le port suivant disponible.

### Erreurs de dépendances
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreurs TypeScript
Vérifiez que votre version de TypeScript est >= 5.0 :
```bash
npx tsc --version
```

### Problèmes de build
```bash
npm run build -- --debug
```

## Développement

### Mode dev avec HMR
```bash
npm run dev
```

### Build optimisé
```bash
npm run build
```

### Preview du build
```bash
npm run preview
```

### Linter
```bash
npm run lint
```

## Support

Pour toute question ou problème, consultez le README.md ou créez une issue.

