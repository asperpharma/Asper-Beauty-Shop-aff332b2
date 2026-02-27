# How to Use the Serverless Function Documentation

This guide explains how to use the comprehensive serverless function documentation created for the Asper Beauty Shop project.

## 📚 Documentation Overview

We've created a complete documentation system for Supabase Edge Functions with multiple entry points for different needs:

```
📖 Documentation Files
├── SERVERLESS_FUNCTION_SPEC.md     (Root) - Complete specification template
├── IMPLEMENTATION_SUMMARY.md       (Root) - Implementation overview
├── HOW_TO_USE_SERVERLESS_DOCS.md   (Root) - This file
└── supabase/functions/
    ├── README.md                   - Functions overview & troubleshooting
    ├── QUICK_START.md              - Quick reference guide
    └── TEMPLATE.ts                 - Starter code template
```

## 🎯 Choose Your Path

### Path 1: I Need to Create a Function FAST ⚡

**For**: Developers who need to implement a function quickly

**Steps**:
1. Open `supabase/functions/QUICK_START.md`
2. Follow the checklist
3. Copy `supabase/functions/TEMPLATE.ts`
4. Modify for your needs
5. Deploy

**Time**: ~30 minutes

### Path 2: I'm Planning a New Function 📋

**For**: Architects, team leads, or developers planning a new feature

**Steps**:
1. Open `SERVERLESS_FUNCTION_SPEC.md`
2. Fill out each section:
   - Function name (URL-safe)
   - Purpose & inputs
   - Routes & methods
   - Authentication model
   - Environment variables
   - Response formats
   - Performance needs
3. Share with team for review
4. Get approval
5. Hand off to developer (who follows Path 1)

**Time**: ~1-2 hours for thorough planning

### Path 3: I'm New to the Project 🌱

**For**: New developers onboarding to the project

**Steps**:
1. Read `supabase/functions/README.md` - Understand existing functions
2. Review `QUICK_START.md` - Learn the basics
3. Study existing functions:
   - `beauty-assistant/` - Authentication example
   - `bulk-product-upload/` - Admin RBAC example
4. When ready, use `TEMPLATE.ts` for your first function

**Time**: ~2-3 hours to understand fully

### Path 4: I'm Troubleshooting 🔍

**For**: Developers debugging issues

**Steps**:
1. Check `supabase/functions/README.md` - Common Issues section
2. Review authentication patterns in `QUICK_START.md`
3. Verify environment variables are set correctly
4. Check response format matches standards in `SERVERLESS_FUNCTION_SPEC.md`
5. Review CORS configuration

**Time**: ~15-30 minutes

## 📖 Detailed File Guide

### SERVERLESS_FUNCTION_SPEC.md (Complete Reference)

**When to use**: Planning, architecture discussions, reference

**What it contains**:
- ✅ Function naming conventions
- ✅ Input/output specifications
- ✅ Database operation patterns
- ✅ External API integration
- ✅ Authentication models (4 types)
- ✅ Environment variable management
- ✅ Response format standards
- ✅ Performance optimization
- ✅ CORS configuration
- ✅ Error handling best practices
- ✅ Testing checklist
- ✅ Real-world examples

**Best for**: Comprehensive reference, specification writing

### supabase/functions/QUICK_START.md

**When to use**: Need to start coding immediately

**What it contains**:
- ✅ Quick checklist
- ✅ Common commands
- ✅ Minimal function template
- ✅ Authentication patterns (3 types)
- ✅ Environment variable setup
- ✅ Testing examples

**Best for**: Fast implementation, command reference

### supabase/functions/README.md

**When to use**: Understanding the functions directory

**What it contains**:
- ✅ Overview of existing functions
- ✅ Function creation workflow
- ✅ Authentication patterns
- ✅ Environment variables reference
- ✅ Common issues & solutions
- ✅ Resources & links

**Best for**: Project overview, troubleshooting

### supabase/functions/TEMPLATE.ts

**When to use**: Starting a new function

**What it contains**:
- ✅ Production-ready TypeScript code
- ✅ CORS configuration
- ✅ Authentication (toggleable)
- ✅ Authorization (RBAC)
- ✅ Input validation
- ✅ Error handling
- ✅ Response formatting
- ✅ Comprehensive comments

**Best for**: Copy-paste starting point

### IMPLEMENTATION_SUMMARY.md

**When to use**: Understanding what was built

**What it contains**:
- ✅ Requirements mapping
- ✅ Files created
- ✅ Statistics & metrics
- ✅ Usage scenarios
- ✅ Integration details

**Best for**: Project overview, stakeholder updates

## 🚀 Common Scenarios

### Scenario 1: Create a Public Webhook Handler

**Need**: Process webhook from external service (no auth)

