# Serverless Function Documentation

Comprehensive documentation for creating and managing Supabase Edge Functions in the Asper Beauty Shop project.

---

## 📚 Documentation Files

### 1. [Quick Reference](./SERVERLESS_FUNCTION_QUICKREF.md) ⚡
**Start here!** Quick reference guide with code snippets and checklists.

**Best for:**
- Creating a new function quickly
- Looking up common patterns
- Copy-paste code snippets
- Debugging checklist

**Contents:**
- Quick start checklist
- Function specification template (copy & fill)
- Authentication patterns (4 types)
- Standard response formats
- Performance patterns
- Common code snippets
- Testing commands
- Status code reference
- Debugging tips

---

### 2. [Complete Specification Guide](./SERVERLESS_FUNCTION_SPEC.md) 📖
**Comprehensive guide** with detailed explanations and all patterns.

**Best for:**
- Understanding the full architecture
- Learning authentication models in depth
- Performance optimization strategies
- Best practices and standards
- Detailed examples with explanations

**Contents:**
- Function naming conventions
- Complete specification template
- 4 Authentication models (Public, Authenticated, Service Role, Hybrid)
- Request/Response formats with JSON schemas
- Environment variables setup
- Performance considerations (timeouts, background work, rate limiting, caching)
- Implementation templates
- 3 Complete examples (webhook, notification, report generator)
- Best practices
- Testing and troubleshooting

---

### 3. [Example: process-webhook](./FUNCTION_EXAMPLE_process-webhook.md) 🎯
**Real-world implementation** of a webhook processing function.

**Best for:**
- Seeing a complete implementation
- Understanding project structure
- Learning signature verification
- Background processing patterns
- Database logging strategies

**Contents:**
- Complete function specification
- Full implementation with file structure
- Signature verification (Shopify, Stripe)
- Handler pattern for multiple sources
- Logging utilities
- Database schema
- Testing instructions
- Security considerations
- Monitoring and alerts
- Maintenance guide

---

## 🚀 Getting Started

### For New Functions

1. **Read** [Quick Reference](./SERVERLESS_FUNCTION_QUICKREF.md) (10 minutes)
2. **Copy** the specification template
3. **Fill in** your function details
4. **Review** [Complete Specification Guide](./SERVERLESS_FUNCTION_SPEC.md) for your auth model
5. **Implement** using the patterns
6. **Test** locally
7. **Deploy** to production

### For Understanding Existing Functions

1. **Review** [Complete Specification Guide](./SERVERLESS_FUNCTION_SPEC.md)
2. **Study** [process-webhook example](./FUNCTION_EXAMPLE_process-webhook.md)
3. **Examine** existing functions in `../supabase/functions/`
   - `beauty-assistant` - Authenticated AI chatbot
   - `bulk-product-upload` - Admin-only batch operations

---

## 🎓 Learning Path

### Beginner (Never created a Supabase function)
1. Read Quick Reference introduction
2. Review authentication patterns section
3. Study the process-webhook example
4. Create a simple public function

### Intermediate (Created 1-2 functions)
1. Review Complete Specification Guide
2. Understand all authentication models
3. Learn performance patterns (background processing, rate limiting)
4. Implement error handling and logging

### Advanced (Creating production functions)
1. Study security best practices
2. Implement comprehensive error handling
3. Add monitoring and alerts
4. Optimize for performance and scalability

---

## 📊 Document Comparison

| Feature | Quick Reference | Specification Guide | Webhook Example |
|---------|----------------|---------------------|-----------------|
| **Length** | ~400 lines | ~600 lines | ~800 lines |
| **Focus** | Practical snippets | Complete patterns | Real implementation |
| **Code Examples** | Many snippets | Full templates | Complete function |
| **Best For** | Quick lookup | Learning | Understanding |
| **Read Time** | 10 minutes | 30 minutes | 45 minutes |

---

## 🔑 Key Concepts

### Function Naming
- Use kebab-case: `my-function-name`
- 2-4 words maximum
- Descriptive and URL-safe

