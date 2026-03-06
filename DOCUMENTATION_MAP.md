# 📖 Documentation Map

> **Navigate the Asper Beauty Shop documentation ecosystem**

---

## 🗺️ How Documents Connect

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    START HERE: README.md                        │
│             Quick overview of the entire project                │
│                                                                 │
└───────────────────────┬─────────────────────────────────────────┘
                        │
        ┌───────────────┴────────────────┐
        │                                │
        ▼                                ▼
┌──────────────────┐          ┌──────────────────────┐
│  STRATEGIC       │          │  TECHNICAL           │
│  PLANNING DOCS   │          │  DOCUMENTATION       │
└──────────────────┘          └──────────────────────┘
        │                                │
        ├─────────────────┐             ├────────────────────┐
        │                 │             │                    │
        ▼                 ▼             ▼                    ▼
┌─────────────┐   ┌─────────────┐   ┌──────────┐   ┌──────────────┐
│ PROJECT DNA │   │  FRAMEWORK  │   │ ARCH     │   │ DEPLOYMENT   │
│ STRATEGY    │   │ & QUICK     │   │ DIAGRAM  │   │ GUIDE        │
│             │   │ START       │   │          │   │              │
│ The Vision  │   │ How to Plan │   │ How it   │   │ How to       │
│ & Roadmap   │   │ Features    │   │ Works    │   │ Deploy       │
└─────────────┘   └─────────────┘   └──────────┘   └──────────────┘
        │                 │                    │            │
        └─────────┬───────┴──────────┬─────────┴────────────┘
                  │                  │
                  ▼                  ▼
        ┌──────────────────┐   ┌────────────────┐
        │  SPECIALIZED     │   │  INTEGRATION   │
        │  GUIDES          │   │  DOCS          │
        └──────────────────┘   └────────────────┘
                  │                      │
        ┌─────────┼─────────┐           ├──────────────┐
        │         │         │           │              │
        ▼         ▼         ▼           ▼              ▼
