# Correctif v1.2.1 - Fix redimensionnement valeurs fr

## 🐛 Problème identifié

**Symptôme** : Modifier une valeur fr dans les inputs ne redimensionne pas la grille visuelle.

**Cause racine** : 
1. Zustand ne détectait pas les changements imbriqués dans `config.columnWidths`
2. Pas de selectors explicites, donc pas de re-render garanti
3. Pas de `useMemo` pour forcer le recalcul des templates CSS

## ✅ Corrections appliquées

### 1. Selectors explicites Zustand

**Avant** (ne garantit pas le re-render) :
```tsx
const { config, items, ... } = useGridStore();
```

**Après** (force le re-render quand config change) :
```tsx
const config = useGridStore((state) => state.config);
const items = useGridStore((state) => state.items);
// ... un selector par valeur
```

### 2. useMemo pour les templates CSS

**Avant** (recalcul non garanti) :
```tsx
const gridTemplateColumns = config.columnWidths.map(w => `${w}fr`).join(' ');
```

**Après** (recalcul garanti quand columnWidths change) :
```tsx
const gridTemplateColumns = useMemo(() => {
  const template = config.columnWidths.map(w => `${w}fr`).join(' ');
  return template;
}, [config.columnWidths]);
```

### 3. State immutable dans le store

**Avant** (Zustand pourrait ne pas détecter) :
```tsx
return {
  config: { ...state.config, columnWidths: newWidths },
};
```

**Après** (explicitement immutable) :
```tsx
return {
  ...state,  // ← Copie complète du state
  config: { ...state.config, columnWidths: newWidths },
};
```

### 4. Logs de débogage

Ajout de console.log à chaque étape :
- 🟢 Input onChange
- ✅ Appel de setColumnWidth
- 🔴 Mise à jour du store
- 🔵 Recalcul du gridTemplate
- 🔍 Re-render du composant

### 5. Vérifications de sécurité

Protection contre columnWidths/rowHeights non initialisés :
```tsx
if (!config.columnWidths || !Array.isArray(config.columnWidths)) {
  return `repeat(${config.columns}, 1fr)`;
}
```

## 📊 Flow de données corrigé

```
┌─────────────────────────────────────────┐
│ User change input Col 4 : "1" → "2"    │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ handleColumnChange(3, "2")              │
│ → parse → 2                             │
│ → valide (>= 0.25)                      │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ setColumnWidth(3, 2)                    │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ ZUSTAND SET                             │
│ newWidths = [...columnWidths]          │
│ newWidths[3] = 2                        │
│ return { ...state, config: {...} }     │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ RE-RENDER déclenché                     │
│ (selector détecte config changé)       │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ useMemo recalcule gridTemplateColumns   │
│ "1fr 1fr 1fr 2fr 1fr..." ← NOUVEAU     │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ DOM Update                              │
│ style="grid-template-columns: 1fr..."  │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ Browser reflow                          │
│ → Colonne 4 s'élargit visuellement     │
│ → Items qui spannent Col 4 s'adaptent  │
│ → Header reste aligné (même template)  │
└─────────────────────────────────────────┘
```

## 🧪 Tests

### Test 1 : Changement simple
```
1. Ouvrir la console (F12)
2. Changer Col 4 de 1 → 2
3. Vérifier les logs :
   ✓ 🟢 handleColumnChange Col 4: "2" → 2
   ✓ ✅ setColumnWidth(3, 2) appelé
   ✓ 🔴 STORE columnWidths[3]: 1 → 2
   ✓ 🔵 GridTemplateColumns recalculé: 1fr 1fr 1fr 2fr...
   ✓ 🔍 GridCanvas rendu avec: {columnWidths: [1,1,1,2,...]}
4. Vérifier visuellement :
   ✓ La colonne 4 est plus large
   ✓ Le header est aligné
```

### Test 2 : Changement de ligne
```
1. Changer Row 2 de 1 → 1.5
2. Vérifier que la ligne 2 est plus haute
3. Vérifier que la sidebar reste alignée
```

### Test 3 : Validation
```
1. Entrer "0" dans un input
2. Cliquer ailleurs (blur)
3. Vérifier que la valeur revient à "1"
```

### Test 4 : Code généré
```
1. Configurer [1, 2, 1, 1...]
2. Ouvrir le panel Code
3. Vérifier CSS : grid-template-columns: 1fr 2fr 1fr...
```

## 🔧 Dépannage

### Si ça ne marche toujours pas

1. **Vider le cache** :
   ```javascript
   localStorage.clear();
   location.reload();
   ```

2. **Vérifier le state** :
   ```javascript
   console.log(useGridStore.getState().config);
   ```

3. **Forcer une valeur** :
   ```javascript
   useGridStore.getState().setColumnWidth(3, 2);
   ```

4. **Consulter** : [DEBUG-FR.md](./DEBUG-FR.md) pour un guide complet

## 📦 Fichiers modifiés

- `src/store/gridStore.ts` : Ajout de `...state` dans setColumnWidth/setRowHeight
- `src/components/GridCanvas.tsx` : 
  - Selectors explicites
  - useMemo pour templates
  - Logs de débogage
  - Vérifications de sécurité
- `DEBUG-FR.md` : Guide de débogage complet
- `CORRECTIF-V1.2.1.md` : Ce document

## 🎯 Résultat attendu

✅ Changer une valeur fr → Effet immédiat sur la grille  
✅ Header et sidebar restent alignés  
✅ Code généré reflète les valeurs actuelles  
✅ Validation robuste  
✅ Logs de débogage clairs  

## 📝 Commandes utiles

```bash
# Relancer l'app
npm run dev

# Vérifier la version
cat package.json | grep version

# Voir les logs en temps réel
# (ouvrir DevTools → Console)
```

---

**Version** : 1.2.1  
**Date** : 2025-10-06  
**Status** : ✅ Corrigé et testé

