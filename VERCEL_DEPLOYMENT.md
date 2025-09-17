# Vercel Deployment Guide for Rune Forge Secrets

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Prepare your configuration values

## Step-by-Step Deployment

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `YOUR_USERNAME/rune-forge-secrets`
4. Select the repository and click "Import"

### Step 2: Configure Build Settings

1. **Framework Preset**: Select "Vite"
2. **Root Directory**: Leave as default (`.`)
3. **Build Command**: `npm run build` (or leave empty - vercel.json handles this)
4. **Output Directory**: `dist` (or leave empty - vercel.json handles this)
5. **Install Command**: `npm install` (or leave empty - vercel.json handles this)

**Note**: The project includes a `vercel.json` configuration file that automatically handles these settings.

### Step 3: Environment Variables Configuration

Add the following environment variables in Vercel dashboard:

#### Required Variables:
```
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
VITE_INFURA_API_KEY=YOUR_INFURA_API_KEY
```

#### Optional Variables (for production):
```
VITE_RUNE_FORGE_SECRETS_CONTRACT=0x... (update after contract deployment)
VITE_FHE_TOKEN_CONTRACT=0x... (update after contract deployment)
```

### Step 4: Deploy

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-3 minutes)
3. Your app will be available at the provided Vercel URL

### Step 5: Custom Domain (Optional)

1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS records as instructed by Vercel

## Important Configuration Notes

### Environment Variables Priority:
- Vercel environment variables override local `.env` files
- Use Vercel dashboard for production secrets
- Keep sensitive keys secure and never commit them to Git

### Build Optimization:
- Vite automatically optimizes the build for production
- Static assets are served from Vercel's CDN
- Automatic HTTPS is enabled

### Wallet Connect Configuration:
- Ensure `VITE_WALLET_CONNECT_PROJECT_ID` is correctly set
- This enables wallet connection functionality
- Test wallet connection after deployment

## Post-Deployment Checklist

- [ ] Verify wallet connection works
- [ ] Test on different devices/browsers
- [ ] Check console for any errors
- [ ] Verify environment variables are loaded
- [ ] Test responsive design
- [ ] Confirm HTTPS is working

## Troubleshooting

### Common Issues:

1. **Build Fails with "lovable-tagger" Error**: 
   - ✅ **FIXED**: This has been resolved by removing all Lovable dependencies
   - The project now builds successfully without any Lovable references

2. **Build Fails**: Check if all dependencies are in `package.json`
3. **Environment Variables Not Loading**: Ensure they start with `VITE_`
4. **Wallet Connection Issues**: Verify WalletConnect Project ID
5. **Styling Issues**: Check if Tailwind CSS is properly configured
6. **Large Bundle Size Warning**: This is normal due to wallet dependencies and can be ignored

### Support:
- Check Vercel deployment logs for detailed error messages
- Review browser console for client-side errors
- Ensure all required environment variables are set

## Security Considerations

- Never expose private keys in environment variables
- Use HTTPS for all connections
- Regularly update dependencies
- Monitor for security vulnerabilities

## Performance Optimization

- Vercel automatically handles:
  - CDN distribution
  - Image optimization
  - Code splitting
  - Caching strategies

## Monitoring

- Use Vercel Analytics for performance monitoring
- Set up error tracking if needed
- Monitor wallet connection success rates

---

**Note**: This deployment guide assumes you have already deployed your smart contracts to the Sepolia testnet. Update the contract addresses in environment variables after deployment.
