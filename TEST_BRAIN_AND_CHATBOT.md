# Test Brain & Beauty Assistant Chatbot

This guide provides comprehensive testing procedures for the Asper Beauty Shop AI-powered Beauty Assistant (the "Brain").

## 🎯 Overview

The Beauty Assistant is an AI chatbot powered by **Gemini 2.5 Flash** via the Lovable AI Gateway. It provides personalized skincare recommendations, answers beauty questions, and helps customers find the right products.

**Architecture:**
- **Frontend:** Beauty Assistant component in React (`src/components/BeautyAssistant.tsx`)
- **Backend:** Supabase Edge Function (`supabase/functions/beauty-assistant/`)
- **AI Model:** Gemini 2.5 Flash via Lovable AI Gateway (`ai.gateway.lovable.dev`)
- **Context:** 5000+ SKU product catalog from Shopify

---

## 🚀 Quick Test

Run the automated health check:

```bash
npm run test:brain
```

This runs `npm run health` which verifies:
- ✅ Main site is accessible
- ✅ Supabase Edge Functions are deployed
- ✅ Beauty Assistant function responds

---

## 🧪 Manual Testing Procedures

### 1. Visual Component Test

**Goal:** Verify the Beauty Assistant UI loads correctly.

**Steps:**
1. Open the site: https://asperbeautyshop-com.lovable.app/ (or https://www.asperbeautyshop.com)
2. Look for the Beauty Assistant chat widget (typically a floating button in bottom-right corner)
3. Click to open the chat interface
4. Verify:
   - Chat window opens smoothly
   - Welcome message appears
   - Input field is visible and active
   - Send button works

**Expected Result:**
- Widget is visible and clickable
- Chat interface loads without errors
- Welcome message appears (e.g., "Hello! I'm your Beauty Assistant. How can I help you today?")

---

### 2. Basic Conversation Test

**Goal:** Verify the AI responds to simple queries.

**Test Queries:**

| Query | Expected Response Type |
|-------|------------------------|
| "Hello" | Greeting + offer to help |
| "What products do you sell?" | Overview of product categories (skin care, hair care, makeup, etc.) |
| "Tell me about your skin care products" | Description of skin care offerings with examples |
| "Do you have organic products?" | Yes, with examples of organic/natural products |

**Steps:**
1. Open Beauty Assistant
2. Type each test query
3. Press Send or hit Enter
4. Wait for response (should be < 5 seconds)

**Expected Result:**
- Responses are relevant and accurate
- Tone is friendly and professional
- Product information matches actual catalog
- No error messages or "I don't know" responses

---

### 3. Product Recommendation Test

**Goal:** Verify the AI provides accurate product recommendations.

**Test Scenarios:**

#### Scenario A: Acne-Prone Skin
**Query:** "I have acne-prone skin. What do you recommend?"

**Expected Response:**
- Mentions acne-fighting ingredients (salicylic acid, benzoyl peroxide, niacinamide)
- Recommends specific products from catalog
- May ask follow-up questions (severity, skin type, current routine)

#### Scenario B: Dry Hair
**Query:** "My hair is very dry and damaged. What should I use?"

**Expected Response:**
- Mentions hydrating ingredients (argan oil, keratin, hyaluronic acid)
- Recommends hair masks, conditioners, or oils
- May suggest a hair care routine

#### Scenario C: Anti-Aging
**Query:** "I'm looking for anti-aging products for my face"

**Expected Response:**
- Mentions anti-aging ingredients (retinol, vitamin C, peptides, hyaluronic acid)
- Recommends serums, creams, or treatments
- May ask about specific concerns (wrinkles, dark spots, firmness)

**Steps:**
1. Open Beauty Assistant
2. Enter scenario query
3. Review response
4. If prompted with follow-up questions, answer naturally
5. Verify final recommendations

**Expected Result:**
- Recommendations are relevant to concern
- Products mentioned exist in catalog (verify in /products)
- Ingredient knowledge is accurate
- Recommendations match premium/luxury positioning

---

### 4. Product Knowledge Test

**Goal:** Verify the AI knows specific products in the catalog.

**Test Queries:**

