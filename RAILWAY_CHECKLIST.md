# Railway Deployment Checklist

Use this checklist to ensure a smooth deployment to Railway.

## Pre-Deployment

- [ ] Backend API is deployed and accessible
- [ ] Backend API URL is known (e.g., `https://your-backend.railway.app`)
- [ ] Railway account created at [railway.app](https://railway.app)
- [ ] GitHub repository is accessible (for auto-deployment)

## OAuth Setup (if using)

### GitHub OAuth App
- [ ] Create OAuth App at GitHub Settings → Developer Settings → OAuth Apps
- [ ] Set Authorization callback URL: `https://your-app.railway.app/api/auth/callback/github`
- [ ] Copy Client ID and Client Secret
- [ ] Note: Update URL after getting Railway domain

### Google OAuth Client
- [ ] Create OAuth Client at Google Cloud Console
- [ ] Add authorized redirect URI: `https://your-app.railway.app/api/auth/callback/google`
- [ ] Copy Client ID and Client Secret
- [ ] Note: Update URL after getting Railway domain

## Secrets Generation

- [ ] Generate `NEXTAUTH_SECRET`:
  ```bash
  openssl rand -base64 32
  # or
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```

## Railway Setup

### 1. Create Project
- [ ] Log in to Railway
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Authorize Railway to access GitHub
- [ ] Select `quick-spin` repository
- [ ] Select `quick-spin-frontend` directory (if monorepo)

### 2. Configure Environment Variables

**Required Variables:**
- [ ] `NODE_ENV` = `production`
- [ ] `NEXT_PUBLIC_API_URL` = `https://your-backend.railway.app/api/v1`
- [ ] `NEXTAUTH_URL` = `https://your-app.railway.app` (update after first deploy)
- [ ] `NEXTAUTH_SECRET` = `<your-generated-secret>`

**Optional OAuth Variables:**
- [ ] `GITHUB_ID` = `<your-github-client-id>`
- [ ] `GITHUB_SECRET` = `<your-github-client-secret>`
- [ ] `GOOGLE_ID` = `<your-google-client-id>`
- [ ] `GOOGLE_SECRET` = `<your-google-client-secret>`

**Optional Feature Flags:**
- [ ] `NEXT_TELEMETRY_DISABLED` = `1`
- [ ] `NEXT_PUBLIC_ENABLE_ANALYTICS` = `false`

### 3. Deploy
- [ ] Railway automatically detects Dockerfile
- [ ] Railway automatically detects railway.json
- [ ] Click "Deploy" or wait for auto-deployment
- [ ] Monitor build logs for errors

### 4. Post-Deployment

**Get Railway URL:**
- [ ] Copy Railway-generated URL (e.g., `https://your-app.up.railway.app`)
- [ ] Or set up custom domain

**Update Environment Variables:**
- [ ] Update `NEXTAUTH_URL` with actual Railway URL
- [ ] Redeploy if needed (Railway auto-deploys on env change)

**Update OAuth Callbacks:**
- [ ] GitHub: Update Authorization callback URL with Railway URL
- [ ] Google: Update Authorized redirect URI with Railway URL

## Verification

### Health Check
- [ ] Visit `https://your-app.railway.app/api/health`
- [ ] Verify response: `{"status":"healthy",...}`

### Application Access
- [ ] Visit `https://your-app.railway.app`
- [ ] Should redirect to `/auth/login`
- [ ] Test login page loads

### Authentication
- [ ] Test email/password login (if configured)
- [ ] Test GitHub OAuth (if configured)
- [ ] Test Google OAuth (if configured)
- [ ] Verify successful redirect to dashboard

### API Connection
- [ ] Open browser console on dashboard
- [ ] Check for API connection errors
- [ ] Verify data loads from backend
- [ ] Test creating/reading resources

### Backend CORS
- [ ] Verify backend allows Railway frontend URL
- [ ] Check backend `CORS_ORIGINS` includes Railway URL
- [ ] Update backend CORS if needed

## Monitoring

- [ ] Check Railway dashboard metrics (CPU, memory)
- [ ] Review application logs in Railway
- [ ] Set up alerts (optional, Pro plan)
- [ ] Monitor health check status

## Custom Domain (Optional)

- [ ] Go to Railway project → Settings → Domains
- [ ] Click "Add Domain"
- [ ] Enter your domain name
- [ ] Add CNAME record to DNS provider:
  - Name: `@` or `www`
  - Value: `<your-railway-domain>.up.railway.app`
- [ ] Wait for DNS propagation (5-60 minutes)
- [ ] Update `NEXTAUTH_URL` with custom domain
- [ ] Update OAuth callback URLs with custom domain

## Troubleshooting

### Build Fails
- [ ] Check Railway build logs
- [ ] Verify all dependencies in package.json
- [ ] Test Docker build locally:
  ```bash
  docker build -t quickspin-frontend .
  ```

### Application Crashes
- [ ] Check Railway application logs
- [ ] Verify all required environment variables set
- [ ] Check for startup errors in logs

### Health Check Fails
- [ ] Test health endpoint manually
- [ ] Check health check timeout in railway.json
- [ ] Review application logs for errors

### OAuth Errors
- [ ] Verify OAuth callback URLs match Railway URL
- [ ] Check OAuth credentials are correct
- [ ] Ensure `NEXTAUTH_URL` is set correctly
- [ ] Test OAuth apps in development first

### API Connection Issues
- [ ] Verify `NEXT_PUBLIC_API_URL` is correct and accessible
- [ ] Test backend directly: `curl https://backend-url/api/v1/health`
- [ ] Check backend CORS settings
- [ ] Review browser console for CORS errors

### Performance Issues
- [ ] Check Railway metrics (CPU, memory usage)
- [ ] Consider upgrading Railway plan
- [ ] Optimize frontend bundle size
- [ ] Enable caching in backend

## Rollback Plan

If deployment fails:
- [ ] Railway Dashboard → Deployments → Select previous version → Rollback
- [ ] Or CLI: `railway rollback`
- [ ] Or Git: Revert commit and push

## Success Criteria

All of the following should be true:

- [x] Docker build completes without errors
- [x] Health check returns 200 OK with valid JSON
- [x] Application loads in browser
- [x] Login page is accessible
- [x] Authentication flow works (at least one method)
- [x] Dashboard loads after login
- [x] API calls succeed
- [x] No critical errors in browser console
- [x] No critical errors in Railway logs
- [x] Performance is acceptable (< 3 second load time)

## Post-Deployment Tasks

- [ ] Document Railway URL in team wiki/docs
- [ ] Share credentials with team (use secure method)
- [ ] Set up staging environment (optional)
- [ ] Configure CI/CD pipeline (optional)
- [ ] Set up monitoring/alerting (optional)
- [ ] Plan for scaling (if expecting high traffic)
- [ ] Review security settings
- [ ] Set up regular backups (if needed)

## Maintenance

### Regular Tasks
- [ ] Monitor Railway usage and costs
- [ ] Review application logs weekly
- [ ] Update dependencies monthly
- [ ] Review security advisories
- [ ] Test disaster recovery plan

### When Updating
- [ ] Test changes locally first
- [ ] Test Docker build locally
- [ ] Deploy to staging (if available)
- [ ] Monitor deployment logs
- [ ] Verify health checks pass
- [ ] Test critical functionality
- [ ] Have rollback plan ready

---

**Need Help?**
- See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for detailed instructions
- See [RAILWAY_SETUP_SUMMARY.md](RAILWAY_SETUP_SUMMARY.md) for architecture overview
- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
