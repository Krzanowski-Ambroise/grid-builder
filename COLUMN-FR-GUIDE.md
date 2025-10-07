# Guide : Largeurs de colonnes personnalisées (fr)

## 📐 Qu'est-ce que `fr` ?

`fr` (fractional unit) est une unité CSS Grid qui permet de répartir l'espace disponible de manière proportionnelle.

**Exemple** : Si vous avez 3 colonnes avec `1fr 2fr 1fr` :
- Colonne 1 : 25% de l'espace (1/4)
- Colonne 2 : 50% de l'espace (2/4)
- Colonne 3 : 25% de l'espace (1/4)

## 🎯 Comment utiliser

### 1. Localisation des inputs
Au-dessus de la grille, vous verrez une rangée d'inputs numérotés (1, 2, 3...) correspondant à chaque colonne.

```
Largeur colonnes (fr):  [1]  [2]  [3]  [4]  [5]  [6]  ...
                        1fr  1fr  1fr  1fr  1fr  1fr
```

### 2. Modifier une largeur
Cliquez sur un input et entrez une valeur :
- **Minimum** : 0.1fr
- **Step recommandé** : 0.5fr
- **Valeurs courantes** : 1fr, 1.5fr, 2fr, 3fr

### 3. Voir les changements en direct
La grille se redimensionne instantanément pour refléter les nouvelles proportions.

### 4. Réinitialiser
Cliquez sur le bouton **"Reset fr"** dans le panneau de configuration pour réinitialiser toutes les colonnes à `1fr`.

## 💡 Exemples pratiques

### Layout Sidebar + Contenu
**Configuration** : 12 colonnes avec `1fr 1fr 3fr 3fr 3fr 3fr 3fr 3fr 3fr 3fr 3fr 3fr`
- Colonnes 1-2 : Sidebar (2fr total = 16.7%)
- Colonnes 3-12 : Contenu (30fr total = 83.3%)

### Layout 3 colonnes égales
**Configuration** : 3 colonnes avec `1fr 1fr 1fr`
- Répartition égale : 33.3% chacune

### Layout asymétrique
**Configuration** : 4 colonnes avec `2fr 3fr 2fr 1fr`
- Colonne 1 : 25% (2/8)
- Colonne 2 : 37.5% (3/8)
- Colonne 3 : 25% (2/8)
- Colonne 4 : 12.5% (1/8)

### Layout Hero + Features
**Configuration** : 12 colonnes avec `1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr`
Puis modifier les 4 premières colonnes à `2fr` pour un Hero plus large :
- Colonnes 1-4 : `2fr 2fr 2fr 2fr` = Hero large
- Colonnes 5-12 : `1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr` = Features

## 🔧 Validation automatique

### Valeurs invalides
Si vous entrez :
- Une valeur <= 0
- Une valeur non numérique
- Rien (champ vide)

→ La colonne sera automatiquement réinitialisée à `1fr` au blur (perte de focus)

### Limites
- **Minimum** : 0.1fr (évite les colonnes invisibles)
- **Maximum** : Aucune limite théorique, mais restez raisonnable (< 10fr)

## 📋 Code généré

### CSS
```css
/* Toutes les colonnes à 1fr (par défaut) */
.grid-container {
  grid-template-columns: repeat(12, 1fr);
}

/* Colonnes personnalisées */
.grid-container {
  grid-template-columns: 1fr 2fr 1fr 3fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
```

### Tailwind
```html
<!-- Toutes les colonnes à 1fr (par défaut) -->
<div class="grid grid-cols-12 ...">

<!-- Colonnes personnalisées -->
<div class="grid grid-cols-[1fr 2fr 1fr 3fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr] ...">
```

## 🎨 Cas d'usage courants

### Dashboard classique
- **Colonnes 1-2** : `1fr` (Sidebar fixe)
- **Colonnes 3-12** : `1fr` (Contenu fluide)

### Blog avec sidebar
- **Colonnes 1-8** : `2fr` (Article principal)
- **Colonnes 9-12** : `1fr` (Sidebar secondaire)

### Portfolio masonry
- **Colonnes impaires** : `1.5fr`
- **Colonnes paires** : `1fr`
→ Effet décalé

### E-commerce grid
- **Colonnes 1-3** : `1fr` (Filtres)
- **Colonnes 4-12** : `2fr` (Produits)

## ⚡ Astuces

1. **Symétrie** : Pour un layout symétrique, utilisez les mêmes valeurs de part et d'autre
   - Ex : `1fr 3fr 3fr 1fr` (8 colonnes)

2. **Golden Ratio** : Utilisez le ratio 1.618
   - Ex : `1fr 1.618fr` ou `1fr 1.6fr`

3. **Tiers** : Pour diviser en tiers
   - Ex : `1fr 1fr 1fr` ou `2fr 1fr` (2/3 - 1/3)

4. **Quarts** : Pour diviser en quarts
   - Ex : `3fr 1fr` (75% - 25%)

5. **Minmax** : Bien que non supporté directement, utilisez des valeurs fr proches pour simuler
   - Ex : `0.5fr 2fr 0.5fr` (min-content, auto, min-content)

## 🔄 Workflow recommandé

1. **Commencez simple** : Toutes les colonnes à `1fr`
2. **Identifiez les zones** : Sidebar, contenu, aside
3. **Ajustez les proportions** : Augmentez les fr des zones principales
4. **Testez la réactivité** : Changez la largeur du container
5. **Exportez** : Copiez le code généré

## 📱 Responsive

Pour les layouts responsive, combinez cette fonctionnalité avec les breakpoints :
1. Définissez les largeurs pour desktop (base)
2. Ajustez les largeurs pour chaque breakpoint (sm, md, lg, xl)
3. Le code généré inclura les media queries correspondantes

## ❓ FAQ

**Q : Puis-je mélanger fr et px ?**
R : Non, dans Grid Builder, toutes les colonnes utilisent fr. Pour des largeurs fixes, utilisez des valeurs fr très petites (0.1fr) ou très grandes (10fr).

**Q : Comment faire une colonne de largeur fixe ?**
R : Utilisez une valeur fr très petite (ex : 0.5fr) et ajustez le container width pour obtenir la taille désirée.

**Q : Les changements sont-ils sauvegardés ?**
R : Oui, les valeurs fr sont incluses dans l'export JSON du projet.

**Q : Que se passe-t-il si je change le nombre de colonnes ?**
R : Les valeurs existantes sont préservées, et les nouvelles colonnes sont initialisées à 1fr.

---

**Astuce finale** : Utilisez le bouton "Reset fr" pour revenir rapidement à une répartition égale et recommencer vos expérimentations !

