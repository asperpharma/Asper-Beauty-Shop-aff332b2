# 🎯 Master Project Breakdown Framework

> **A structured approach to analyzing and planning business infrastructure for Asper Beauty Shop**

## Purpose

This framework provides a systematic method for breaking down raw business requirements into clear, actionable project plans. It ensures every component aligns with our brand values (trust, authenticity, premium pharmacy standard) and supports our strategic transition from a 5,000-product Shopify store into a broader SaaS ecosystem ("Project DNA").

---

## 📋 How to Use This Framework

1. **Gather raw notes** about a feature, module, or service you want to build
2. **Apply each section** of this framework to your notes
3. **Define clean data structures** for each phase (critical for large-scale operations)
4. **Review alignment** with brand identity and Project DNA goals
5. **Execute in phases** with clear success criteria

---

## 🏛️ Framework Structure

### 1. Core Identity & Service (Who We Are & What We Do)

**Purpose**: Define the specific component's role within Asper Beauty Shop ecosystem

**Questions to Answer**:
- What specific service or feature does this component provide?
- How does it embody our "premium pharmacy" standard for beauty and health?
- What trust and authenticity elements does it incorporate?
- Who is the target user/customer for this component?

**Template**:
```markdown
## Core Identity & Service

**Component Name**: [Name of feature/module/service]

**Core Service Definition**: 
[2-3 sentence description of what this component does]

**Brand Alignment**:
- **Trust**: [How this component builds user trust]
- **Authenticity**: [How this component maintains authenticity]
- **Premium Standard**: [How this component reflects premium quality]

**Target Audience**: 
[Specific user segment this serves]

**Key Value Proposition**: 
[Primary benefit users gain from this component]
```

---

### 2. Strategic Purpose (Why We Are Building This)

**Purpose**: Explain the exact reason for building this component and its role in Project DNA

**Questions to Answer**:
- Why is this component necessary now?
- How does it fit into our transition from Shopify store to SaaS ecosystem?
- What business problem does it solve?
- What competitive advantage does it provide?
- How does it support our 5,000+ product catalog management?

**Template**:
```markdown
## Strategic Purpose

**Business Problem**: 
[Specific challenge or gap this component addresses]

**Project DNA Alignment**: 
[How this fits into the broader SaaS ecosystem transition]
- Current State: [What we have now]
- Desired State: [What this component enables]
- Strategic Value: [Long-term benefit]

**Success Metrics**:
- [Metric 1]: [Target/KPI]
- [Metric 2]: [Target/KPI]
- [Metric 3]: [Target/KPI]

**Timeline Rationale**: 
[Why this component should be built now vs. later]

**Dependencies**: 
[What must exist before this can be built]
```

---

### 3. Tech Stack & Corporate Tools

**Purpose**: Identify all tools, platforms, and integrations required for this component

**Questions to Answer**:
- What existing tools does this integrate with?
- What new tools or services are required?
- How will data flow between systems?
- What APIs or SDKs are needed?
- What authentication/security mechanisms are required?

**Template**:
```markdown
## Tech Stack & Corporate Tools

### Primary Technologies
- **Frontend**: [Technologies used]
- **Backend**: [Technologies used]
- **Database**: [Data storage solution]
- **APIs**: [External APIs consumed/exposed]

### Existing Integrations
1. **Shopify Storefront API** (v2025-07)
   - Purpose: [How this component uses Shopify]
   - Data Flow: [Direction of data movement]
   - Authentication: [How auth is handled]

2. **Supabase** (Project: rgehleqcubtmcwyipyvi)
   - Purpose: [How this component uses Supabase]
   - Services Used: [Auth/Functions/Database/Storage]
   - Data Flow: [Direction of data movement]

3. **[Other Integration]**
   - Purpose: [Why needed]
   - Data Flow: [How data moves]
   - Authentication: [Security approach]

### New Tools/Services Required
- **Tool Name**: [Purpose, license, cost implications]

### System Communication Diagram
```
[Component A] → [API/Protocol] → [Component B]
     ↓
[Data Store]
     ↓
[Component C]
```

### Security Considerations
- Authentication: [Method]
- Authorization: [Access control approach]
- Data Encryption: [At rest and in transit]
- API Rate Limiting: [Protection measures]
```

---

### 4. Phased Breakdown & Clean Data Structures

**Purpose**: Break execution into logical stages with explicit data requirements

**Questions to Answer**:
- What are the sequential stages of building this?
- What data needs to be collected, mapped, or migrated in each phase?
- What are the schema/structure requirements?
- How do we validate data quality?
- What are the success criteria for each phase?

