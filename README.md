# pro-next-auth-prisma

A **professional Next.js starter** built with **TypeScript**, **TailwindCSS**, and **shadcn/ui**, featuring a clean **ESLint + Prettier** setup and ready-to-use **VSCode workspace**.  
Includes full **NextAuth.js (Prisma Adapter)** authentication with role-based access (USER / ADMIN), dynamic layouts, and a built-in **Markdown export utility** for easily sharing your entire codebase.

> Author: **Pooya Tayebi** — [GitHub Profile](https://github.com/pouyatayebi)

---

## ✨ Features

- ⚙️ **Next.js 16 (App Router)** + TypeScript with `@/*` path aliases
- 💅 **TailwindCSS** + `tailwindcss-animate` for modern UI styling
- 🧩 **shadcn/ui** ready (Button, Card, Input, etc.) + `cn` utility
- 🧠 **NextAuth.js + Prisma Adapter** for secure authentication
- 🔐 **Role-based routes** via Proxy (replaces Middleware)
- 🪶 **ESLint (flat config)** + Prettier, auto-format on save
- 🧰 **VSCode workspace** preconfigured with recommended extensions
- 🌍 **Environment-driven identity**: name, slogan, language, and text direction (LTR/RTL)
- 🧱 **Prisma ORM** with Neon / PostgreSQL support
- 🧑‍💻 **Husky + lint-staged** for clean commits
- 🚀 Fully **Vercel deploy ready**
- 📝 **Built-in Project Exporter** to generate Markdown documentation of your full codebase

---

## 🧰 Requirements

- **Node.js** `>= 18.18.0`
- **npm** (or **pnpm** — examples use npm)
- A valid **PostgreSQL / Neon** database URL set in `.env`

---

## 🚀 Quick Start Guide

Here’s how to clone, configure, run, and export the project step by step 👇

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/pouyatayebi/pro-next-auth-prisma.git
cd pro-next-auth-prisma
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Set Up Environment Variables

Copy the example `.env` file and configure it:

```bash
cp .env.example .env
```

Then edit `.env` to set:

- `DATABASE_URL` (e.g., Neon/PostgreSQL connection string)
- `NEXTAUTH_SECRET` (use `openssl rand -base64 32` to generate)
- `NEXTAUTH_URL` (your production or local base URL)
- `APP_NAME`, `APP_SLOGAN`, `APP_LANG`, `APP_DIR`

---

### 4️⃣ Run Development Server

```bash
npm run dev
```

Then open your browser at:  
👉 [http://localhost:3000](http://localhost:3000)

---

### 5️⃣ Build for Production

```bash
npm run build
npm start
```

---

## 🔐 Authentication & Protected Routes

This starter includes **NextAuth.js** integrated with Prisma and a **proxy-based route protection system**.

| Role    | Access                                  |
| ------- | --------------------------------------- |
| `GUEST` | Public routes only (e.g., `/`, `/auth`) |
| `USER`  | `/user` routes + public                 |
| `ADMIN` | All routes (including `/admin`)         |

Route protection is enforced **via proxy** (replaces deprecated middleware).

---

## 🧩 Folder Structure

```text
pro-next-auth-prisma/
├── app/
│   ├── (home)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── user/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── auth/
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── verify/route.ts
│   │   └── debug-session/route.ts
│   ├── layout.tsx
│   └── globals.css
│
├── src/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── components/
│   │   └── ui/
│   ├── proxy.ts
│   └── app-settings.ts
│
├── prisma/
│   ├── schema.prisma
│   └── prisma.config.ts
│
├── public/
│   └── favicon.ico
│
├── export-project-md.js
├── export-project-md.cmd
├── export-project-md.sh
├── package.json
└── README.md
```

---

## 📝 Project Export to Markdown

This project includes a **built-in export utility** that lets you generate a single Markdown file containing your entire project (structure + code).  
It’s perfect for sharing with **ChatGPT**, documentation, or code review.

---

### 📄 Exporter Files

| File                    | Description          |
| ----------------------- | -------------------- |
| `export-project-md.js`  | Main Node.js script  |
| `export-project-md.cmd` | Windows launcher     |
| `export-project-md.sh`  | macOS/Linux launcher |

These are located in your project root.

---

### ⚙️ Usage

#### 🪟 Windows

Just double-click:

```bash
export-project-md.cmd
```

#### 🐧 macOS / Linux

Make it executable once:

```bash
chmod +x export-project-md.sh
```

Then run:

```bash
./export-project-md.sh
```

#### 💻 Or run directly with Node

```bash
node export-project-md.js
```

---

### 🔧 Options

| Flag            | Description                                  | Example              |
| --------------- | -------------------------------------------- | -------------------- |
| `--out <file>`  | Output Markdown file name                    | `--out MyProject.md` |
| `--max <bytes>` | Max size per file (default 800000 bytes)     | `--max 500000`       |
| `--showHidden`  | Include hidden files (.env, .eslintrc, etc.) | `--showHidden`       |

Example:

```bash
node export-project-md.js --out MyExport.md --max 600000 --showHidden
```

---

### 📦 Output Example

Once executed, the script creates a file (default: `PROJECT_EXPORT.md`) in your project root.

It includes:

#### 🧱 1. Project Tree

```text
pro-next-auth-prisma
├── app
│   ├── layout.tsx
│   ├── page.tsx
│   └── user/page.tsx
├── src
│   ├── proxy.ts
│   └── lib/db.ts
└── package.json
```

#### 💻 2. Source Code with Comments

````markdown
### `src/lib/db.ts`

```ts
// Prisma client initialization
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();
```
````

```

All source code blocks are properly syntax-highlighted and include comments.

---

### 💡 Why It’s Useful

- 📚 Instantly document your entire project
- 🤖 Share complete context with **ChatGPT** or other AI tools
- 🧾 Preserve comments and formatting
- ⚙️ Works automatically with `.gitignore`
- 🪶 Cross-platform (Windows / macOS / Linux)
- 🧩 Requires **no external dependencies**

---

## 🧾 License

MIT © 2025 [Pooya Tayebi](https://github.com/pouyatayebi)

---

## 🧡 Credits

Created by **Pooya Tayebi** for professional-grade **Next.js + Prisma** development.
Includes a built-in **Markdown exporter** for easier AI collaboration, documentation, and project sharing.
```
