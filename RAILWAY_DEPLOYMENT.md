# Railway Deployment Guide

This guide explains how to deploy the QuickSpin frontend to Railway.com using Docker.

## Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- Railway CLI (optional, for command-line deployment)
- Backend API deployed and accessible

## Deployment Files

The following files are configured for Railway deployment:

- **[Dockerfile](Dockerfile)**: Multi-stage Docker build optimized for Next.js production
- **[railway.json](railway.json)**: Railway-specific configuration
- **[.dockerignore](.dockerignore)**: Files to exclude from Docker build
- **[.env.railway.example](.env.railway.example)**: Example environment variables

## Quick Deploy (Web UI)

### 1. Create New Project

1. Log in to [Railway](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select your repository

### 2. Configure Service

Railway will auto-detect the Dockerfile and railway.json configuration.

### 3. Set Environment Variables

Go to your project's **Variables** tab and add the following:

```bash
# Required
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
NEXTAUTH_URL=https://your-app.railway.app
NEXTAUTH_SECRET=generate-a-random-secret-key-here

# Optional OAuth
GITHUB_ID=your-github-oauth-client-id
GITHUB_SECRET=your-github-oauth-client-secret
GOOGLE_ID=your-google-oauth-client-id
GOOGLE_SECRET=your-google-oauth-client-secret
```

**Important**: Replace `https://your-app.railway.app` with your actual Railway URL after the first deployment.

### 4. Deploy

Railway will automatically build and deploy your application. The build process:

1. Installs dependencies
2. Builds Next.js application in standalone mode
3. Creates optimized production Docker image
4. Deploys to Railway infrastructure

### 5. Access Your Application

Once deployed, Railway provides a public URL (e.g., `https://your-app.up.railway.app`).

## Deploy via CLI

### 1. Install Railway CLI

```bash
# macOS
brew install railway

# npm
npm i -g @railway/cli

# Windows
scoop install railway
```

### 2. Login

```bash
railway login
```

### 3. Link Project

```bash
cd quick-spin-frontend
railway link
```

### 4. Set Environment Variables

```bash
railway variables set NODE_ENV=production
railway variables set NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
railway variables set NEXTAUTH_URL=https://your-app.railway.app
railway variables set NEXTAUTH_SECRET=your-secret-here
```

### 5. Deploy

```bash
railway up
```

## Configuration Details

### Dockerfile

The Dockerfile uses a multi-stage build process:

1. **deps**: Installs dependencies
2. **builder**: Builds the Next.js application
3. **runner**: Creates minimal production image

Key features:
- Alpine Linux base (smaller image size)
- Next.js standalone output
- Non-root user for security
- Optimized layer caching

### railway.json

```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "startCommand": "node server.js"
  }
}
```

### Health Checks

The application includes health check endpoints:

- `/api/health`: Basic health check
- Railway will automatically monitor this endpoint

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.example.com/api/v1` |
| `NEXTAUTH_URL` | Frontend URL | `https://app.example.com` |
| `NEXTAUTH_SECRET` | NextAuth secret key | Generate with `openssl rand -base64 32` |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_ID` | GitHub OAuth client ID |
| `GITHUB_SECRET` | GitHub OAuth client secret |
| `GOOGLE_ID` | Google OAuth client ID |
| `GOOGLE_SECRET` | Google OAuth client secret |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry (default: 1) |

## Generating Secrets

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

Or use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Custom Domain

### Add Custom Domain

1. Go to your Railway project
2. Click **Settings** > **Domains**
3. Click **Add Domain**
4. Enter your domain name
5. Add the provided CNAME record to your DNS provider

### Update Environment Variables

After adding a custom domain, update:

```bash
NEXTAUTH_URL=https://your-custom-domain.com
```

Also update OAuth callback URLs in GitHub/Google OAuth settings.

## Troubleshooting

### Build Fails

**Issue**: Docker build fails with dependency errors

**Solution**:
- Check that [package.json](package.json) is up to date
- Verify all dependencies are compatible
- Check Railway build logs for specific errors

### Application Crashes

**Issue**: Application starts but crashes immediately

**Solution**:
- Verify all required environment variables are set
- Check Railway logs: `railway logs`
- Ensure `NEXT_PUBLIC_API_URL` is accessible

### Health Check Fails

**Issue**: Railway shows unhealthy status

**Solution**:
- Verify health check endpoint is accessible: `/api/health`
- Check health check timeout in [railway.json](railway.json)
- Review application logs for startup errors

### OAuth Redirect Errors

**Issue**: OAuth login redirects fail

**Solution**:
- Verify `NEXTAUTH_URL` matches your Railway URL
- Update OAuth callback URLs in GitHub/Google settings:
  - GitHub: `https://your-app.railway.app/api/auth/callback/github`
  - Google: `https://your-app.railway.app/api/auth/callback/google`

### API Connection Issues

**Issue**: Frontend can't connect to backend

**Solution**:
- Verify `NEXT_PUBLIC_API_URL` is correct
- Ensure backend is deployed and accessible
- Check CORS configuration in backend allows Railway frontend URL
- Test API directly: `curl https://your-backend.railway.app/api/v1/health`

## Monitoring

### Railway Dashboard

Monitor your application in the Railway dashboard:

- **Metrics**: CPU, memory, network usage
- **Logs**: Real-time application logs
- **Deployments**: Deployment history and rollback

### View Logs

```bash
# CLI
railway logs

# Follow logs in real-time
railway logs --follow
```

## Scaling

Railway automatically handles scaling based on your plan:

- **Hobby Plan**: Single instance
- **Pro Plan**: Auto-scaling available

To manually adjust replicas, update [railway.json](railway.json):

```json
{
  "deploy": {
    "numReplicas": 2
  }
}
```

## Cost Optimization

### Railway Pricing

- **Hobby Plan**: $5/month + usage
- **Pro Plan**: $20/month + usage

### Optimization Tips

1. **Use standalone output**: Already configured (reduces image size)
2. **Optimize dependencies**: Remove unused packages
3. **Enable caching**: Railway caches Docker layers
4. **Monitor usage**: Check Railway dashboard regularly

## Rollback

### Via Dashboard

1. Go to **Deployments** tab
2. Find previous successful deployment
3. Click **Rollback**

### Via CLI

```bash
railway rollback
```

## CI/CD Integration

Railway automatically deploys on git push when connected to GitHub.

### Manual Deploy Trigger

```bash
railway up --detach
```

### GitHub Actions Integration

Create `.github/workflows/railway.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Railway
        run: npm i -g @railway/cli
      - name: Deploy
        run: railway up --detach
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## Security Best Practices

1. **Secrets Management**: Use Railway environment variables for all secrets
2. **OAuth Configuration**: Keep OAuth secrets in Railway, not in code
3. **HTTPS Only**: Railway provides HTTPS by default
4. **Regular Updates**: Keep dependencies updated
5. **Environment Isolation**: Use separate Railway projects for staging/production

## Support

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **QuickSpin Issues**: [GitHub Issues](https://github.com/your-org/quick-spin/issues)

## Next Steps

1. Deploy backend to Railway
2. Configure custom domain
3. Set up monitoring and alerts
4. Configure CI/CD pipeline
5. Review security settings
