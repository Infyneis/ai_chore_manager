<p align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/house.svg" alt="AI Chore Manager" width="100" height="100" />
</p>

<h1 align="center">🏠 AI Chore Manager</h1>
<h3 align="center">Smart household chore management with AI-powered prioritization <code>#9/365 - Year Coding Challenge</code></h3>

<p align="center">
  <em>Let AI organize your household tasks, balance workloads, and give you tips for efficient cleaning</em>
</p>

<p align="center">
  <a href="https://github.com/Infyneis">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/samy-djemili/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-0.38-C5F74F?style=flat-square" alt="Drizzle" />
  <img src="https://img.shields.io/badge/Ollama-Local_AI-white?style=flat-square&logo=ollama" alt="Ollama" />
</p>

---

## ✨ Overview

A modern **AI-powered chore management** application for households. Manage family members, assign chores, and let the AI help you prioritize tasks, balance workloads, and provide tips for efficient completion. Features a beautiful purple-themed UI with Shadcn components.

<p align="center">
  <img src="https://img.shields.io/badge/🚀_Year_Coding_Challenge-Project_%239-8B5CF6?style=for-the-badge" alt="Year Coding Challenge" />
  <img src="https://img.shields.io/badge/📅_Completed-December_21,_2024-A78BFA?style=for-the-badge" alt="Completed" />
  <img src="https://img.shields.io/badge/🎨_Theme-Purple_Modern-7C3AED?style=for-the-badge" alt="Theme" />
</p>

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 👨‍👩‍👧‍👦 **Multi-User Household** | Add family members with unique avatars and PIN-based login |
| 📋 **Full Chore Management** | Title, description, due date, priority, category, room, difficulty, and more |
| 🤖 **AI-Powered Tips** | Get smart suggestions for completing any chore efficiently |
| 📊 **Smart Prioritization** | AI reorders your chores based on urgency, dependencies, and efficiency |
| ⚖️ **Workload Balancing** | AI suggests reassignments to distribute work fairly among family members |
| 🔄 **Recurring Chores** | Support for daily, weekly, and monthly recurring tasks |
| 🏷️ **Categories** | Organize by type: cleaning, cooking, maintenance, shopping, other |
| 🎨 **Modern UI** | Beautiful Shadcn components with purple gradient theme |
| 🦙 **100% Local AI** | Powered by Ollama - no API costs, full privacy |
| 💾 **Persistent Storage** | SQLite database with Drizzle ORM |

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
      <br>Next.js 15
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
      <br>React 19
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
      <br>Tailwind CSS
    </td>
    <td align="center" width="96">
      <img src="https://ui.shadcn.com/apple-touch-icon.png" width="48" height="48" alt="shadcn" />
      <br>shadcn/ui
    </td>
  </tr>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=sqlite" width="48" height="48" alt="SQLite" />
      <br>SQLite
    </td>
    <td align="center" width="96">
      <img src="https://orm.drizzle.team/favicon.ico" width="48" height="48" alt="Drizzle" />
      <br>Drizzle ORM
    </td>
    <td align="center" width="96">
      <img src="https://ollama.com/public/ollama.png" width="48" height="48" alt="Ollama" />
      <br>Ollama
    </td>
    <td align="center" width="96">
      <img src="https://pnpm.io/img/pnpm-no-name-with-frame.svg" width="48" height="48" alt="pnpm" />
      <br>pnpm
    </td>
    <td align="center" width="96">
      <img src="https://brew.sh/assets/img/homebrew-256x256.png" width="48" height="48" alt="Homebrew" />
      <br>Homebrew
    </td>
  </tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ 🔐 Login     │  │ 📋 Dashboard │  │ 👥 User Management    │  │
│  │ (PIN Auth)   │  │ (Chore List) │  │ (Family Members)      │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                       API Routes (App Router)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Services                           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ 📋 Chores    │  │ 👥 Users     │  │ 🤖 AI Services        │  │
│  │ CRUD API     │  │ CRUD API     │  │ (Tips, Prioritize,    │  │
│  │              │  │              │  │  Reassign)            │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │                                         │
    ┌────┴────┐                               ┌────┴────┐
    │ SQLite  │                               │ Ollama  │
    │ (local) │                               │ llama3.2│
    └─────────┘                               └─────────┘
```

---

## 📂 Project Structure

```
ai_chore_manager/
├── 🚀 start.sh                      # One-click setup & launch
├── 📦 package.json                  # Dependencies & scripts
├── 🔧 drizzle.config.ts             # Database configuration
├── src/
│   ├── app/
│   │   ├── 🏠 layout.tsx            # Root layout
│   │   ├── 📊 page.tsx              # Dashboard (main view)
│   │   ├── 🔐 login/page.tsx        # User selection + PIN
│   │   ├── 👥 users/page.tsx        # Manage family members
│   │   └── api/
│   │       ├── 📋 chores/route.ts   # Chore CRUD operations
│   │       ├── 👥 users/route.ts    # User CRUD operations
│   │       ├── 🔑 auth/route.ts     # Session management
│   │       └── 🤖 ai/
│   │           ├── 💡 tips/         # Get AI tips for chores
│   │           ├── 📊 prioritize/   # AI-powered reordering
│   │           └── ⚖️ reassign/     # Workload balancing
│   ├── components/
│   │   ├── 🎨 ui/                   # shadcn/ui components
│   │   ├── 🎴 ChoreCard.tsx         # Chore display card
│   │   ├── 📝 ChoreForm.tsx         # Create/edit chore form
│   │   ├── 🤖 AISuggestions.tsx     # AI assistant panel
│   │   ├── 👤 UserAvatar.tsx        # Colored avatar component
│   │   └── 🔢 PinInput.tsx          # PIN entry component
│   ├── lib/
│   │   ├── 🗄️ db.ts                 # Database connection
│   │   ├── 🦙 ollama.ts             # Ollama AI client
│   │   ├── 🔐 auth.ts               # Session & PIN utilities
│   │   └── 🔧 utils.ts              # Helper functions
│   └── db/
│       └── 📝 schema.ts             # Drizzle table schemas
├── data/
│   └── 💾 chores.db                 # SQLite database file
└── 📖 README.md
```

---

## 🚀 Quick Start

### Prerequisites

- 🍺 **Homebrew** - [Install](https://brew.sh) (script will install if missing)
- 🟢 **Node.js 18+** - [Download](https://nodejs.org) (script will install if missing)
- 🦙 **Ollama** - [Download](https://ollama.ai) (script will install if missing)

### One-Command Launch 🎯

```bash
./start.sh
```

This script automatically:

1. ✅ Checks for Homebrew, pnpm, Node.js, Ollama
2. 📦 Installs any missing dependencies
3. 🦙 Pulls llama3.2 model if needed
4. 🗄️ Sets up the SQLite database
5. 🚀 Launches the app at **<http://localhost:3000>**

---

## 🔄 How It Works

### The Workflow

```
👤 Login
    │
    ▼ Select user + enter PIN
