# 📝 Quick Start: Using the Project Breakdown Framework

> **5-Minute Guide to Applying the Master Project Breakdown Framework**

---

## When to Use This Framework

Use the [Project Breakdown Framework](PROJECT_BREAKDOWN_FRAMEWORK.md) when you need to:
- ✅ Plan a new feature or module
- ✅ Analyze raw business requirements
- ✅ Create technical specifications
- ✅ Prepare a component for SaaS extraction
- ✅ Align stakeholders on project scope
- ✅ Define data structures for large-scale systems

---

## The 4-Step Process

### Step 1: Gather Your Information (5-10 minutes)

Collect raw notes, requirements, or ideas about what you want to build. This can be:
- Stakeholder meeting notes
- Customer feedback
- Feature requests
- Business requirements document
- Competitor analysis
- Technical constraints

**Example**:
```
"We need a feature where customers can save their favorite products 
and get notified when they go on sale. Should work on mobile too. 
Users are complaining they lose track of products they're interested in."
```

---

### Step 2: Apply the Framework (30-60 minutes)

Open [PROJECT_BREAKDOWN_FRAMEWORK.md](PROJECT_BREAKDOWN_FRAMEWORK.md) and work through each section:

#### 2.1 Core Identity & Service
**Question**: What exactly does this component do?

**Your Answer**: 
```markdown
## Core Identity & Service

**Component Name**: Wishlist with Price Alerts

**Core Service Definition**: 
A personalized wishlist that allows customers to save products of interest 
and receive notifications when prices drop or items go on sale.

**Brand Alignment**:
- **Trust**: Never spammy—users control notification preferences
- **Authenticity**: Real-time price tracking, accurate availability status
- **Premium Standard**: Beautiful UI, instant sync across devices

**Target Audience**: 
Budget-conscious beauty enthusiasts who research before purchasing

**Key Value Proposition**: 
Never miss a deal on your favorite products
```

#### 2.2 Strategic Purpose
**Question**: Why build this now? How does it fit Project DNA?

**Your Answer**:
```markdown
## Strategic Purpose

**Business Problem**: 
60% of browsing sessions end without purchase; customers abandon because 
they want to "think about it" but forget to return.

**Project DNA Alignment**: 
- Current State: Basic wishlist (localStorage only, no sync)
- Desired State: Cloud-synced wishlist with smart notifications
- Strategic Value: Foundation for personalized marketing automation module (SaaS)

**Success Metrics**:
- Return Visit Rate: Increase by 25% within 3 months
- Wishlist-to-Purchase Conversion: Target 15%
- Notification Open Rate: Target 40%

**Timeline Rationale**: 
Build now to capture holiday shopping season (Oct-Dec 2026)

**Dependencies**: 
- Supabase database (✓ exists)
- User authentication (✓ exists)
- Email notification service (needs to be added)
```

#### 2.3 Tech Stack & Corporate Tools
**Question**: What technologies and integrations are needed?

**Your Answer**:
```markdown
## Tech Stack & Corporate Tools

### Primary Technologies
- **Frontend**: React (wishlist UI), Zustand (state management)
- **Backend**: Supabase (PostgreSQL database, Edge Functions for notifications)
- **Notifications**: SendGrid or Supabase email (to be decided)

### Existing Integrations
1. **Shopify Storefront API**
   - Purpose: Get real-time product prices for comparison
   - Data Flow: Polling every 4 hours for price changes
   
2. **Supabase**
   - Purpose: Store wishlist items, user preferences, notification history
   - Services Used: Database, Auth, Functions (for scheduled price checks)

### New Tools Required
- **Email Service** (SendGrid recommended): $15/month for 40K emails
- **Cron Job Service** (if Supabase doesn't support): Consider Cloudflare Workers

### Communication Diagram
```
[User adds product] → [wishlistStore + Supabase DB]
                            ↓
        [Cron: Every 4 hours] → [Check prices via Shopify API]
                            ↓
            [Price dropped?] → [Trigger email via SendGrid]
                            ↓
                        [User inbox]
```
```

#### 2.4 Phased Breakdown with Data Structures
**Question**: What are the phases and what data do we need?

**Your Answer**:
```markdown
## Phased Breakdown & Clean Data Structures

### Phase 1: Database Schema & Basic Sync (Week 1)

**Objective**: Replace localStorage wishlist with cloud-synced version

**Clean Data Structure Required**:

```sql
CREATE TABLE wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL, -- Shopify product ID
  variant_id text, -- Specific variant if chosen
  title text NOT NULL,
  price_jod numeric(10,2) NOT NULL,
  image_url text,
  added_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id, variant_id)
);

CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);

-- RLS Policies
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own wishlist"
  ON wishlist_items FOR ALL
  USING (auth.uid() = user_id);
```

**Migration Steps**:
1. Create table in Supabase
2. Update wishlistStore to sync with database
3. Migrate existing localStorage data to cloud (one-time)

**Success Criteria**:
- [ ] Wishlist persists across devices
- [ ] Adding/removing items updates instantly
- [ ] Migration script tested with sample users

---

### Phase 2: Price Tracking (Week 2)

**Objective**: Monitor price changes and log history

**Clean Data Structure Required**:

```sql
CREATE TABLE price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  price_jod numeric(10,2) NOT NULL,
  checked_at timestamptz DEFAULT now()
);

CREATE INDEX idx_price_product_time ON price_history(product_id, checked_at DESC);

CREATE TABLE price_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  product_id text NOT NULL,
  target_price_jod numeric(10,2), -- alert if price <= this
  last_notified_at timestamptz,
  is_active boolean DEFAULT true
);
```

**Supabase Function** (price-checker):
```typescript
export async function checkPrices() {
  // Get all unique product IDs from active wishlists
  const products = await getWishlistedProducts();
  
  for (const product of products) {
    // Fetch current price from Shopify
    const currentPrice = await fetchPriceFromShopify(product.id);
    
    // Save to price history
    await savePriceHistory(product.id, currentPrice);
    
    // Check if any users should be notified
    const alerts = await getActiveAlerts(product.id, currentPrice);
    
    for (const alert of alerts) {
      await sendPriceDropEmail(alert.user_id, product, currentPrice);
    }
  }
}
```

**Success Criteria**:
- [ ] Price checks run every 4 hours
- [ ] Price history logged correctly
- [ ] Alerts triggered when thresholds met

---

### Phase 3: Email Notifications (Week 3)

**Objective**: Send beautiful emails when prices drop

**Clean Data Structure Required**:

```typescript
interface PriceDropEmail {
  to: string; // user email
  subject: string;
  template_id: 'price-drop-alert';
  data: {
    user_name: string;
    product_title: string;
    old_price: number;
    new_price: number;
    discount_percent: number;
    product_url: string;
    product_image: string;
    cta_text: string; // "Shop Now"
  };
  metadata: {
    user_id: string;
    product_id: string;
    alert_id: string;
  };
}
```

**SendGrid Integration**:
- Create email template in SendGrid dashboard
- Store API key in Supabase secrets
- Use SendGrid Node.js library in Edge Function

**Success Criteria**:
- [ ] Emails delivered within 5 minutes of price drop
- [ ] Emails render correctly on mobile and desktop
- [ ] Unsubscribe link works
- [ ] Click tracking enabled

---

### Phase 4: User Settings & Polish (Week 4)

**Objective**: Give users control over notifications

**Clean Data Structure Required**:

```sql
CREATE TABLE notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  email_enabled boolean DEFAULT true,
  frequency text DEFAULT 'immediate', -- 'immediate', 'daily', 'weekly'
  min_discount_percent numeric(3,0) DEFAULT 10, -- only notify if >= 10% off
  quiet_hours jsonb DEFAULT '{"start": "22:00", "end": "08:00"}',
  updated_at timestamptz DEFAULT now()
);
```

**UI Component**:
- Settings page: /account/notifications
- Toggle switches for email/push
- Slider for minimum discount %
- Time picker for quiet hours

**Success Criteria**:
- [ ] Users can enable/disable notifications
- [ ] Settings persist correctly
- [ ] Notifications respect preferences
```

---

### Step 3: Review & Refine (15 minutes)

Once you've filled out the framework:

1. **Alignment Check**
   - [ ] Does this match our brand values?
   - [ ] Does it support Project DNA goals?
   - [ ] Are data structures comprehensive?

2. **Feasibility Check**
   - [ ] Do we have the required technical skills?
   - [ ] Is the timeline realistic?
   - [ ] Are dependencies available?

3. **Stakeholder Review**
   - Share with team members
   - Get feedback on priorities
   - Adjust phases if needed

---

### Step 4: Execute & Iterate (Ongoing)

1. **Start Phase 1**
   - Create tasks in project management tool
   - Assign to developers
   - Set up monitoring

2. **Track Progress**
   - Daily standups to discuss blockers
   - Weekly retrospectives to improve
   - Update framework document with learnings

3. **Measure Success**
   - Monitor metrics defined in Strategic Purpose
   - A/B test when appropriate
   - Collect user feedback

