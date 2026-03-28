# 🔧 Dépannage SwitchAppart

## Problèmes courants et solutions

### ❌ Erreur "Token invalide ou expiré"

**Symptôme :** Messages d'erreur "Invalid JWT" ou "Token invalide ou expiré" dans la console

**Cause :** Vous avez une ancienne session stockée dans le navigateur avec un token qui n'est plus valide

**Solution :**
1. L'application nettoie automatiquement les tokens invalides
2. Un message "Votre session a expiré, veuillez vous reconnecter" s'affiche
3. Reconnectez-vous avec vos identifiants

**Solution manuelle si le problème persiste :**
1. Ouvrez la console développeur (F12)
2. Allez dans l'onglet "Application" > "Local Storage"
3. Supprimez les clés suivantes :
   - `switchappart_token`
   - `switchappart_user`
   - `switchappart_users`
4. Rechargez la page

---

### 🔐 Problèmes de connexion

**Symptôme :** Impossible de se connecter même avec les bons identifiants

**Solutions possibles :**
1. Vérifiez que votre email et mot de passe sont corrects
2. Assurez-vous que votre compte a bien été créé (vérifiez les logs du serveur)
3. Le mot de passe doit contenir au moins 8 caractères lors de l'inscription
4. Vérifiez que le backend Supabase est bien démarré

---

### ✉️ Erreur "Email déjà utilisé"

**Symptôme :** Message d'erreur "Cet email est déjà utilisé" lors de l'inscription

**Cause :** Un compte existe déjà avec cette adresse email

**Solutions :**
1. **Si c'est votre compte :** Cliquez sur "Connexion" au lieu de "Inscription" et utilisez vos identifiants
2. **Si vous avez oublié votre mot de passe :** Utilisez la fonction "Mot de passe oublié"
3. **Si vous voulez créer un nouveau compte :** Utilisez une autre adresse email
4. **Pour les développeurs :** L'erreur est maintenant gérée automatiquement et affiche un message clair

**Détails techniques :**
- Le système vérifie automatiquement si l'email existe déjà avant de créer un compte
- Les emails sont normalisés (minuscules et espaces supprimés) pour éviter les doublons
- Le code d'erreur `email_exists` (409) est retourné en cas de conflit

---

### 📱 Écran blanc ou application qui ne charge pas

**Symptôme :** L'application affiche un écran blanc ou reste bloquée sur le splash screen

**Solutions :**
1. Nettoyez le cache du navigateur
2. Supprimez les données localStorage (voir section "Token invalide")
3. Rechargez la page avec Ctrl+Shift+R (hard reload)
4. Vérifiez la console pour voir les erreurs

---

### 🎟️ SwitchPass non initialisé

**Symptôme :** Le solde SwitchPass n'apparaît pas ou affiche "undefined"

**Solution :**
- Le SwitchPass est maintenant initialisé automatiquement lors de l'inscription
- Si vous avez un ancien compte, déconnectez-vous et reconnectez-vous
- Le solde devrait afficher "0" par défaut pour les nouveaux utilisateurs

---

### 💬 Conversations ou favoris vides

**Symptôme :** Vos conversations ou favoris n'apparaissent pas

**Cause :** Vous êtes connecté avec un nouveau compte ou les données n'ont pas encore été synchronisées

**Solution :**
1. C'est normal pour un nouveau compte - les listes sont vides au départ
2. Commencez à ajouter des favoris ou à créer des conversations
3. Les données sont synchronisées automatiquement avec le backend

---

### 🔄 Données non synchronisées

**Symptôme :** Les modifications (favoris, profil, etc.) ne sont pas sauvegardées

**Solutions possibles :**
1. Vérifiez votre connexion internet
2. Regardez la console pour les erreurs d'API
3. Assurez-vous que votre token est valide (voir section "Token invalide")
4. Vérifiez que le serveur backend répond correctement

---

## Réinitialisation complète

Si rien ne fonctionne, effectuez une réinitialisation complète :

1. **Nettoyez localStorage :**
   ```javascript
   // Dans la console développeur
   localStorage.clear()
   ```

2. **Supprimez les cookies Supabase :**
   - Allez dans Application > Cookies
   - Supprimez tous les cookies liés à Supabase

3. **Rechargez la page :**
   - Ctrl+Shift+R pour un hard reload

4. **Créez un nouveau compte :**
   - Utilisez un nouvel email
   - Choisissez un mot de passe fort (8+ caractères)

---

## Vérification de l'état du système

### Test du backend

Ouvrez cette URL dans votre navigateur pour vérifier que le backend fonctionne :
```
https://[votre-projet-id].supabase.co/functions/v1/make-server-515d6ac6/test
```

Vous devriez voir :
```json
{
  "message": "API SwitchAppart opérationnelle",
  "timestamp": "2025-01-19T...",
  "version": "1.0.0"
}
```

### Logs utiles

Ouvrez la console développeur pour voir :
- ✅ "Token valide, chargement des données utilisateur" = Tout va bien
- ❌ "Token invalide (mauvais format)" = Token corrompu, nettoyage auto
- 🧹 "Nettoyage de la session" = Session expirée, reconnexion requise

---

## Support

Si le problème persiste après avoir essayé toutes ces solutions :
1. Notez le message d'erreur exact de la console
2. Vérifiez les logs du serveur Supabase
3. Assurez-vous que toutes les variables d'environnement sont configurées
4. Consultez le fichier `/DATABASE.md` pour la documentation de l'API