| Query | Expected Behavior |
|-------|-------------------|
| "Do you have [specific brand]?" | Searches catalog, confirms if available |
| "Tell me about [product name]" | Provides details (benefits, ingredients, usage) |
| "What's the difference between [product A] and [product B]?" | Compares features/benefits |
| "Is [product] suitable for sensitive skin?" | Analyzes ingredients and provides guidance |

**Steps:**
1. Pick 3-5 actual products from https://asperbeautyshop-com.lovable.app/products
2. Note product names and brands
3. Ask Beauty Assistant about each one
4. Verify accuracy of responses

**Expected Result:**
- Correctly identifies products in catalog
- Provides accurate descriptions
- Acknowledges when a product is not available
- Doesn't hallucinate product details

---

### 5. Multilingual Test (English/Arabic)

**Goal:** Verify the Beauty Assistant works in both languages.

**Steps:**
1. Switch site language to Arabic (AR) in the header
2. Open Beauty Assistant
3. Type query in Arabic: "ما هي منتجات العناية بالبشرة التي لديكم؟"
   (Translation: "What skincare products do you have?")
4. Verify response is in Arabic
5. Switch back to English (EN)
6. Type query in English: "What hair care products do you recommend?"
7. Verify response is in English

**Expected Result:**
- Assistant detects language automatically
- Responds in the same language as the query
- Translations are natural and accurate
- RTL (right-to-left) layout works correctly for Arabic

---

### 6. Integration Test (Find My Ritual)

**Goal:** Verify the full customer journey from chat to cart.

**Scenario: Customer Journey**

**Steps:**
1. Open Beauty Assistant
2. Query: "I want a complete skincare routine for oily, acne-prone skin"
3. Answer any follow-up questions from AI
4. Review recommended products
5. Click on a recommended product (if links provided)
6. Add product to cart
7. Verify cart shows correct product

**Expected Result:**
- AI provides 3-5 product recommendations (cleanser, toner, serum, moisturizer, treatment)
- Products are clickable (deep links to product pages)
- Add to cart works from recommended products
- Cart total is correct

---

### 7. Error Handling Test

**Goal:** Verify the Assistant handles edge cases gracefully.

**Test Cases:**

| Test | Query | Expected Behavior |
|------|-------|-------------------|
| Empty message | Press Send with empty input | Shows error or does nothing |
| Very long message | Type 500+ character message | Accepts or truncates gracefully |
| Special characters | Type "I need $$ products!!!" | Handles special chars, responds normally |
| Unrelated query | "What's the weather?" | Politely redirects to beauty/product topics |
| Offensive language | Test with mild inappropriate term | Handles professionally, stays on topic |

**Steps:**
1. Test each case above
2. Observe behavior and response

**Expected Result:**
- No crashes or error pages
- Professional responses to all inputs
- Graceful handling of edge cases
- No exposed error messages or stack traces

---

### 8. Performance Test

**Goal:** Verify response times are acceptable.

**Steps:**
1. Open Beauty Assistant
2. Send 5 queries in sequence
3. Time each response

**Metrics:**
- **Target Response Time:** < 5 seconds per query
- **Acceptable:** 5-10 seconds
- **Slow:** > 10 seconds (investigate if consistent)

**Expected Result:**
- Most responses in < 5 seconds
- No timeout errors
- Conversation remains smooth and fluid

---

### 9. Concurrent User Test

**Goal:** Verify the Assistant works under load.

**Steps:**
1. Open site in 3-5 different browsers/tabs
2. Open Beauty Assistant in each
3. Send queries simultaneously
4. Verify all receive responses

**Expected Result:**
- All instances work independently
- No cross-contamination of conversations
- Responses arrive for all users
- No degradation in performance

---

### 10. Persistence Test

**Goal:** Verify chat history persists correctly.

**Steps:**
1. Open Beauty Assistant
2. Send 3-4 queries and receive responses
3. Close the chat widget (but stay on page)
4. Reopen the chat widget
5. Verify chat history is still visible

**Expected Result:**
- Previous messages remain visible
- Context is maintained
- Can continue conversation from where left off

---

## 🔍 Supabase Function Testing

### Direct Edge Function Test

**Goal:** Test the Beauty Assistant function directly via API.

**Using `curl`:**

```bash
curl -X POST https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What skincare products do you recommend for dry skin?",
    "conversationHistory": []
  }'
```