┌──────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ ┌───────────┐
│ SOCIAL   │ │SECURITY│ │COPILOT │ │CONNECTION│ │ CONTRIB   │
│ MEDIA    │ │STATUS  │ │INSTRUC │ │ STATUS   │ │ GUIDE     │
└──────────┘ └────────┘ └────────┘ └──────────┘ └───────────┘
```

---

## 📑 Documentation Categories

### 🎯 Strategic Planning (Read First for New Initiatives)

#### [PROJECT_DNA_STRATEGY.md](PROJECT_DNA_STRATEGY.md)
**Purpose**: Master plan for transitioning from e-commerce to SaaS

**Read this when**:
- Planning major features
- Considering new product directions
- Evaluating investment priorities
- Understanding our long-term vision

**Key sections**:
- Vision & Strategic Pillars
- Transformation Roadmap (Phase 1 → Phase 2 → Phase 3)
- Revenue Projections
- Technical Migration Strategy
- Go-to-Market Strategy
- Risk Management

**Time to read**: 20-30 minutes

---

#### [PROJECT_BREAKDOWN_FRAMEWORK.md](PROJECT_BREAKDOWN_FRAMEWORK.md)
**Purpose**: Structured template for analyzing and planning any feature

**Read this when**:
- Starting a new feature or module
- Analyzing business requirements
- Creating technical specifications
- Preparing components for SaaS extraction

**Key sections**:
1. Core Identity & Service (What)
2. Strategic Purpose (Why)
3. Tech Stack & Corporate Tools (How)
4. Phased Breakdown & Clean Data Structures (When & What Data)

**Includes**: Full AI Beauty Assistant example showing framework in action

**Time to read**: 30-45 minutes

---

#### [FRAMEWORK_QUICK_START.md](FRAMEWORK_QUICK_START.md)
**Purpose**: 5-minute guide to applying the Project Breakdown Framework

**Read this when**:
- You want to use the framework but don't have time for the full version
- You need a practical walkthrough with examples
- You're teaching someone else how to use the framework

**Key sections**:
- 4-Step Process (Gather → Apply → Review → Execute)
- Common Pitfalls to Avoid
- Templates for Common Scenarios
- Quick reference checklist

**Time to read**: 5-10 minutes

**Tip**: Read this first, then refer to full framework when filling out details

---

### 🔧 Technical Documentation

#### [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)
**Purpose**: Visual system design and data flow patterns

**Read this when**:
- Understanding how components connect
- Debugging integration issues
- Planning new integrations
- Onboarding new developers

**Key sections**:
- System Architecture (Vite → React → Shopify/Supabase/Browser)
- Data Flow Patterns (Product Catalog, Shopping Cart, AI Assistant, Auth)
- Component Hierarchy
- Integration Points

**Time to read**: 15-20 minutes

---

#### [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
**Purpose**: Step-by-step deployment and DNS configuration

**Read this when**:
- Deploying to production
- Setting up custom domain
- Troubleshooting deployment issues
- Configuring CI/CD

**Time to read**: 10 minutes

---

#### [CONNECTION_STATUS.md](CONNECTION_STATUS.md)
**Purpose**: Verification of all integrations (48 checks)

**Read this when**:
- Verifying system health
- Troubleshooting "not working" issues
- After major configuration changes
- Before production deployment

**Time to read**: 5 minutes

**Action**: Run `./verify-connections.sh` for automated checks

---

### 🤝 Integration Guides

#### [SOCIAL_MEDIA_INTEGRATION.md](SOCIAL_MEDIA_INTEGRATION.md)
**Purpose**: Documentation for all 9 social media platforms

**Read this when**:
- Adding/updating social media links
- Troubleshooting social share features
- Understanding platform-specific requirements

**Platforms covered**: Instagram, Facebook, TikTok, WhatsApp, X, YouTube, LinkedIn, Snapchat, Pinterest

**Time to read**: 10 minutes

---

#### [.github/copilot-instructions.md](.github/copilot-instructions.md)
**Purpose**: Context for AI coding agents (GitHub Copilot, etc.)

**Read this when**:
- Using AI tools to write code
- Understanding project conventions
- Onboarding AI agents to the codebase

**Note**: This is auto-consumed by GitHub Copilot

**Time to read**: 15 minutes (for humans)

---

### 🔒 Security & Compliance

#### [SECURITY.md](SECURITY.md)
**Purpose**: Security policy and vulnerability reporting

**Read this when**:
- Reporting a security issue
- Understanding security practices
- Conducting security audits

**Time to read**: 3 minutes

---

#### [SECURITY_STATUS.md](SECURITY_STATUS.md)
**Purpose**: Current security implementation status

**Read this when**:
- Evaluating security posture
- Planning security improvements
- Preparing for compliance audits

**Time to read**: 5 minutes

---

### 🎓 Contributing & Governance

#### [CONTRIBUTING.md](CONTRIBUTING.md)
**Purpose**: How to contribute to the project

**Read this when**:
- Submitting your first PR
- Understanding code review process
- Learning project conventions

**Time to read**: 5 minutes

---

#### [GOVERNANCE.md](GOVERNANCE.md)
**Purpose**: Decision-making processes and ownership

**Read this when**:
- Understanding who approves what
- Proposing major changes
- Escalating decisions

**Time to read**: 3 minutes

---

## 🎯 Quick Navigation by Role

### For Product Managers / Business Stakeholders
1. Start: [PROJECT_DNA_STRATEGY.md](PROJECT_DNA_STRATEGY.md)
2. Planning features: [FRAMEWORK_QUICK_START.md](FRAMEWORK_QUICK_START.md)
3. Understanding the system: [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)

### For Developers (New to Project)
1. Start: [README.md](README.md)
2. System design: [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)
3. AI agent context: [.github/copilot-instructions.md](.github/copilot-instructions.md)
4. Deployment: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### For Developers (Planning New Feature)
1. Start: [FRAMEWORK_QUICK_START.md](FRAMEWORK_QUICK_START.md)
2. Apply template: [PROJECT_BREAKDOWN_FRAMEWORK.md](PROJECT_BREAKDOWN_FRAMEWORK.md)
3. Check alignment: [PROJECT_DNA_STRATEGY.md](PROJECT_DNA_STRATEGY.md)
4. Review architecture: [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)

### For DevOps / Infrastructure
1. Start: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. Verify health: [CONNECTION_STATUS.md](CONNECTION_STATUS.md)
3. Security review: [SECURITY_STATUS.md](SECURITY_STATUS.md)
4. System architecture: [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)

### For Marketing / Social Media
1. Start: [SOCIAL_MEDIA_INTEGRATION.md](SOCIAL_MEDIA_INTEGRATION.md)
2. Brand context: [PROJECT_DNA_STRATEGY.md](PROJECT_DNA_STRATEGY.md) (Section 1: Strategic Pillars)
3. Contact info: [README.md](README.md) (Contact section)

---

## 🔍 Finding Information Fast

### "How do I...?"

**...plan a new feature?**
→ [FRAMEWORK_QUICK_START.md](FRAMEWORK_QUICK_START.md)

**...understand the system architecture?**
→ [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)

**...deploy to production?**
→ [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

**...add a social media link?**
→ [SOCIAL_MEDIA_INTEGRATION.md](SOCIAL_MEDIA_INTEGRATION.md)

**...report a security issue?**
→ [SECURITY.md](SECURITY.md)

**...contribute code?**
→ [CONTRIBUTING.md](CONTRIBUTING.md)

**...understand Project DNA?**
→ [PROJECT_DNA_STRATEGY.md](PROJECT_DNA_STRATEGY.md)

---

### "What is...?"

**...Project DNA?**
→ [PROJECT_DNA_STRATEGY.md](PROJECT_DNA_STRATEGY.md) - Our SaaS transformation vision

**...the Project Breakdown Framework?**
→ [PROJECT_BREAKDOWN_FRAMEWORK.md](PROJECT_BREAKDOWN_FRAMEWORK.md) - Feature planning template

**...our tech stack?**
→ [README.md](README.md) or [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)

**...the deployment process?**
→ [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 📊 Documentation Metrics

| Document | Lines | Purpose | Update Frequency |
|----------|-------|---------|------------------|
| README.md | ~165 | Quick start & overview | After major releases |
| PROJECT_DNA_STRATEGY.md | ~463 | Strategic roadmap | Quarterly |
| PROJECT_BREAKDOWN_FRAMEWORK.md | ~845 | Feature planning template | As needed (iterative) |
| FRAMEWORK_QUICK_START.md | ~491 | Quick guide to framework | With framework updates |
| ARCHITECTURE_DIAGRAM.md | ~430 | System design | After architecture changes |
| DEPLOYMENT_GUIDE.md | ~230 | Deploy & DNS | When deployment changes |
| CONNECTION_STATUS.md | ~350 | Integration verification | Monthly |
| SOCIAL_MEDIA_INTEGRATION.md | ~270 | Social media docs | When platforms change |

---

## 🔄 Keeping Documentation Updated

### Who updates what?

**Product Team**:
- PROJECT_DNA_STRATEGY.md (strategic changes)
- PROJECT_BREAKDOWN_FRAMEWORK.md (new templates/examples)

**Engineering Team**:
- ARCHITECTURE_DIAGRAM.md (system changes)
- README.md (tech stack updates)
- .github/copilot-instructions.md (coding conventions)

**DevOps Team**:
- DEPLOYMENT_GUIDE.md (deployment process)
- CONNECTION_STATUS.md (integration status)
- SECURITY_STATUS.md (security posture)

**Marketing Team**:
- SOCIAL_MEDIA_INTEGRATION.md (platform updates)

**All Contributors**:
- CONTRIBUTING.md (as process evolves)
- Issue templates (based on common patterns)

---

## 📞 Documentation Questions?

Can't find what you need? Let us know:
- **Email**: asperpharma@gmail.com
- **Create Issue**: [GitHub Issues](https://github.com/asperpharma/Asper-Beauty-Shop/issues)

**Tip**: Search the repository for keywords using `grep -r "your search term" *.md`

---

**Last Updated**: 2026-02-25  
**Maintained By**: Asper Pharma Technical Team
