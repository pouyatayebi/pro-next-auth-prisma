# pro-next-auth-prisma

A **professional Next.js starter** with **TypeScript**, **TailwindCSS**, and **shadcn/ui**, plus a polished **ESLint + Prettier** setup and **VSCode workspace** ready out of the box. It also includes an `app-settings` file that centralizes project identity and supports **LTR/RTL** via environment variables.

> Author: **Pooya Tayebi** — [GitHub Profile](https://github.com/pouyatayebi)

---

## ✨ Features

- **Next.js (App Router) + TypeScript** with `src/` structure and `@/*` alias
- **TailwindCSS** with sensible defaults + `tailwindcss-animate`
- **shadcn/ui** initialized (Button, Card, Input, etc.) and `cn` utility
- **ESLint (flat config) + Prettier** fully aligned; fix & format on save
- **VSCode workspace**: Pre-configured settings + recommended extensions
- **Environment-driven app identity**: name, slogan, language, and `dir` (LTR/RTL)
- **Husky + lint-staged** (optional) for clean commits
- Ready for **Vercel** deploy

---

## 🧰 Requirements

- **Node.js** `>= 18.18.0`
- **npm** or **pnpm** (examples use npm)

---

## 🚀 Quick Start

```bash
# 1) Create from this template or clone:
git clone https://github.com/pouyatayebi/pro-next-auth-prisma.git
cd pro-next-auth-prisma

# 2) Install deps
npm install

# 3) Environment variables
cp .env.example .env
# edit .env to your needs (name, slogan, dir, language)

# 4) Dev
npm run dev
```