**Template**:
```markdown
## Phased Breakdown & Clean Data Structures

### Phase 1: [Phase Name - e.g., "Data Discovery & Schema Definition"]

**Objective**: [Clear goal for this phase]

**Timeline**: [Duration estimate]

**Tasks**:
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

**Clean Data Structure Required**:

#### Data Point 1: [e.g., Product Catalog]
```json
{
  "entity": "Product",
  "source": "Shopify Storefront API",
  "required_fields": [
    {
      "field": "id",
      "type": "string",
      "example": "gid://shopify/Product/1234567890",
      "required": true,
      "validation": "Must be valid Shopify GID"
    },
    {
      "field": "title",
      "type": "string",
      "example": "Organic Rose Water Toner",
      "required": true,
      "validation": "1-255 characters"
    },
    {
      "field": "variants",
      "type": "array",
      "required": true,
      "validation": "Minimum 1 variant"
    }
  ],
  "optional_fields": [
    {
      "field": "descriptionHtml",
      "type": "string",
      "example": "<p>Premium rose water...</p>"
    }
  ],
  "mapping_rules": {
    "category": "Derived from productType and tags",
    "translations": "Use translateTitle() from productUtils.ts"
  }
}
```

#### Data Point 2: [e.g., User Profiles]
```json
{
  "entity": "UserProfile",
  "source": "Supabase Auth + Custom Tables",
  "schema": {
    "id": "uuid PRIMARY KEY",
    "email": "text UNIQUE NOT NULL",
    "full_name": "text",
    "phone": "text",
    "preferences": "jsonb",
    "created_at": "timestamptz DEFAULT now()",
    "updated_at": "timestamptz DEFAULT now()"
  },
  "row_level_security": true,
  "policies": [
    "Users can only read/update their own profile",
    "Admin users can read all profiles"
  ]
}
```

**Data Migration Steps**:
1. Export existing data from [source]
2. Transform to new schema format
3. Validate data quality (completeness, accuracy)
4. Load into [target system]
5. Verify data integrity

**Validation Criteria**:
- [ ] 100% of required fields populated
- [ ] Data types match schema
- [ ] Foreign key relationships intact
- [ ] No duplicate records
- [ ] Performance benchmarks met

**Success Criteria**:
- [ ] All data structures defined and documented
- [ ] Schema approved by technical lead
- [ ] Sample data validated

**Blockers/Risks**: [Potential issues that could delay this phase]

---

### Phase 2: [Phase Name - e.g., "Core Feature Development"]

**Objective**: [Clear goal for this phase]

**Timeline**: [Duration estimate]

**Tasks**:
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

**Clean Data Structure Required**:

#### Data Point 3: [e.g., API Request/Response]
```typescript
// Request Schema
interface ComponentRequest {
  userId: string;
  action: 'create' | 'update' | 'delete';
  payload: {
    // Specific fields
  };
  metadata?: {
    timestamp: string;
    source: string;
  };
}

// Response Schema
interface ComponentResponse {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    timestamp: string;
    requestId: string;
  };
}
```

**Integration Points**:
- Connect to [System A] via [method]
- Sync data with [System B] via [method]
- Cache layer: [Strategy]

**Success Criteria**:
- [ ] Core functionality implemented
- [ ] All integrations tested
- [ ] Data flow validated

---

### Phase 3: [Phase Name - e.g., "Quality Assurance & Testing"]

**Objective**: [Clear goal for this phase]

**Timeline**: [Duration estimate]

**Tasks**:
- [ ] Unit tests for [components]
- [ ] Integration tests for [workflows]
- [ ] Performance testing
- [ ] Security audit
- [ ] Accessibility review

**Data Requirements**:
- Test data sets (realistic product catalog samples)
- User personas for testing
- Load testing scenarios

**Success Criteria**:
- [ ] 90%+ test coverage
- [ ] All critical paths tested
- [ ] Performance within acceptable limits
- [ ] Security vulnerabilities addressed
- [ ] Accessibility standards met (WCAG 2.1 AA)

---

### Phase 4: [Phase Name - e.g., "Deployment & Monitoring"]

**Objective**: [Clear goal for this phase]

**Timeline**: [Duration estimate]

**Tasks**:
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] Documentation finalization
- [ ] Training materials

**Clean Data Structure Required**:

#### Monitoring & Analytics Data
```json
{
  "metrics": {
    "performance": {
      "response_time_ms": "number",
      "throughput_rps": "number",
      "error_rate_percent": "number"
    },
    "business": {
      "conversion_rate": "number",
      "user_engagement_score": "number",
      "feature_adoption_percent": "number"
    }
  },
  "logging": {
    "level": "info|warn|error",
    "message": "string",
    "context": "object",
    "timestamp": "ISO8601"
  }
}
```

**Success Criteria**:
- [ ] Zero-downtime deployment
- [ ] Monitoring dashboards active
- [ ] Rollback plan tested
- [ ] Documentation complete

---
```

