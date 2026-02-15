# Netlify Deployment Instructions

## ✅ Fixed the API Key Issue

The error "An API Key must be set when running in a browser" has been fixed by updating the code to use Vite's environment variable system properly.

## 🚀 What Changed

1. **Updated `.env` file**: Changed `API_KEY` to `VITE_API_KEY`
2. **Updated `geminiService.ts`**: Changed all `process.env.API_KEY` to `import.meta.env.VITE_API_KEY`
3. **Added type definitions**: Created `vite-env.d.ts` for TypeScript support
4. **Simplified Vite config**: Removed custom environment variable handling

## 📝 Important: Netlify Configuration Required

Since Netlify doesn't have access to your local `.env` file, you need to add the environment variable in Netlify's dashboard:

### Steps to Configure Netlify:

1. **Go to your Netlify dashboard**: https://app.netlify.com
2. **Select your site** (thumbnail-generator)
3. **Go to Site settings** → **Environment variables**
4. **Click "Add a variable"**
5. **Add the following:**
   - **Key**: `VITE_API_KEY`
   - **Value**: `AIzaSyAwzKPgd7LSypHq1980cf01B5mUYQlOWPM`
6. **Save the variable**
7. **Trigger a new deployment** (or push your code changes to GitHub)

### Alternative: Using Netlify CLI

If you prefer using the command line:

```bash
netlify env:set VITE_API_KEY AIzaSyAwzKPgd7LSypHq1980cf01B5mUYQlOWPM
```

## 🔒 Security Note

- The `.env` file is already in `.gitignore`, so your API key won't be committed to GitHub
- Environment variables in Netlify are encrypted and secure
- Only use the `VITE_` prefix for variables that need to be exposed to the browser (like API keys used in client-side code)

## ✨ Testing Locally

To test the changes locally before deploying:

```bash
npm run dev
```

The app should now work correctly with the new environment variable setup.

## 🔄 Next Steps

1. Commit these changes to your GitHub repository
2. Add the environment variable in Netlify (as described above)
3. Netlify will automatically redeploy when you push to GitHub
4. Your site should work without the API key error!