4. **Prepare for Next Phase**
   - Review what worked/didn't in current phase
   - Adjust timeline if needed
   - Update data structures based on real usage

---

## 🎯 Common Pitfalls to Avoid

### ❌ Don't: Jump straight to coding
**Why**: You'll miss critical data requirements and build the wrong thing

**Instead**: Spend 1 hour planning with the framework before writing any code

---

### ❌ Don't: Vague data structures
**Bad Example**: "We'll need a table for users and products"

**Good Example**: 
```sql
CREATE TABLE wishlist_items (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  product_id text NOT NULL,
  -- ...full schema with constraints
);
```

---

### ❌ Don't: Ignore Project DNA alignment
**Why**: Features not aligned with SaaS strategy become technical debt

**Instead**: Always answer "How does this become a licensable module?"

---

### ❌ Don't: Forget security from the start
**Why**: Retrofitting security is expensive and risky

**Instead**: Define RLS policies, authentication, and rate limiting in Phase 1

---

### ❌ Don't: Skip success metrics
**Why**: You won't know if the feature actually worked

**Instead**: Define 3-5 measurable KPIs upfront and track them

---

## 📊 Templates for Common Scenarios

### Scenario 1: Adding a New Shopify Integration
- **Framework Section**: Tech Stack & Corporate Tools
- **Key Questions**: What Shopify API endpoints? What data syncs? How often?
- **Data Structure Focus**: Product mappings, webhook payloads, sync logs

### Scenario 2: Building a New Customer-Facing Page
- **Framework Section**: Core Identity & Service + Phased Breakdown
- **Key Questions**: What's the user journey? What data displays? What actions?
- **Data Structure Focus**: Page content schema, user interaction events, analytics

### Scenario 3: Creating a Background Job/Service
- **Framework Section**: Strategic Purpose + Tech Stack
- **Key Questions**: What triggers it? How often? What does it process?
- **Data Structure Focus**: Job queue schema, processing logs, error handling

### Scenario 4: Extracting Feature to SaaS Module
- **Framework Section**: All four sections
- **Key Questions**: What's configurable per tenant? What's shared? How to bill?
- **Data Structure Focus**: Tenant configuration, usage metrics, billing events

---

## 🎓 Learning Resources

### To Master the Framework
1. Read [PROJECT_BREAKDOWN_FRAMEWORK.md](PROJECT_BREAKDOWN_FRAMEWORK.md) fully (30 min)
2. Review the AI Beauty Assistant example (included in framework)
3. Apply to a small feature first (wishlist, search, etc.)
4. Get feedback from team
5. Refine your approach

### To Understand Project DNA
1. Read [PROJECT_DNA_STRATEGY.md](PROJECT_DNA_STRATEGY.md) (20 min)
2. Understand the SaaS transformation vision
3. Review the multi-tenant architecture diagrams
4. Study the component extraction checklist

### To Learn Data Modeling
1. [Supabase Docs: Database Design](https://supabase.com/docs/guides/database)
2. [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don't_Do_This)
3. Review existing schemas in Asper codebase (`supabase/migrations/`)

---

## 🆘 Need Help?

### If you're stuck on a section:
1. Look at the example in the framework (AI Beauty Assistant)
2. Review similar features in the codebase
3. Ask a team member for a second opinion
4. Start with a simplified version and iterate

### If the framework feels overwhelming:
- Start with just Section 1 (Core Identity) and Section 4 (Phased Breakdown)
- Add Sections 2 and 3 as you go
- The framework is a guide, not a rigid requirement

### If you need technical guidance:
- **Email**: asperpharma@gmail.com
- **Documentation**: [GitHub Repository](https://github.com/asperpharma/Asper-Beauty-Shop)
- **Architecture Questions**: See [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)

---

## ✅ Checklist: Did You Complete the Framework?

Before starting development, verify:
- [ ] Core Identity section filled out (defines what you're building)
- [ ] Strategic Purpose section filled out (explains why and how it fits Project DNA)
- [ ] Tech Stack section filled out (lists all tools and integrations)
- [ ] At least 3 phases defined with clear objectives
- [ ] Each phase has detailed data structures (database schemas, API contracts, etc.)
- [ ] Success criteria defined for each phase
- [ ] Timeline estimates are realistic
- [ ] Dependencies identified and verified
- [ ] Security considerations addressed
- [ ] Team has reviewed and approved

---

**Ready to build? Go execute your plan! 🚀**

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-25  
**Maintained By**: Asper Pharma Technical Team