---

## 🎯 Example Application: AI Beauty Assistant Enhancement

Let's apply this framework to a real example:

### 1. Core Identity & Service

**Component Name**: AI Beauty Assistant with Product Recommendations

**Core Service Definition**: 
An intelligent chatbot that provides personalized skincare advice and product recommendations from our 5,000+ product catalog, powered by Gemini 2.5 Flash. It understands customer skin concerns, preferences, and budget to deliver curated product suggestions with scientific rationale.

**Brand Alignment**:
- **Trust**: Uses verified product data, provides scientific explanations, never pushes sales without genuine value
- **Authenticity**: Transparent about AI nature, cites product ingredients, honest about limitations
- **Premium Standard**: Sophisticated natural language understanding, personalized consultations, professional skincare knowledge

**Target Audience**: 
Beauty-conscious customers (25-45 years old) seeking expert guidance on organic/natural skincare products

**Key Value Proposition**: 
Expert beauty consultation available 24/7, eliminating the need to search through thousands of products manually

---

### 2. Strategic Purpose

**Business Problem**: 
Customers feel overwhelmed by 5,000+ products and struggle to find items matching their specific skin concerns. This leads to high bounce rates and abandoned sessions.

**Project DNA Alignment**: 
- Current State: Basic AI assistant with generic beauty advice
- Desired State: Intelligent recommendation engine integrated with inventory
- Strategic Value: Foundation for future SaaS "Beauty Advisor" module that other retailers can license

**Success Metrics**:
- Conversion Rate: Increase by 15% for assistant-recommended products
- Session Duration: Increase by 3 minutes when assistant is used
- Product Discovery: 30% of customers find products they wouldn't have discovered otherwise

**Timeline Rationale**: 
Build now because AI infrastructure exists; recommendation engine becomes proprietary SaaS asset for Q3 licensing.

**Dependencies**: 
- Shopify API access (✓ exists)
- Supabase functions (✓ exists)  
- Product categorization system (✓ exists)
- User preference tracking (needs to be built)

---

### 3. Tech Stack & Corporate Tools

**Primary Technologies**:
- **Frontend**: React 18 + TypeScript, real-time streaming UI
- **Backend**: Supabase Edge Functions (Deno runtime)
- **AI Model**: Gemini 2.5 Flash via Lovable AI Gateway
- **Database**: Supabase PostgreSQL for conversation history
- **APIs**: Shopify Storefront API for product data

**Existing Integrations**:

1. **Shopify Storefront API** (v2025-07)
   - Purpose: Fetch real-time product data, prices, availability
   - Data Flow: Read-only queries for product recommendations
   - Authentication: Public storefront token

2. **Supabase** (Project: rgehleqcubtmcwyipyvi)
   - Purpose: Store conversation history, user preferences, recommendation analytics
   - Services Used: Auth (user identification), Functions (AI proxy), Database (history)
   - Data Flow: Bidirectional (save conversations, load user context)

3. **Lovable AI Gateway** (ai.gateway.lovable.dev)
   - Purpose: Proxy for Gemini 2.5 Flash with streaming support
   - Data Flow: POST request with conversation context → streaming response
   - Authentication: Bearer token from Supabase session

**New Tools/Services Required**:
- **Vector Database** (e.g., Pinecone or Supabase pgvector): For semantic product search ($0-70/month)
- **Analytics Platform** (e.g., Mixpanel): Track recommendation performance (free tier initially)

**System Communication Diagram**:
```
[User in BeautyAssistant.tsx] 
        ↓ (Question + context)
[Supabase Function: beauty-assistant]
        ↓ (Enrich with product data)
[Shopify API: fetchProducts()]
        ↓ (Products matching query)
[Lovable AI Gateway: Gemini 2.5 Flash]
        ↓ (Stream recommendations)
[BeautyAssistant.tsx: Display results]
        ↓ (Save to database)
[Supabase: conversation_history table]
```

**Security Considerations**:
- Authentication: JWT token validation for logged-in users; anonymous users get rate-limited sessions
- Authorization: RLS policies ensure users only access their own conversation history
- Data Encryption: All API calls over HTTPS; sensitive user data encrypted at rest
- API Rate Limiting: 10 messages per minute per user; 100 messages per day for anonymous

---

### 4. Phased Breakdown & Clean Data Structures

