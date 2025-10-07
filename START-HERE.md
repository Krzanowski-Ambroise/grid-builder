# 🚀 Démarrage rapide - Grid Builder

## Installation en 30 secondes

```bash
cd grid-builder
npm install
npm run dev
```

Ouvrez http://localhost:5173 dans votre navigateur.

## 🎯 Premier usage (2 minutes)

### 1. Créer votre première grille

1. **Ajustez la grille** :
   - Colonnes : 12 (par défaut)
   - Lignes : 8 (par défaut)
   - Gap : 16px

2. **Cliquez sur "Ajouter"** dans le panneau gauche

3. **Un item apparaît** : Cliquez dessus pour le sélectionner

### 2. Déplacer et redimensionner

- **Drag** : Cliquez et tirez l'item pour le déplacer
- **Resize** : Tirez les poignées bleues aux coins/bords
- **Clavier** : 
  - `←↑↓→` pour déplacer
  - `Shift+←↑↓→` pour redimensionner

### 3. Personnaliser les colonnes

Au-dessus de la grille, modifiez les inputs fr :
- Colonne 1 : `1` (normal)
- Colonne 2 : `2` (double largeur)
- Colonne 3 : `1` (normal)

→ La grille s'adapte instantanément !

### 4. Exporter le code

Panneau droit :
1. Choisir **HTML**, **CSS** ou **Tailwind**
2. Cliquer sur **"Copier le code"**
3. Coller dans votre projet

C'est fait ! 🎉

## 📚 Pour aller plus loin

### Charger un preset

Menu en haut :
- **Dashboard** : Layout avec sidebar et widgets
- **Portfolio** : Grille masonry
- **Landing Page** : Hero + features

### Utiliser les raccourcis

- `Ctrl/Cmd + Z` : Annuler
- `Ctrl/Cmd + Shift + Z` : Refaire
- `Flèches` : Déplacer l'item
- `Shift + Flèches` : Redimensionner

### Sauvegarder votre travail

1. Cliquer sur **"Sauvegarder"** en haut
2. Un fichier JSON est téléchargé
3. Plus tard : **"Ouvrir"** pour le recharger

## 💡 Astuces

### Créer un layout sidebar + contenu

1. Grille 12 colonnes
2. Modifier **Col 1-2** à `0.8fr` (sidebar)
3. Laisser **Col 3-12** à `1fr` (contenu)
4. Ajouter un item **C:1→3** (sidebar)
5. Ajouter un item **C:3→13** (contenu)

### Layout responsive

1. Créer votre layout pour desktop (base)
2. Sélectionner breakpoint **"MD"** dans le panneau gauche
3. Modifier les items pour mobile
4. Le code généré inclura les media queries

### Layouts complexes

- **Chevauchements** : Autorisés (transparence visible)
- **Verrouillage** : Icône cadenas pour empêcher modifications
- **Duplication** : Icône copier pour dupliquer un item
- **Nommage** : Donnez des noms à vos items

## 📖 Documentation complète

- **README.md** : Guide complet
- **VALIDATION-FINALE.md** : Tous les tests
- **PIXEL-PERFECT.md** : Techniques avancées
- **COLUMN-FR-GUIDE.md** : Maîtriser les fr

## ❓ Questions fréquentes

**Q : Comment créer une colonne plus large ?**  
R : Modifier son input fr au-dessus (ex: `2` ou `3`)

**Q : Les items se chevauchent, c'est normal ?**  
R : Oui, CSS Grid permet les chevauchements. La transparence vous permet de les voir.

**Q : Le code exporté fonctionne-t-il vraiment ?**  
R : Oui ! Copier-coller dans un fichier HTML et ouvrir dans le navigateur.

**Q : Comment faire un layout 25% / 75% ?**  
R : 4 colonnes avec Col 1: `1fr` et Col 2-4: `3fr` chacune.

**Q : Puis-je changer le gap en rem ?**  
R : Oui, la conversion px ↔ rem est automatique (8px = 0.5rem).

## 🆘 Besoin d'aide ?

- Consultez **DEBUG-FR.md** pour le débogage
- Ouvrez la console (F12) pour voir les logs
- Consultez **FEATURES.md** pour la liste complète

## 🎓 Prochaines étapes

1. ✅ Maîtriser le drag & resize
2. ✅ Expérimenter avec les valeurs fr
3. ✅ Créer votre premier layout complet
4. ✅ Exporter et intégrer dans un projet
5. ✅ Partager vos créations !

---

**Bon développement avec Grid Builder !** 🚀

Version : 2.0.2 | Production Ready ✅