**Expected Response:**
```json
{
  "response": "For dry skin, I recommend...",
  "success": true
}
```

**Using Supabase Dashboard:**
1. Go to https://supabase.com/dashboard/project/rgehleqcubtmcwyipyvi
2. Navigate to **Edge Functions** → **beauty-assistant**
3. Check logs for recent invocations
4. Verify no errors in logs

**Expected Result:**
- Function invokes successfully
- Returns valid JSON response
- Logs show successful completion
- No 500 errors or timeouts

---

## 📊 Monitoring & Analytics

### Key Metrics to Monitor

After deployment, track these metrics:

| Metric | Target | Tool |
|--------|--------|------|
| Response Time | < 5 sec | Supabase Logs |
| Success Rate | > 95% | Supabase Logs |
| Error Rate | < 5% | Supabase Logs |
| Daily Usage | Track trend | Supabase Analytics |
| User Satisfaction | Qualitative | User feedback |

### Supabase Monitoring

**Steps:**
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/rgehleqcubtmcwyipyvi
2. Navigate to **Edge Functions** → **beauty-assistant**
3. Review:
   - Invocations (total count)
   - Response times (average, p95)
   - Error logs
   - CPU/memory usage

**Red Flags:**
- ❌ Error rate > 10%
- ❌ Average response time > 10 seconds
- ❌ Consistent timeouts
- ❌ 500 Internal Server Error responses

---

## 🐛 Troubleshooting

### Issue: Beauty Assistant widget not visible

**Possible Causes:**
- JavaScript error in console
- Component not imported in App.tsx
- CSS display issue

**Fix:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Verify `<BeautyAssistant />` in `src/App.tsx`
4. Check CSS styles in component

---

### Issue: "Failed to send message" error

**Possible Causes:**
- Supabase function not deployed
- Network error
- CORS issue
- Invalid API URL

**Fix:**
1. Verify Supabase function is deployed:
   ```bash
   supabase functions list
   ```
2. Check function logs in Supabase Dashboard
3. Verify `VITE_SUPABASE_URL` environment variable
4. Test function directly with curl (see above)

---

### Issue: AI gives irrelevant responses

**Possible Causes:**
- Prompt engineering needs improvement
- Product catalog not synced
- AI model temperature too high

**Fix:**
1. Review system prompt in `supabase/functions/beauty-assistant/index.ts`
2. Verify Shopify product feed is up to date
3. Adjust temperature parameter (lower = more focused)

---

### Issue: Slow response times (> 10 sec)

**Possible Causes:**
- AI Gateway latency
- Large product catalog
- Network throttling

**Fix:**
1. Check Lovable AI Gateway status
2. Optimize product context (reduce catalog size sent to AI)
3. Implement caching for common queries
4. Consider upgrading AI model or instance

---

## ✅ Checklist: Comprehensive Test Before Production

Run through this checklist before marking the Brain as production-ready:

- [ ] Visual component loads and displays correctly
- [ ] Welcome message appears on first open
- [ ] Can send and receive messages
- [ ] Responses are relevant and accurate (5+ test queries)
- [ ] Product recommendations match actual catalog
- [ ] Multilingual support works (EN/AR)
- [ ] Chat history persists when reopened
- [ ] Error handling is graceful (tested 3+ edge cases)
- [ ] Response times < 5 seconds (90% of queries)
- [ ] Direct API test via curl succeeds
- [ ] Supabase logs show no errors in last 24 hours
- [ ] Tested on desktop and mobile browsers
- [ ] CORS settings allow requests from production domain
- [ ] Environment variables set in Lovable project settings
- [ ] Monitored performance for at least 1 day post-deploy

---

## 📚 Related Documentation

- **APPLY_TO_MAIN_SITE.md** - Deployment checklist and instructions
- **DEPLOYMENT_GUIDE.md** - Full deployment guide
- **CONNECTION_STATUS.md** - Integration status and health
- **README.md** - Project overview and setup

---

## 🆘 Support

If tests fail or you encounter issues:

1. **Check Logs:** Supabase Dashboard → Edge Functions → beauty-assistant
2. **Run Health Check:** `npm run health` or `npm run test:brain`
3. **Review Environment:** Verify all `VITE_*` variables in Lovable settings
4. **Contact Support:** asperpharma@gmail.com

---

*Last updated: February 2026*