#### Phase 1: Enhanced Context & Product Integration (Weeks 1-2)

**Objective**: Enable AI to access and recommend products from catalog

**Clean Data Structure Required**:

**Product Search Index**:
```json
{
  "entity": "ProductSearchIndex",
  "source": "Shopify + Custom Processing",
  "structure": {
    "product_id": "string (Shopify GID)",
    "title": "string",
    "title_ar": "string (Arabic translation)",
    "category": "string (skin-care|hair-care|make-up|body-care|fragrances|tools-devices)",
    "subcategory": "string",
    "keywords": ["string"],
    "keywords_ar": ["string"],
    "ingredients": ["string"],
    "skin_concerns": ["acne", "aging", "dryness", "sensitivity", "pigmentation"],
    "suitable_for": ["oily", "dry", "combination", "sensitive", "normal"],
    "price_jod": "number",
    "availability": "boolean",
    "vector_embedding": "float[1536]",
    "last_updated": "timestamp"
  },
  "indexes": {
    "category_availability": "btree (category, availability)",
    "skin_concerns_gin": "gin (skin_concerns)",
    "vector_ivfflat": "ivfflat (vector_embedding)"
  }
}
```

**Conversation Context**:
```typescript
interface ConversationContext {
  userId: string | null; // null for anonymous
  sessionId: string; // unique per conversation
  messages: Message[];
  userPreferences?: {
    skinType?: 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal';
    concerns?: string[];
    budget?: 'under-30' | '30-50' | '50-100' | 'over-100';
    language?: 'en' | 'ar';
  };
  recommendedProducts: string[]; // product IDs
  createdAt: string;
  updatedAt: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    productIds?: string[];
    recommendationType?: 'direct' | 'alternative' | 'complementary';
  };
}
```

**Migration Steps**:
1. Build product indexing script to extract keywords and concerns from existing catalog
2. Generate vector embeddings for all 5,000 products (batch process)
3. Store in Supabase with appropriate indexes
4. Create API endpoint for semantic product search

**Success Criteria**:
- [ ] All 5,000 products indexed with keywords
- [ ] Semantic search returns relevant results in <500ms
- [ ] AI can reference specific products in responses

---

#### Phase 2: Recommendation Engine Logic (Weeks 3-4)

**Objective**: Implement smart recommendation logic with multiple strategies

**Clean Data Structure Required**:

**Recommendation Rules**:
```json
{
  "rule_id": "string",
  "name": "string",
  "type": "collaborative|content-based|hybrid|trending",
  "conditions": {
    "skin_type": ["string"],
    "concerns": ["string"],
    "price_range": "string",
    "exclude_ingredients": ["string"]
  },
  "scoring_weights": {
    "ingredient_match": 0.3,
    "price_fit": 0.2,
    "popularity": 0.2,
    "semantic_similarity": 0.3
  },
  "max_results": 5,
  "enabled": true
}
```

**Recommendation Tracking**:
```sql
CREATE TABLE recommendation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  session_id text NOT NULL,
  conversation_id uuid REFERENCES conversations(id),
  product_id text NOT NULL,
  recommendation_type text, -- 'direct', 'alternative', 'complementary'
  confidence_score numeric(3,2), -- 0.00 to 1.00
  user_action text, -- 'viewed', 'clicked', 'added_to_cart', 'purchased', 'ignored'
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_rec_events_user_action ON recommendation_events(user_id, user_action);
CREATE INDEX idx_rec_events_product ON recommendation_events(product_id, user_action);
```

**Success Criteria**:
- [ ] Recommendation engine returns results in <1 second
- [ ] At least 3 recommendation strategies implemented
- [ ] A/B testing framework ready for comparing strategies

---

#### Phase 3: Conversation History & Personalization (Week 5)

**Objective**: Remember user preferences and past interactions

**Clean Data Structure Required**:

**User Preferences Schema**:
```sql
CREATE TABLE user_beauty_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  skin_type text CHECK (skin_type IN ('oily', 'dry', 'combination', 'sensitive', 'normal')),
  primary_concerns text[], -- array of concerns
  allergies text[], -- ingredients to avoid
  budget_preference text CHECK (budget_preference IN ('under-30', '30-50', '50-100', 'over-100')),
  favorite_brands text[],
  purchased_products text[], -- product IDs
  browsed_products text[], -- recently viewed
  preferred_language text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE user_beauty_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_beauty_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_beauty_profiles FOR UPDATE
  USING (auth.uid() = user_id);
```

**Conversation History Schema**:
```sql
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id), -- nullable for anonymous
  session_id text UNIQUE NOT NULL,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  context jsonb, -- user preferences snapshot
  summary text, -- AI-generated summary
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_session ON conversations(session_id);
```

