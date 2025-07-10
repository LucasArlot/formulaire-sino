# 🚢 Formulaire SINO - Shipping Quote Form

Un formulaire moderne et multilingue pour les devis de transport international.

## 🌐 Déploiement Automatique

### GitHub Pages (GRATUIT)

**1. Créer un repository GitHub**
```bash
# Sur GitHub.com, créer un nouveau repository public nommé "formulaire-sino"
```

**2. Pousser le code**
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/formulaire-sino.git
git push -u origin main
```

**3. Activer GitHub Pages**
- Aller dans Settings > Pages
- Source: "GitHub Actions"
- Le déploiement se fait automatiquement à chaque push !

**4. Votre site sera disponible sur:**
```
https://VOTRE-USERNAME.github.io/formulaire-sino/sino-form/
```

## 🚀 Déploiement Manuel

```bash
npm run deploy
```

## 🛠️ Développement

```bash
# Installation
npm install

# Développement local
npm run dev

# Build de production
npm run build

# Aperçu du build
npm run preview
```

## ✨ Fonctionnalités

- ✅ **Multilingue** : 8 langues supportées
- ✅ **Responsive** : Mobile-first design
- ✅ **Formulaire intelligent** : Validation en temps réel
- ✅ **Integration webhooks** : N8N + Make.com
- ✅ **Design moderne** : Glassmorphism + animations
- ✅ **Déploiement gratuit** : GitHub Pages

## 🔧 Configuration

Le formulaire est configuré pour envoyer vers :
- **N8N Test** : webhook-test endpoint
- **N8N Production** : webhook production 
- **Make.com** : hook.eu1.make.com

---

🌐 **Sites web** : sino-shipping.com | fschina.com | es.sino-shipping.com 