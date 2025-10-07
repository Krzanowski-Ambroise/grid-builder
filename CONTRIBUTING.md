# Guide de Contribution

Merci de votre intérêt pour contribuer à CSS Grid Builder ! 🎉

## 🚀 Comment contribuer

### 1. Fork et Clone

```bash
# Fork le repository sur GitHub
# Puis clonez votre fork
git clone https://github.com/votre-username/grid-builder.git
cd grid-builder
```

### 2. Installation

```bash
npm install
```

### 3. Développement

```bash
# Lancer le serveur de dev
npm run dev

# Linting
npm run lint

# Build
npm run build
```

### 4. Créer une branche

```bash
git checkout -b feature/nom-de-votre-fonctionnalite
# ou
git checkout -b fix/nom-du-bug
```

### 5. Commit et Push

```bash
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"
git push origin feature/nom-de-votre-fonctionnalite
```

### 6. Pull Request

Créer une Pull Request sur GitHub avec :
- Description claire des changements
- Screenshots si UI modifiée
- Tests si applicable

## 📝 Convention de commits

Utilisez le format [Conventional Commits](https://conventionalcommits.org/) :

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: mise à jour documentation
style: formatage, pas de changement de code
refactor: refactoring de code
test: ajout de tests
chore: tâches de maintenance
```

## 🎯 Types de contributions

### 🐛 Bug fixes
- Identifier le problème
- Créer un test de régression
- Proposer une solution
- Tester sur différents navigateurs

### ✨ Nouvelles fonctionnalités
- Discuter dans une issue avant de commencer
- Suivre l'architecture existante
- Ajouter des tests si nécessaire
- Mettre à jour la documentation

### 📚 Documentation
- README
- Code comments
- TypeScript types
- Exemples d'usage

### 🎨 Améliorations UI/UX
- Respecter le design system
- Tester l'accessibilité
- Vérifier la responsivité
- Screenshots avant/après

## 🧪 Tests

### Tests manuels
- [ ] Interface fonctionne sur Chrome/Firefox/Safari
- [ ] Drag & drop des items
- [ ] Contrôles `fr` des colonnes/lignes
- [ ] Gap visuel avec différentes valeurs
- [ ] Export de code (HTML/CSS/Tailwind)
- [ ] Mode sombre/clair
- [ ] Responsive design

### Tests automatiques
```bash
# À implémenter
npm test
npm run test:e2e
```

## 🏗️ Architecture

### Structure recommandée
```
src/
├── components/     # Composants React
├── lib/           # Logique métier
├── store/         # État global (Zustand)
├── types/         # Types TypeScript
└── utils/         # Utilitaires
```

### Principes
- **Un seul moteur de calcul** : `unifiedGridEngine.ts`
- **Alignement pixel-perfect** : Overlay = Items
- **Performance** : `useMemo` pour les calculs coûteux
- **Accessibilité** : Support clavier et screen readers

## 🎨 Guidelines de code

### TypeScript
- Types explicites pour les props
- Interfaces pour les objets complexes
- Éviter `any` autant que possible

### React
- Hooks fonctionnels uniquement
- `useMemo` pour les calculs coûteux
- `useCallback` pour les handlers
- Props destructuring

### CSS
- Tailwind CSS pour le styling
- Variables CSS pour les couleurs
- Mobile-first responsive design

## 🐛 Signaler un bug

Utilisez le template d'issue :

```markdown
## Description
Description claire du problème

## Étapes pour reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

## Comportement attendu
Ce qui devrait se passer

## Screenshots
Si applicable

## Environnement
- OS: [e.g. Windows, macOS, Linux]
- Navigateur: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]
```

## 💡 Proposer une fonctionnalité

```markdown
## Description
Description de la fonctionnalité

## Cas d'usage
Pourquoi cette fonctionnalité serait utile

## Solution proposée
Comment vous imaginez l'implémentation

## Alternatives
Autres solutions considérées
```

## 📞 Support

- **Issues** : Pour bugs et fonctionnalités
- **Discussions** : Pour questions générales
- **Email** : Pour support privé

## 🙏 Remerciements

Merci à tous les contributeurs qui rendent ce projet possible !

---

**Happy coding!** 🚀
