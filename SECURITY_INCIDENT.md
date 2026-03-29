# 🚨 CRITICAL SECURITY INCIDENT: Secret Exposure on GitHub

## What Happened
The following secrets were committed to your public GitHub repository:
- ✗ **MONGO_URI** (Database credentials with username/password)
- ✗ **JWT_SECRET** (Token signing key)
- ✗ **UPLOADTHING_TOKEN** (File upload API key)

Even though the file is now removed from `git`, GitHub retains access to the entire commit history, meaning **these secrets are still accessible**. Anyone with access to your repository can view the commit history and see these credentials.

---

## IMMEDIATE ACTIONS REQUIRED (Do These Now!)

### 1. 🔴 Revoke MongoDB Atlas Credentials
**Where the leak is used:** `server/config/db.js` - actively connecting to your database

**Steps:**
1. Go to https://cloud.mongodb.com/
2. Log in and navigate to your cluster
3. Click **Database Access** → **Database Users**
4. Find user `sajinsajigeorge_db_user` 
5. Click the **⋯** menu and select **Delete**
6. Create a **NEW** database user with:
   - New username (e.g., `litferns_user_prod`)
   - New password (generate a strong random password)
7. Update your credentials in:
   - **Production**: Render/Vercel environment variables
   - **Local**: Create a new `.env.development` with the new credentials
   - **Any other deployment** you have

### 2. 🔴 Revoke UploadThing API Token
**Where the leak is used:** File upload functionality

**Steps:**
1. Go to https://uploadthing.com/dashboard
2. Navigate to **Settings** → **API Keys**
3. Find and **Regenerate** the exposed token
4. Copy the new token
5. Update in all environments:
   - Production environment variables
   - Local `.env.development` file
   - Any CI/CD pipelines

### 3. 🟡 Rotate JWT_SECRET
**Where the leak is used:** 
- `server/middleware/authMiddleware.js` - validates JWT tokens
- `server/utils/generateToken.js` - creates JWT tokens

**Steps:**
1. Generate a new secure random secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Update in all environments:
   - Production (Render/Vercel dashboard)
   - Local `.env.development`
   - Any CI/CD pipelines

⚠️ **Note:** Changing JWT_SECRET will **invalidate all existing user sessions**. Users will need to log in again.

---

## What We've Already Done

✅ Removed `.env.development` from git tracking
✅ Created `.env.development.example` as a safe template
✅ Removed the file from the current branch and pushed an update

⚠️ **Note:** The secrets still exist in git history. To completely remove them:
- Consider using `git-filter-repo` (recommended over `git filter-branch`)
- This requires a full repository rebase that will change commit hashes
- All collaborators need to be notified and update their local clones

---

## Setup Your Local Environment Safely

1. **Copy the example file:**
   ```bash
   cp server/.env.development.example server/.env.development
   ```

2. **Edit it with YOUR NEW credentials:**
   ```bash
   # Use the NEW MongoDB credentials
   MONGO_URI=mongodb+srv://[NEW_USERNAME]:[NEW_PASSWORD]@cluster.mongodb.net/litferns
   
   # Use the NEW UploadThing token
   UPLOADTHING_TOKEN=[NEW_TOKEN]
   
   # Use a NEW JWT_SECRET
   JWT_SECRET=[GENERATE_NEW_SECRET]
   ```

3. **NEVER commit this file:**
   - It's in `.gitignore` so git will ignore it
   - Double-check: `git status` should NOT show `server/.env.development`

---

## Verify Git Configuration

```bash
# Check that .env files are properly ignored
cat server/.gitignore

# Should see:
# - .env
# - .env.development  
# - .env.production

# Verify the file is being ignored
git status

# Should NOT show any .env.development files
```

---

## Production Deployment Checklist

Before pushing to production, ensure:
- [ ] MongoDB credentials are rotated ✓ New user created in Atlas
- [ ] UPLOADTHING_TOKEN is regenerated ✓ New token from UploadThing
- [ ] JWT_SECRET is changed ✓ New random secret generated
- [ ] All environment variables are set in Render/Vercel dashboard
- [ ] Test the application works with new credentials
- [ ] No `.env.development` or `.env.production` files in git commits

---

## Future Prevention

### 1. Use Environment Variable Management
- **For Development:** Create `.env.development` locally (ignored by git)
- **For Production:** Use deployment platform's environment variable UI
  - Render: Settings → Environment
  - Vercel: Settings → Environment Variables
- **For Secrets:** Consider using tools like:
  - `dotenv` (for local development)
  - `1Password` or `Bitwarden` (for team secret sharing)
  - HashiCorp `Vault` (for enterprise)

### 2. Pre-commit Hooks
Add a git hook to prevent committing sensitive files:
```bash
# Create .git/hooks/pre-commit
#!/bin/bash
if git diff --cached --name-only | grep -E '\.env(\.|$)'; then
  echo "ERROR: Attempting to commit .env file!"
  echo "Add .env files to .gitignore and remove from staging"
  exit 1
fi
```

### 3. Scan Previous Commits
Use tools to scan history for exposed secrets:
- **git-secrets**: `https://github.com/awslabs/git-secrets`
- **detect-secrets**: `https://github.com/Yelp/detect-secrets`
- **TruffleHog**: `https://truffleHog.com/`

---

## Complete History Cleanup (Optional but Recommended)

If you want to completely remove the secrets from git history (more complex):

```bash
# Install git-filter-repo (requires Python)
pip install git-filter-repo

# Remove the file from all history
git filter-repo --path server/.env.development --invert-paths

# Force push all branches
git push --force --all --prune
git push --force --tags

# Notify all collaborators to rebase their local clones
```

⚠️ This changes all commit hashes and requires everyone working on the repo to update their local clones.

---

## Security Scoring

- **Local Machine:** ✅ SECURE (secrets no longer in git)
- **GitHub Repository:** ⚠️ AT RISK (secrets still in commit history)
- **Production Services:** ⏳ PENDING (awaiting credential rotation)

**Overall Status:** 🔴 **CRITICAL - Rotate credentials immediately**

---

## References
- MongoDB Atlas Security: https://docs.mongodb.com/atlas/manage-clusters/
- UploadThing Dashboard: https://uploadthing.com/dashboard
- Git Security Best Practices: https://git-scm.com/docs/gitignore
- OWASP Secret Management: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html

---

**Last Updated:** March 29, 2026
**Status:** ⏳ Awaiting credential rotation
