# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Ajouté
- 🎨 Interface drag & drop intuitive pour créer des layouts CSS Grid
- 🔧 Système de grille unifié avec alignement pixel-perfect
- 📏 Contrôles `fr` dynamiques pour ajuster les tailles de colonnes/lignes
- 🎯 Gap visuel intelligent avec système de margins (`calc(100% - gap) + margin`)
- 🎮 Snapping automatique des items sur la grille
- 📤 Export de code en HTML, CSS et Tailwind
- 🎛️ Interface responsive avec header/sidebar alignés
- 🌙 Mode sombre/clair automatique
- ⌨️ Navigation clavier avec flèches directionnelles
- 🔄 Gestion d'état avec Zustand
- 🎨 Styling avec Tailwind CSS
- 📱 Design responsive mobile-first

### Technique
- **Moteur unifié** : `unifiedGridEngine.ts` pour tous les calculs
- **Overlay parfait** : `PerfectGridOverlay.tsx` synchronisé avec les items
- **Génération de code** : `unifiedCodeGenerator.ts` pour HTML/CSS/Tailwind
- **Performance** : `useMemo` pour les calculs coûteux
- **TypeScript** : Typage complet pour la robustesse

### Architecture
```
src/
├── components/          # Composants React
│   ├── UnifiedGridCanvas.tsx    # Canvas principal
│   ├── PerfectGridOverlay.tsx   # Overlay de grille
│   ├── SidebarControls.tsx      # Contrôles sidebar
│   └── CodePanel.tsx            # Panel d'export
├── lib/                 # Logique métier
│   ├── unifiedGridEngine.ts     # Moteur de grille unifié
│   ├── unifiedCodeGenerator.ts  # Générateur de code
│   └── utils.ts                 # Utilitaires
├── store/               # État global
│   └── gridStore.ts            # Store Zustand
└── types.ts             # Types TypeScript
```

## [0.9.0] - 2024-01-XX

### Ajouté
- 🚀 Version initiale avec système de grille basique
- 🎨 Interface drag & drop
- 📏 Contrôles de colonnes et lignes
- 🎯 Export de code basique

### Technique
- React 18 + TypeScript
- Vite pour le build
- CSS Grid pour le layout

---

## Types de changements

- **Ajouté** pour les nouvelles fonctionnalités
- **Modifié** pour les changements de fonctionnalités existantes
- **Déprécié** pour les fonctionnalités qui seront supprimées
- **Supprimé** pour les fonctionnalités supprimées
- **Corrigé** pour les corrections de bugs
- **Sécurité** pour les vulnérabilités corrigées