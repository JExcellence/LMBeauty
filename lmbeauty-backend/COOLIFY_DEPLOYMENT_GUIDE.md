# LM Beauty Backend - Coolify Deployment Guide

## Prerequisites

- Coolify instance running
- Domain `api.lmbeauty.de` DNS configured to point to your Coolify server
- Git repository accessible by Coolify

## Step-by-Step Deployment

### 1. Create New Service in Coolify

1. Log into your Coolify dashboard
2. Go to your project
3. Click **"+ New Resource"**
4. Select **"Public Repository"** or **"Private Repository"** (depending on your setup)
5. Enter your repository URL: `https://github.com/your-username/lmbeauty-backend.git`
6. Select branch: `main` (or your production branch)

### 2. Configure Build Settings

**Build Pack:** Dockerfile

**Dockerfile Location:** `./Dockerfile` (if you have one) or use Nixpacks (auto-detect)

**Port:** `5000`

**Health Check Path:** `/actuator/health`

### 3. Set Domain

In the service settings:
- **Domain:** `api.lmbeauty.de`
- **Enable SSL:** ✅ (Coolify will auto-generate Let's Encrypt certificate)

### 4. Add Environment Variables

Go to **Environment Variables** tab and add all variables from `COOLIFY_ENV_PRODUCTION.txt`:

**Critical Variables to Set:**

```env
# Application
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=5000

# Frontend
APP_FRONTEND_URL=https://lmbeauty.de
FRONTEND_URL=https://lmbeauty.de

# CORS
CORS_ALLOWED_ORIGINS=https://lmbeauty.de,https://www.lmbeauty.de,https://api.lmbeauty.de

# JWT (CHANGE THIS!)
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-256-bits-long-change-in-production

# Admin
ADMIN_EMAILS=justineiletz@gmail.com

# Google OAuth
GOOGLE_CLIENT_ID=910196713908-3u7fiv3go6quoctbv9vkruvh298aeg07.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://lmbeauty.de/auth/google/callback

# Instagram
INSTAGRAM_CLIENT_ID=895171643190736
INSTAGRAM_CLIENT_SECRET=633bacb4a386bf59a33352a07a8f4aba
INSTAGRAM_REDIRECT_URI=https://lmbeauty.de/auth/instagram/callback
INSTAGRAM_ACCESS_TOKEN=IGAAMuJ2POLdBBZAFpBVmpJLWQwQkV1cUlXSms3akoyMHlJR0NnUEJmejFTTklBUGVMZAHBxVWI1S1ZAwVFV6cERXMFdrVDktaHZAIVFA3V0dsOVJ1eTZA4OUJLNlFfMXlXeUZACejlxNlVKMlg1alRrUHBkMmRDa3RxV1NiZAkNOSFlfdwZDZD
```

**Copy all other variables from `COOLIFY_ENV_PRODUCTION.txt`**

### 5. Create Dockerfile (if not exists)

If your backend doesn't have a Dockerfile, create one:

```dockerfile
FROM gradle:8-jdk17 AS builder
WORKDIR /app
COPY . .
RUN gradle clean build -x test

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 5000
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 6. Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (check logs)
3. Verify deployment at: `https://api.lmbeauty.de/actuator/health`

### 7. Verify Deployment

Test these endpoints:

```bash
# Health check
curl https://api.lmbeauty.de/actuator/health

# Services endpoint
curl https://api.lmbeauty.de/api/frontend/services/enhanced

# Reviews endpoint
curl https://api.lmbeauty.de/api/frontend/reviews
```

### 8. Update Frontend (After Backend is Live)

Once backend is deployed and working, you can optionally update the frontend to use the real backend instead of fallback data. But the current setup will automatically use the backend when it's available!

## Troubleshooting

### Build Fails

**Check:**
- Java version (should be 17)
- Gradle version compatibility
- Build logs in Coolify

### Health Check Fails

**Check:**
- Port 5000 is exposed
- Application is starting correctly
- Check application logs

### CORS Errors

**Verify:**
- `CORS_ALLOWED_ORIGINS` includes `https://lmbeauty.de`
- `SPRING_WEB_CORS_ALLOW_CREDENTIALS=true`
- Frontend domain matches exactly

### Instagram/Google OAuth Not Working

**Check:**
- Redirect URIs in Google/Instagram console match production URLs
- Access tokens are valid and not expired
- Client IDs and secrets are correct

## Security Checklist

- [ ] Changed `JWT_SECRET` to a secure random value
- [ ] Verified OAuth redirect URIs match production domain
- [ ] SSL certificate is active (check `https://api.lmbeauty.de`)
- [ ] Health endpoint is accessible
- [ ] CORS is properly configured
- [ ] Instagram access token is valid

## Monitoring

**Health Check:** `https://api.lmbeauty.de/actuator/health`

**Metrics:** `https://api.lmbeauty.de/actuator/metrics`

**Info:** `https://api.lmbeauty.de/actuator/info`

## Instagram Token Refresh

Instagram access tokens expire. When you see Instagram posts not loading:

1. Go to Instagram Developer Console
2. Refresh your access token
3. Update `INSTAGRAM_ACCESS_TOKEN` in Coolify
4. Redeploy the service

## Need Help?

Common issues:
- **502 Bad Gateway:** Backend not starting, check logs
- **404 Not Found:** Wrong domain or path
- **CORS errors:** Check CORS configuration
- **OAuth errors:** Verify redirect URIs and credentials