**Success Criteria**:
- [ ] Returning users see personalized greetings
- [ ] AI references past interactions appropriately
- [ ] Conversation history persists across sessions

---

#### Phase 4: Analytics & Optimization (Week 6)

**Objective**: Measure performance and optimize recommendations

**Clean Data Structure Required**:

**Analytics Dashboard Data**:
```json
{
  "metrics": {
    "engagement": {
      "total_conversations": "number",
      "avg_messages_per_conversation": "number",
      "completion_rate": "number (0-1)",
      "bounce_rate": "number (0-1)"
    },
    "recommendations": {
      "total_recommended": "number",
      "view_rate": "number (0-1)",
      "click_through_rate": "number (0-1)",
      "add_to_cart_rate": "number (0-1)",
      "conversion_rate": "number (0-1)"
    },
    "revenue": {
      "attributed_revenue_jod": "number",
      "avg_order_value_jod": "number",
      "roi": "number"
    }
  },
  "time_range": {
    "start": "ISO8601",
    "end": "ISO8601"
  }
}
```

**A/B Test Configuration**:
```typescript
interface ABTestConfig {
  testId: string;
  name: string;
  variants: {
    control: {
      recommendationStrategy: string;
      maxProducts: number;
      confidenceThreshold: number;
    };
    variant: {
      recommendationStrategy: string;
      maxProducts: number;
      confidenceThreshold: number;
    };
  };
  trafficSplit: {
    control: number; // 0-100
    variant: number; // 0-100
  };
  startDate: string;
  endDate: string;
  successMetric: 'ctr' | 'conversion' | 'revenue';
}
```

**Success Criteria**:
- [ ] Real-time analytics dashboard operational
- [ ] A/B testing framework validates recommendation improvements
- [ ] Recommendation accuracy improves by 10% based on user feedback

---

## 📚 Best Practices

### Data Quality Standards
1. **Completeness**: All required fields must be populated
2. **Accuracy**: Data must reflect current state (real-time sync where possible)
3. **Consistency**: Use standardized formats (ISO dates, currency codes, etc.)
4. **Uniqueness**: Enforce unique constraints where appropriate
5. **Referential Integrity**: All foreign keys must reference valid records

### Documentation Requirements
- Every data structure must have inline comments explaining purpose
- Complex transformations need step-by-step documentation
- API contracts must be versioned (e.g., `/v1/`, `/v2/`)
- Database schema changes must include migration scripts

### Security Checklist
- [ ] Row-Level Security (RLS) enabled for all user-specific data
- [ ] API endpoints validate input to prevent injection attacks
- [ ] Sensitive fields encrypted at rest
- [ ] Audit logs for data modifications
- [ ] Rate limiting on public endpoints

### Performance Optimization
- [ ] Database indexes on frequently queried fields
- [ ] Caching layer for expensive operations
- [ ] Lazy loading for large datasets
- [ ] Pagination for list endpoints (max 100 items per page)
- [ ] Image optimization (WebP format, lazy loading)

---

## 🔄 Continuous Improvement

After completing each phase:

1. **Retrospective Meeting**
   - What went well?
   - What could be improved?
   - Were data structures adequate?
   - Were estimates accurate?

2. **Data Quality Review**
   - Run validation queries
   - Check for orphaned records
   - Verify performance benchmarks

3. **Documentation Update**
   - Update this framework with lessons learned
   - Add common pitfalls to avoid
   - Improve templates based on real usage

4. **Stakeholder Feedback**
   - Demo to users/customers
   - Collect feedback on usability
   - Measure against success metrics

---

## 🎯 Why This Framework Works for Asper Beauty Shop

1. **Anchors AI Agents**: By explicitly defining brand values and Project DNA context, AI tools like GitHub Copilot provide more relevant suggestions

2. **Forces Clean Data**: Large-scale operations (5,000+ products) require precise data structures—this framework makes them explicit

3. **Scales to SaaS**: The phased approach and data structure documentation prepares components for extraction into standalone SaaS modules

4. **Maintains Quality**: Clear success criteria and validation steps ensure premium standard is maintained

5. **Reduces Risk**: Explicit dependencies and data requirements surface blockers early

6. **Enables Collaboration**: Structured format makes it easy for team members to contribute and understand

---

## 📞 Support & Questions

For questions about applying this framework:
- **Email**: asperpharma@gmail.com
- **Documentation**: [GitHub Repository](https://github.com/asperpharma/Asper-Beauty-Shop)

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-25  
**Maintained By**: Asper Pharma Technical Team
