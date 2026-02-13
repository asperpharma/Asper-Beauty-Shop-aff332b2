# Supabase Edge Functions Quick Reference

This guide helps you quickly find information about Supabase Edge Functions in this project.

## 📚 Documentation Index

### Main Documentation
- **[ENVIRONMENT_VARIABLES.md](../ENVIRONMENT_VARIABLES.md)** - Complete environment variables reference
- **[README.md](README.md)** - Edge Functions overview and setup

### Function-Specific Guides
- **[beauty-assistant/README.md](beauty-assistant/README.md)** - AI beauty consultation chatbot
- **[bulk-product-upload/README.md](bulk-product-upload/README.md)** - Admin bulk operations tool

## 🚀 Quick Start

### Local Development
```bash
# 1. Start Supabase
supabase start

# 2. Create local secrets file (optional)
cat > .env.local << EOF
LOVABLE_API_KEY=your_dev_key
SHOPIFY_ACCESS_TOKEN=your_dev_token
EOF

# 3. Serve a function
supabase functions serve beauty-assistant --no-verify-jwt --env-file .env.local
```

### Production Deployment
```bash
# 1. Set secrets
supabase secrets set LOVABLE_API_KEY=your_prod_key
supabase secrets set SHOPIFY_ACCESS_TOKEN=your_prod_token

# 2. Deploy all functions
supabase functions deploy

# 3. Or deploy specific function
supabase functions deploy beauty-assistant
```

## 🔑 Environment Variables

### Auto-Injected (Don't Set These)
These are **automatically provided** by Supabase:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

### Custom Secrets (Must Set Manually)
```bash
supabase secrets set LOVABLE_API_KEY=your_key
supabase secrets set SHOPIFY_ACCESS_TOKEN=your_token
```

## 📡 Function Endpoints

### beauty-assistant
- **Production:** `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant`
- **Local:** `http://localhost:54321/functions/v1/beauty-assistant`
- **Auth:** User JWT token required
- **Purpose:** AI beauty consultation chatbot

### bulk-product-upload  
- **Production:** `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload`
- **Local:** `http://localhost:54321/functions/v1/bulk-product-upload`
- **Auth:** Admin JWT token required
- **Purpose:** Product categorization, image generation, Shopify integration

## 🧪 Testing

### Test beauty-assistant
```bash
curl -X POST 'http://localhost:54321/functions/v1/beauty-assistant' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Hello!"}]}'
```

### Test bulk-product-upload
```bash
curl -X POST 'http://localhost:54321/functions/v1/bulk-product-upload' \
  -H 'Authorization: Bearer YOUR_ADMIN_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"action":"categorize","products":[{"sku":"TEST","name":"Test","costPrice":10,"sellingPrice":15}]}'
```

## 🔍 Common Tasks

### Check if secrets are set
```bash
supabase secrets list
```

### View function logs
```bash
supabase functions logs beauty-assistant
supabase functions logs bulk-product-upload
```

### Delete a function
```bash
supabase functions delete function-name
```

### Update a secret
```bash
supabase secrets set SECRET_NAME=new_value
```

## 🛠️ Troubleshooting

### "Unauthorized" Error
- Verify JWT token is valid: check `Authorization: Bearer <token>` header
- For bulk-product-upload: ensure user has admin role in `user_roles` table

### "SECRET is not configured"
```bash
# Set the missing secret
supabase secrets set SECRET_NAME=value

# Verify it's set
supabase secrets list

# Redeploy function
supabase functions deploy function-name
```

### Function doesn't receive updates
- Redeploy after changing code: `supabase functions deploy function-name`
- Check logs for errors: `supabase functions logs function-name`

### Can't access auto-injected variables
- For local: ensure `supabase start` is running
- For production: these are always available (check function logs for actual error)

## 📖 AI Models Used

- **beauty-assistant:** Gemini 2.5 Flash (chat)
- **bulk-product-upload:**
  - Image generation: Gemini 2.5 Flash Image Preview
  - AI categorization: Gemini 3.0 Flash Preview

## 🔐 Security Reminders

- ✅ Auto-injected variables work automatically
- ✅ Store custom secrets with `supabase secrets set`
- ❌ Never hardcode API keys in code
- ❌ Never commit `.env` files to git
- ❌ Never expose `SUPABASE_SERVICE_ROLE_KEY` to client-side

## 📞 Need Help?

1. Check function-specific README for detailed docs
2. Review [ENVIRONMENT_VARIABLES.md](../ENVIRONMENT_VARIABLES.md) for env setup
3. Check Supabase dashboard logs
4. Contact: asperpharma@gmail.com

## 🔗 Useful Links

- [Supabase Functions Docs](https://supabase.com/docs/guides/functions)
- [Lovable AI Gateway](https://docs.lovable.dev/api-reference/ai-gateway)
- [Project README](../README.md)
