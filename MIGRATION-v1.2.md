# Migration vers v1.2.0 - Alignement parfait

## 🎉 Nouveautés v1.2.0

### Architecture repensée pour alignement pixel-perfect

L'éditeur de grille utilise maintenant **la même définition CSS Grid** pour :
- Le header (inputs colonnes)
- La sidebar gauche (inputs lignes)  
- La surface de travail (grille centrale)

**Résultat** : Alignement parfait garanti, quelle que soit la configuration.

### Améliorations majeures

✅ **Inputs colonnes** : Alignés exactement au-dessus de chaque colonne  
✅ **Inputs lignes** : Visibles et lisibles avec labels verticaux  
✅ **Modification fr** : Effet immédiat sur la grille et les items  
✅ **Validation** : Valeurs invalides revertent automatiquement à 1fr  
✅ **Code généré** : 100% synchronisé avec l'aperçu visuel  
✅ **Accessibilité** : Labels, ARIA, focus ring, navigation clavier  

## 🔄 Changements techniques

### GridCanvas.tsx - Refonte complète

**Avant** :
```tsx
// Inputs colonnes avec flex (approximatif)
<div className="flex gap-1">
  {config.columnWidths.map((width, index) => (
    <div style={{ flex: `${width} 1 0%` }}>
      <input value={width} />
    </div>
  ))}
</div>
```

**Après** :
```tsx
// Inputs colonnes avec CSS Grid (exact)
<div style={{
  display: 'grid',
  gridTemplateColumns: config.columnWidths.map(w => `${w}fr`).join(' '),
  gap,
  padding,
}}>
  {config.columnWidths.map((width, index) => (
    <div>
      <label>Col {index + 1}</label>
      <input value={width} />
    </div>
  ))}
</div>
```

### Validation des inputs

**Ajout de handlers** :
```tsx
const handleColumnChange = (index, value) => {
  const parsed = parseFloat(value);
  if (!isNaN(parsed) && parsed >= 0.25) {
    setColumnWidth(index, parsed);
  }
};

const handleColumnBlur = (index, value) => {
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < 0.25) {
    setColumnWidth(index, 1); // Revert
  }
};
```

**Gestion clavier** :
- `Escape` : Annule et perd le focus
- `Enter` : Valide et perd le focus
- `↑/↓` : Incrémente/décrémente

### Structure HTML

```html
<div class="canvas-container">
  <!-- Header : Inputs colonnes -->
  <div class="header" style="display: grid; grid-template-columns: 1fr 2fr 1fr...">
    <input /> <input /> <input />...
  </div>
  
  <div class="main">
    <!-- Sidebar : Inputs lignes -->
    <div class="sidebar" style="display: grid; grid-template-rows: 1fr 1fr 2fr...">
      <input />
      <input />
      <input />
      ...
    </div>
    
    <!-- Surface : Grille -->
    <div class="surface" style="display: grid; grid-template-columns: 1fr 2fr 1fr...; grid-template-rows: 1fr 1fr 2fr...">
      <!-- Items -->
    </div>
  </div>
</div>
```

## 📦 Compatibilité

### Projets sauvegardés

✅ **Aucune action requise**

Les projets sauvegardés en v1.0 ou v1.1 se chargent normalement. Si `rowHeights` est absent, il est automatiquement initialisé à `Array(config.rows).fill(1)`.

### Presets

✅ **Mis à jour automatiquement**

Les 3 presets (Dashboard, Portfolio, Landing Page) incluent maintenant `rowHeights`.

## 🎯 Guide de test

### Test 1 : Alignement colonnes
1. Créer une grille 12×8
2. Modifier Col 4 de 1fr → 3fr
3. **Vérifier** : Le header input s'élargit ET la colonne aussi

### Test 2 : Alignement lignes
1. Modifier Row 2 de 1fr → 2fr
2. **Vérifier** : Le sidebar input s'agrandit ET la ligne aussi

### Test 3 : Validation
1. Entrer "0" dans un input
2. Cliquer ailleurs (blur)
3. **Vérifier** : La valeur revient à "1"

### Test 4 : Code généré
1. Configurer [1, 2, 1, 1...] pour les colonnes
2. Ouvrir le panel Code
3. **Vérifier** : `grid-template-columns: 1fr 2fr 1fr 1fr...`

### Test 5 : Keyboard
1. Focus sur un input
2. Presser `↑`
3. **Vérifier** : La valeur augmente de 0.25
4. Presser `Escape`
5. **Vérifier** : L'input perd le focus

## 🐛 Bugs corrigés

| Bug | Status |
|-----|--------|
| Inputs colonnes décalés | ✅ Fixé |
| Inputs lignes illisibles | ✅ Fixé |
| Changement fr sans effet | ✅ Fixé |
| Désynchronisation header/surface | ✅ Fixé |
| Validation manquante | ✅ Fixé |
| Code généré incorrect | ✅ Fixé |
| Focus ring absent | ✅ Fixé |
| Labels manquants | ✅ Fixé |

## 🔜 Roadmap v1.3

- [ ] Presets de templates (sidebar, holy grail, etc.)
- [ ] Copier/coller de layouts entre projets
- [ ] Historique visuel des modifications
- [ ] Export en SCSS avec variables
- [ ] Support de `minmax()` et `auto`
- [ ] Grilles imbriquées (nested grids)

## 📖 Documentation

- [ALIGNEMENT-FIX.md](./ALIGNEMENT-FIX.md) - Détails techniques des corrections
- [COLUMN-FR-GUIDE.md](./COLUMN-FR-GUIDE.md) - Guide d'utilisation des valeurs fr
- [CHANGELOG.md](./CHANGELOG.md) - Historique complet des versions

## 💬 Support

Problème d'alignement ? 
1. Vérifier que vous êtes en v1.2.0 (`package.json`)
2. Vider le cache du navigateur
3. Recharger l'application

Toujours un problème ? Ouvrir une issue avec :
- Screenshot de l'alignement
- Configuration (nombre de colonnes, valeurs fr)
- Navigateur et version

---

**v1.2.0** - Alignement pixel-perfect et synchronisation parfaite ✨

