# 🌟 Asper Beauty Shop

> **Premium Beauty E-commerce Platform** - Luxury skincare and beauty essentials for the modern customer

🔗 **Live**: [www.asperbeautyshop.com](https://www.asperbeautyshop.com)  
🔗 **Dev**: [asperbeautyshop.lovable.app](https://asperbeautyshop.lovable.app)

---

## 🚀 Quick Start

```bash
npm install          # Install dependencies
npm run dev         # Start dev server (localhost:8080)
npm run build       # Build for production
npm run preview     # Preview production build
```

---

## ✨ Features

- 🛍️ **Shopify Integration** - Full e-commerce with checkout
- 🌐 **Bilingual** - English & Arabic (RTL support)
- 🤖 **AI Beauty Assistant** - Powered by Gemini 2.5 Flash
- 📱 **9 Social Platforms** - Instagram, Facebook, TikTok, WhatsApp, X, YouTube, LinkedIn, Snapchat, Pinterest
- 🎨 **Luxury Design** - Responsive, animated, PWA-ready
- 💾 **Smart Cart** - Persistent shopping with Zustand

---

## 🛠️ Tech Stack

**Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui  
**State**: Zustand, React Router v6  
**Backend**: Supabase (auth, serverless functions)  
**E-commerce**: Shopify Storefront API v2025-07  
**Deployment**: Lovable Platform  

---

## 📁 Project Structure

```
src/
├── components/     # UI components (Header, Footer, ProductCard, etc.)
│   └── ui/        # shadcn/ui primitives
├── pages/         # Routes (Index, ProductDetail, Collections, etc.)
├── stores/        # Zustand (cart, wishlist)
├── contexts/      # Language context (EN/AR)
├── lib/           # Utils (shopify, categoryMapping, productUtils)
└── assets/        # Images

supabase/functions/  # Serverless (beauty-assistant, bulk-upload)
public/             # Static (sitemap, robots, manifest, redirects)
```

---

## 🔗 Integrations

### Shopify
- Store: lovable-project-milns.myshopify.com
- API: v2025-07 | Read-only public token

### Supabase
- Project: rgehleqcubtmcwyipyvi
- Functions: Beauty assistant AI, bulk upload

### Lovable
- Hot reload with component tagger
- Custom domain: www.asperbeautyshop.com

---

## 🎨 Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--maroon` | `#800020` | Primary |
| `--soft-ivory` | `#F8F8FF` | Background |
| `--shiny-gold` | `#C5A028` | Accent |
| `--dark-charcoal` | `#333333` | Text |

**Fonts**: Playfair Display (headings), Montserrat (body), Tajawal (Arabic)

---

## 📱 Key Routes

| Route | Description |
|-------|-------------|
| `/` | Home with hero & featured products |
| `/product/:handle` | Product details |
| `/collections/:slug` | Collections (skin-care, hair-care, etc.) |
| `/brands` | All brands |
| `/contact` | Contact & social links |
| `/wishlist` | Saved products |
| `/admin/*` | Admin tools (protected) |

---

## 🔐 Environment

Create `.env` and `.env.production`:

```env
VITE_SUPABASE_URL=https://rgehleqcubtmcwyipyvi.supabase.co
VITE_SUPABASE_PROJECT_ID=rgehleqcubtmcwyipyvi
VITE_SUPABASE_PUBLISHABLE_KEY=<your-key>
VITE_SITE_URL=https://www.asperbeautyshop.com
```

---

## 📚 Documentation

- [Quick Deploy Reference](QUICK_DEPLOY.md) - Fast deployment commands
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - DNS & domain setup
- [Branch Deployment Guide](BRANCH_DEPLOYMENT_GUIDE.md) - Multi-branch deployment workflows
- [Connection Status](CONNECTION_STATUS.md) - Integration verification
- [Copilot Instructions](.github/copilot-instructions.md) - AI agent guide
- [Architecture](ARCHITECTURE_DIAGRAM.md) - System design
- [Social Media](SOCIAL_MEDIA_INTEGRATION.md) - Platform connections

---

## 🚀 Deployment

**Automatic**: Push to `main` or `deploy/asper-updates` → Lovable deploys → Live

**Production**: `main` branch → www.asperbeautyshop.com  
**Preview**: `deploy/asper-updates` branch → Staging environment

**Manual**: `npm run build` → Upload `dist/` folder

**DNS Setup** (for custom domain):
```
Type: CNAME | Name: www | Value: asperbeautyshop.lovable.app
```

**Branch Workflows**:
- `main`: Production-ready code (protected, requires PR)
- `deploy/asper-updates`: Rapid updates & content changes

See [BRANCH_DEPLOYMENT_GUIDE.md](BRANCH_DEPLOYMENT_GUIDE.md) for detailed workflows.

---

## 🧪 Testing

```bash
npm run lint                     # ESLint
./verify-connections.sh          # Verify integrations (48 checks)
npm run build && npm run preview # Test production
```

---

## 📞 Contact

- **Email**: asperpharma@gmail.com
- **Phone**: +962 79 065 6666
- **Location**: Amman, Jordan
- **Social**: [@asper.beauty.shop](https://www.instagram.com/asper.beauty.shop/)

---

**Built with ❤️ by Asper Pharma** | Powered by [Lovable](https://lovable.dev)
