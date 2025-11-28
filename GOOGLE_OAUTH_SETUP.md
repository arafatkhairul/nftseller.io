# Google OAuth Setup Guide

## 🎯 Overview
Google OAuth authentication has been successfully integrated into your NFT Marketplace application. Users can now sign in/register using their Google accounts.

## 📋 What Was Added

### 1. **Backend Components**
- ✅ Laravel Socialite package installed
- ✅ `GoogleAuthController` created for handling OAuth flow
- ✅ Database migration for `google_id` and `avatar` fields
- ✅ User model updated with Google OAuth fields
- ✅ Routes configured for Google authentication

### 2. **Frontend Components**
- ✅ `GoogleSignInButton` component with official Google branding
- ✅ Login page updated with Google Sign In option
- ✅ Register page updated with Google Sign Up option
- ✅ Professional divider between OAuth and email forms

### 3. **Database Changes**
- ✅ `google_id` column added to users table (unique, nullable)
- ✅ `avatar` column added to users table (nullable)

---

## 🔧 Setup Instructions

### Step 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing)
   - Click "Select a project" → "New Project"
   - Name: "NFTSeller" (or your app name)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "NFTSeller Web Client"

5. **Configure OAuth Consent Screen** (if prompted)
   - User Type: "External"
   - App name: "NFTSeller"
   - User support email: Your email
   - Developer contact: Your email
   - Add scopes: email, profile
   - Save and continue

6. **Add Authorized Redirect URIs**
   ```
   For Local Development:
   http://localhost:8000/auth/google/callback
   
   For Production:
   https://yourdomain.com/auth/google/callback
   ```

7. **Copy Your Credentials**
   - Client ID: `xxxxx.apps.googleusercontent.com`
   - Client Secret: `xxxxx`

---

### Step 2: Configure Environment Variables

1. **Open your `.env` file**

2. **Add Google OAuth credentials:**
   ```env
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
   ```

3. **For production, update:**
   ```env
   APP_URL=https://yourdomain.com
   GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
   ```

---

### Step 3: Clear Config Cache

Run this command to ensure Laravel picks up the new environment variables:

```bash
php artisan config:clear
```

---

## 🎨 How It Works

### User Flow:

1. **User clicks "Continue with Google"** on login/register page
2. **Redirected to Google** for authentication
3. **User authorizes** the application
4. **Google redirects back** with user data
5. **System checks** if user exists:
   - **Existing user**: Updates Google ID and avatar, logs in
   - **New user**: Creates account with Google data, auto-verifies email, logs in
6. **User redirected** to dashboard

### Features:

✅ **Auto-create accounts** from Google data  
✅ **Auto-verify email** for Google users  
✅ **Link existing accounts** by email  
✅ **Store user avatar** from Google  
✅ **Secure random password** for Google users  
✅ **Professional UI** with Google branding  

---

## 🧪 Testing

### Local Testing:

1. **Start your development server:**
   ```bash
   composer dev
   ```

2. **Visit login page:**
   ```
   http://localhost:8000/login
   ```

3. **Click "Continue with Google"**

4. **Authorize with your Google account**

5. **You should be redirected to dashboard**

---

## 🔒 Security Features

- ✅ Google ID stored securely
- ✅ Email verification automatic for Google users
- ✅ Random secure password generated
- ✅ OAuth state parameter for CSRF protection
- ✅ Proper error handling and redirects

---

## 📱 UI Components

### GoogleSignInButton Component
Location: `resources/js/components/google-sign-in-button.tsx`

**Props:**
- `text` (optional): Button text (default: "Continue with Google")
- `className` (optional): Additional CSS classes

**Usage:**
```tsx
<GoogleSignInButton />
<GoogleSignInButton text="Sign up with Google" />
```

---

## 🛠️ Files Modified/Created

### Created:
- `app/Http/Controllers/Auth/GoogleAuthController.php`
- `database/migrations/2025_11_28_184312_add_google_id_to_users_table.php`
- `resources/js/components/google-sign-in-button.tsx`

### Modified:
- `composer.json` (added laravel/socialite)
- `config/services.php` (added Google config)
- `.env.example` (added Google credentials)
- `app/Models/User.php` (added google_id, avatar to fillable)
- `routes/auth.php` (added Google OAuth routes)
- `resources/js/pages/auth/login.tsx` (added Google button)
- `resources/js/pages/auth/register.tsx` (added Google button)

---

## 🚀 Production Deployment

### Before deploying:

1. **Update Google Cloud Console:**
   - Add production redirect URI
   - Update authorized domains

2. **Update `.env` on production:**
   ```env
   APP_URL=https://yourdomain.com
   GOOGLE_CLIENT_ID=your-production-client-id
   GOOGLE_CLIENT_SECRET=your-production-client-secret
   GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
   ```

3. **Run migrations:**
   ```bash
   php artisan migrate --force
   ```

4. **Clear cache:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

---

## 🐛 Troubleshooting

### Issue: "redirect_uri_mismatch"
**Solution:** Ensure the redirect URI in Google Console exactly matches your `.env` setting

### Issue: "Client ID not found"
**Solution:** Check that `GOOGLE_CLIENT_ID` is set correctly in `.env` and run `php artisan config:clear`

### Issue: "User not logged in after callback"
**Solution:** Check error logs in `storage/logs/laravel.log`

### Issue: "Google button not showing"
**Solution:** Ensure Vite is running and component is imported correctly

---

## 📞 Support

If you encounter any issues:
1. Check `storage/logs/laravel.log` for errors
2. Verify Google Console settings
3. Ensure `.env` variables are correct
4. Clear config cache: `php artisan config:clear`

---

## ✨ Next Steps

You can extend this further by:
- Adding Facebook OAuth
- Adding GitHub OAuth
- Adding Twitter OAuth
- Customizing user profile with Google avatar
- Adding option to disconnect Google account

---

**Status:** ✅ Ready to use!  
**Last Updated:** 2025-11-29