### Authentication Models
1. **Public** - No auth (webhooks, health checks)
2. **Authenticated** - User JWT required (user operations)
3. **Service Role** - Admin only (bulk operations, reports)
4. **Hybrid** - Optional auth (public with premium features)

### Response Patterns
- Always return JSON
- Include `success` boolean
- Use standard status codes (200, 400, 401, 403, 404, 429, 500)
- Include error codes and messages

### Performance
- 150 second timeout maximum
- Use background processing for long tasks
- Implement rate limiting for expensive operations
- Cache frequently accessed data

---

## 🛠️ Quick Commands

```bash
# Create new function
mkdir -p supabase/functions/my-function
cd supabase/functions/my-function
# Create index.ts with your implementation

# Test locally
supabase functions serve my-function --env-file ./.env

# Deploy
supabase functions deploy my-function

# View logs
supabase functions logs my-function --tail

# Set environment variable
supabase secrets set MY_SECRET=value
```

---

## 📝 Specification Template (Quick)

```markdown
## Function: my-function

**Purpose:** [One sentence description]

**Auth:** [ ] Public  [ ] Authenticated  [ ] Service Role  [ ] Hybrid

**Input:**
- Method: POST
- Body: { "field": "value" }

**Processing:**
1. Validate input
2. Process data
3. Return response

**Output:**
- 200: { "success": true, "data": {} }
- 400: { "error": "message" }

**Env Vars:**
- REQUIRED_VAR - Description

**Performance:**
- Timeout: 30s
- Rate Limit: 100/min
```

---

## 🔍 Finding Information

### I want to...
- **Create a new function** → Quick Reference → Quick Start Checklist
- **Understand authentication** → Specification Guide → Authentication Models
- **See a complete example** → process-webhook Example
- **Look up error codes** → Quick Reference → Status Code Reference
- **Debug an issue** → Quick Reference → Debugging Tips
- **Optimize performance** → Specification Guide → Performance Considerations
- **Test my function** → Quick Reference → Testing Commands
- **Deploy to production** → Quick Reference → Deployment section

---

## 🎯 Common Tasks

### Creating a Public Webhook Handler
1. Quick Reference → Authentication Patterns → Pattern 1
2. process-webhook Example → Signature Verification
3. Implement verify signature logic
4. Add to config.toml with verify_jwt = false

### Creating an Authenticated User Endpoint
1. Quick Reference → Authentication Patterns → Pattern 2
2. Specification Guide → Authenticated Function
3. Add JWT verification
4. Use user.id for operations

### Creating an Admin-Only Function
1. Quick Reference → Authentication Patterns → Pattern 3
2. Specification Guide → Admin-Only Function
3. Verify JWT + check admin role
4. Use service role client for DB operations

### Adding Background Processing
1. Specification Guide → Background Processing
2. Use EdgeRuntime.waitUntil()
3. Return immediate response
4. Process in background

---

## 🚨 Important Notes

### Security
- **Never** hardcode secrets in code
- **Always** validate input
- **Always** verify signatures for webhooks
- Use environment variables for all secrets

### CORS
- **Always** include CORS headers in all responses
- **Always** handle OPTIONS preflight requests
- Use the standard corsHeaders object

### Error Handling
- **Always** wrap logic in try-catch
- Return meaningful error messages
- Use appropriate status codes
- Log errors but don't expose sensitive details

### Testing
- **Always** test locally before deploying
- Test all error paths
- Test authentication flow
- Verify CORS works

---

## 📞 Support

### Documentation Issues
- Update this documentation if you find errors
- Add examples as you create new patterns
- Share your learnings with the team

### Need Help?
1. Review existing functions: `../supabase/functions/`
2. Check Supabase docs: https://supabase.com/docs/guides/functions
3. Contact: asperpharma@gmail.com

---

## 🔄 Keep Documentation Updated

When you create a new function:
1. ✅ Document the specification
2. ✅ Add to Quick Reference if new pattern
3. ✅ Update this README if needed
4. ✅ Share learnings with team

---

## 📚 External Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Standard Library](https://deno.land/std)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [Project README](../README.md)

---

**Last Updated:** 2026-02-17

**Documentation maintained by:** Asper Beauty Shop Dev Team
