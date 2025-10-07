# Debug : Problème de redimensionnement des valeurs fr

## 🔍 Diagnostic

Si les valeurs `fr` ne redimensionnent pas la grille, suivez ces étapes :

### 1. Ouvrir la console du navigateur

**Chrome/Edge** : F12 ou Ctrl+Shift+I  
**Firefox** : F12 ou Ctrl+Shift+K  
**Safari** : Cmd+Option+I

### 2. Recharger l'application

```bash
# Forcer le rechargement sans cache
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### 3. Tester un changement de valeur fr

1. Cliquer sur l'input "Col 4"
2. Changer la valeur de `1` à `2`
3. Observer la console

**Logs attendus** :
```
🟢 handleColumnChange Col 4: "2" → 2
✅ setColumnWidth(3, 2) appelé
🔴 STORE setColumnWidth(3, 2) → 2
🔴 STORE columnWidths[3]: 1 → 2
🔴 STORE nouveau tableau: [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1]
🔵 GridTemplateColumns recalculé: 1fr 1fr 1fr 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr
🔵 columnWidths: [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1]
```

### 4. Vérifier le DOM

1. Inspecter l'élément de la grille (surface centrale)
2. Vérifier le style inline :

**Attendu** :
```html
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr 2fr 1fr...">
```

**Si vous voyez** :
```html
<div style="display: grid; grid-template-columns: repeat(12, 1fr)">
```
→ Le state n'est pas mis à jour

## 🐛 Problèmes courants

### A. columnWidths/rowHeights n'existe pas

**Symptôme** : 
```
❌ config.columnWidths est invalide: undefined
```

**Solution** : Vider le localStorage
```javascript
// Dans la console du navigateur
localStorage.clear();
location.reload();
```

### B. Le state ne se met pas à jour

**Symptôme** : Les logs du STORE apparaissent mais pas les logs de recalcul du GridTemplate

**Solution** : Problème de selector Zustand

Vérifier dans `GridCanvas.tsx` :
```tsx
// ✅ BON (avec selector)
const config = useGridStore((state) => state.config);

// ❌ MAUVAIS (sans selector)
const { config } = useGridStore();
```

### C. Le composant ne se re-rend pas

**Symptôme** : Les logs STORE apparaissent, les logs GridTemplate aussi, mais la grille ne bouge pas

**Solution** : Vérifier que le style inline est bien appliqué

Inspecter l'élément et vérifier :
```css
grid-template-columns: 1fr 1fr 1fr 2fr ... /* Doit changer */
```

### D. Les inputs ne sont pas synchronisés

**Symptôme** : L'input affiche "2" mais le state reste à "1"

**Solution** : Vérifier que `value={width}` est bien lié au state

```tsx
<input
  value={config.columnWidths[index]} // ← Doit lire depuis le state
  onChange={(e) => handleColumnChange(index, e.target.value)}
/>
```

## 🔧 Réparation manuelle

### Reset complet du state

```javascript
// Dans la console du navigateur
useGridStore.getState().reset();
```

### Forcer une valeur fr

```javascript
// Dans la console du navigateur
useGridStore.getState().setColumnWidth(3, 2); // Col 4 = 2fr
```

### Vérifier le state actuel

```javascript
// Dans la console du navigateur
const state = useGridStore.getState();
console.log('Config:', state.config);
console.log('columnWidths:', state.config.columnWidths);
console.log('rowHeights:', state.config.rowHeights);
```

## 📊 Checklist de diagnostic

- [ ] La console affiche les logs 🟢 handleColumnChange
- [ ] La console affiche les logs 🔴 STORE setColumnWidth
- [ ] La console affiche les logs 🔵 GridTemplateColumns recalculé
- [ ] Le DOM montre `grid-template-columns` avec les bonnes valeurs fr
- [ ] La grille visuelle change de largeur
- [ ] Les items qui spannent la colonne s'adaptent
- [ ] Le header reste aligné

## 🆘 Si rien ne fonctionne

### 1. Vérifier la version

```bash
cat grid-builder/package.json | grep version
# Devrait afficher "1.2.0" ou supérieur
```

### 2. Réinstaller les dépendances

```bash
cd grid-builder
rm -rf node_modules package-lock.json
npm install
```

### 3. Vider le cache navigateur

**Chrome** : DevTools → Network → Disable cache (coché)  
**Firefox** : about:preferences → Privacy → Clear Data

### 4. Tester en mode incognito

Ouvrir en navigation privée pour éviter les extensions/cache

## 📝 Rapport de bug

Si le problème persiste, créer un rapport avec :

1. **Logs console** : Copier tous les logs lors d'un changement
2. **Screenshot** : Montrer la grille et les inputs
3. **State** : Résultat de `useGridStore.getState().config`
4. **Navigateur** : Nom et version
5. **Étapes** : Ce que vous avez fait exactement

---

**Dernière mise à jour** : v1.2.0 - 2025-10-06