┌──────────────────┐
│  📊 Dashboard    │  View all chores, stats, AI panel
└──────────────────┘
    │
    ├──── ➕ Add Chore ──── Fill form with details
    │
    ├──── ✅ Complete ──── Mark chores as done
    │
    ├──── 🤖 Get Tips ──── AI suggests efficient methods
    │
    ├──── 📊 Prioritize ──── AI reorders by urgency
    │
    └──── ⚖️ Balance ──── AI redistributes workload
```

---

## 🗄️ Database Schema

### 👥 Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | User's name |
| pin_hash | TEXT | Bcrypt hashed PIN |
| avatar_color | TEXT | Hex color for avatar |
| created_at | TIMESTAMP | Creation date |

### 📋 Chores Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| title | TEXT | Chore name |
| description | TEXT | Details |
| due_date | TIMESTAMP | When it's due |
| priority | INTEGER | 1 (urgent) to 5 (later) |
| category | TEXT | cleaning, cooking, maintenance, shopping, other |
| estimated_minutes | INTEGER | Time estimate |
| is_recurring | BOOLEAN | Repeating chore? |
| recurrence_pattern | TEXT | daily, weekly, monthly |
| assigned_to | INTEGER | FK to users |
| room_location | TEXT | Where in the house |
| difficulty | TEXT | easy, medium, hard |
| notes | TEXT | Additional notes |
| completed | BOOLEAN | Done status |
| completed_at | TIMESTAMP | Completion time |

---

## 🤖 AI Features

### 💡 Smart Tips

Ask the AI for tips on any chore:

```
📋 Chore: "Deep clean the kitchen"
🤖 AI Tips:
   1. Start with dishes and clear counters first
   2. Work top-to-bottom: cabinets → counters → floor
   3. Use baking soda paste for stubborn stove stains
```

### 📊 Smart Prioritization

The AI considers:

- ⏰ Due dates (urgency)
- 🔢 Priority levels
- 🔗 Dependencies (shopping before cooking)
- 📍 Efficiency (group by room)

### ⚖️ Workload Balancing

The AI analyzes:

- 📊 Chore count per person
- ⏱️ Estimated time totals
- 💪 Difficulty distribution
- 📋 Unassigned tasks

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| 💜 Primary | `#8B5CF6` | Main accent, buttons |
| 💜 Primary Light | `#A78BFA` | Hover states |
| 🔴 Destructive | `#EF4444` | Overdue, delete |
| 🟢 Success | `#22C55E` | Completed |
| 🟡 Warning | `#F59E0B` | High priority |
| ⚫ Background | `#FFFFFF` | Light mode base |
| ⚫ Card | `#F8FAFC` | Card backgrounds |

### Components

- **Shadcn/ui** for consistent, accessible components
- **Radix UI** primitives for dialogs, selects, etc.
- **Lucide** icons throughout
- **Gradient backgrounds** with purple accents

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `./start.sh` | Setup everything and launch |
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm db:push` | Push schema changes to DB |
| `pnpm db:studio` | Open Drizzle Studio GUI |

---

## 🛠️ Manual Setup

<details>
<summary>Click to expand manual setup instructions</summary>

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start Ollama

```bash
ollama serve &
ollama pull llama3.2
```

### 3. Setup database

```bash
pnpm db:push
```

### 4. Start development server

```bash
pnpm dev
```

</details>

---

## 🐛 Troubleshooting

### Ollama not responding

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve
```

### Database errors

```bash
# Regenerate database
rm data/chores.db
pnpm db:push
```

### Port 3000 in use

```bash
# Find process using port
lsof -i :3000

# Kill it
kill -9 <PID>
```

---

## 📄 License

This project is open source and available for personal/educational use.

---

## 🙏 Acknowledgments

- ⚛️ [Next.js](https://nextjs.org) - React framework
- 🎨 [shadcn/ui](https://ui.shadcn.com) - Beautiful components
- 🎨 [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- 🦙 [Ollama](https://ollama.ai) - Local LLM runtime
- 🗄️ [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- 💡 [Lucide](https://lucide.dev) - Beautiful icons
- 🍺 [Homebrew](https://brew.sh) - Package manager

---

<p align="center">
  Made with 💜 by <strong>Samy DJEMILI</strong>
</p>

<p align="center">
  <a href="#top">⬆️ Back to top</a>
</p>