**Steps**:
1. Copy `TEMPLATE.ts` to `supabase/functions/process-webhook/index.ts`
2. Keep authentication section commented out
3. Add to `config.toml`: `[functions.process-webhook]` with `verify_jwt = false`
4. Implement webhook validation logic
5. Deploy: `supabase functions deploy process-webhook`

**Reference**: 
- `QUICK_START.md` - Public function pattern
- `SERVERLESS_FUNCTION_SPEC.md` - Section 4 (Authentication)

### Scenario 2: Create Authenticated User Function

**Need**: Function that requires logged-in user

**Steps**:
1. Copy `TEMPLATE.ts` to your function directory
2. Uncomment authentication section
3. Remove admin authorization section
4. Implement business logic
5. Deploy

**Reference**:
- `beauty-assistant/index.ts` - Real example
- `QUICK_START.md` - Authenticated users pattern

### Scenario 3: Create Admin-Only Function

**Need**: Function only admins can access

**Steps**:
1. Copy `TEMPLATE.ts` to your function directory
2. Uncomment authentication section
3. Uncomment authorization (RBAC) section
4. Implement admin-specific logic
5. Deploy

**Reference**:
- `bulk-product-upload/index.ts` - Real example
- `SERVERLESS_FUNCTION_SPEC.md` - Section 4 (RBAC pattern)

### Scenario 4: Function with External API

**Need**: Call external service (e.g., Stripe, SendGrid)

**Steps**:
1. Set environment variable: `supabase secrets set API_KEY=xxx`
2. Copy `TEMPLATE.ts`
3. Add API call in business logic section
4. Handle rate limiting and errors
5. Deploy

**Reference**:
- `SERVERLESS_FUNCTION_SPEC.md` - Section 2 (External API Calls)
- `bulk-product-upload/index.ts` - Shopify API example

## 🔧 Command Cheat Sheet

```bash
# Create new function
mkdir supabase/functions/my-function
cp supabase/functions/TEMPLATE.ts supabase/functions/my-function/index.ts

# Add to config
echo '[functions.my-function]
verify_jwt = false' >> supabase/config.toml

# Set secrets
supabase secrets set MY_API_KEY=value

# Deploy
supabase functions deploy my-function

# Test locally
supabase functions serve my-function

# Test remote
curl -X POST https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/my-function \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## 🎓 Learning Path

**Week 1**: Understanding
- Day 1-2: Read `supabase/functions/README.md`
- Day 3-4: Study `beauty-assistant/index.ts` (authenticated example)
- Day 5: Study `bulk-product-upload/index.ts` (admin example)

**Week 2**: Practice
- Day 1-2: Create simple public function (webhook handler)
- Day 3-4: Create authenticated function (user-specific)
- Day 5: Create admin function (RBAC)

**Week 3**: Mastery
- Study `SERVERLESS_FUNCTION_SPEC.md` in depth
- Implement complex function with external APIs
- Optimize for performance

## ❓ FAQ

### Q: Which file should I read first?
**A**: Start with `supabase/functions/README.md` for overview, then `QUICK_START.md` for hands-on.

### Q: I'm confused about authentication. Where do I look?
**A**: `SERVERLESS_FUNCTION_SPEC.md` Section 4 has detailed patterns with code examples.

### Q: How do I know which auth model to use?
**A**: 
- Public data/webhooks → No auth
- User-specific operations → Authenticated
- Admin operations → RBAC

### Q: Where are environment variables explained?
**A**: `SERVERLESS_FUNCTION_SPEC.md` Section 5 and `QUICK_START.md`

### Q: I need help with response formats.
**A**: `SERVERLESS_FUNCTION_SPEC.md` Section 6 covers all status codes and JSON schemas.

### Q: My function is timing out. What do I do?
**A**: `SERVERLESS_FUNCTION_SPEC.md` Section 7 covers performance and timeouts.

## 🆘 Getting Help

1. **Check documentation first**:
   - Common issues: `supabase/functions/README.md`
   - Patterns: `QUICK_START.md`
   - Deep dive: `SERVERLESS_FUNCTION_SPEC.md`

2. **Review existing functions**:
   - Authentication: `beauty-assistant/`
   - Admin RBAC: `bulk-product-upload/`

3. **Ask the team**:
   - Share your specification from `SERVERLESS_FUNCTION_SPEC.md` template
   - Include what you've tried

## 🎯 Success Criteria

You've successfully used this documentation when you can:

- ✅ Create a new function in < 30 minutes
- ✅ Choose the correct authentication model
- ✅ Set up environment variables properly
- ✅ Return proper response formats
- ✅ Handle errors gracefully
- ✅ Deploy without issues

## 📝 Contributing

Found an issue or want to improve the documentation?

1. Check if issue already exists
2. If not, create detailed description
3. Reference specific file and section
4. Suggest improvement

## 🔗 Quick Links

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Documentation](https://deno.land/manual)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Remember**: This documentation is here to help you. Don't try to memorize everything—use it as a reference as you build!

*Last Updated: 2026-02-17*
