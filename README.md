# ContractShield AI

> **Intelligent Contract Risk Analysis** — Powered by Xiaomi MiMo-7B-RL

[![Live Demo](https://img.shields.io/badge/Live-Demo-6366f1?style=for-the-badge)](https://ai-contract-analyzer-1.vercel.app)
[![MiMo](https://img.shields.io/badge/Model-MiMo--7B--RL-ff6600?style=for-the-badge)](https://github.com/XiaomiMiMo)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite)](https://vite.dev)

---

## Problem Statement

Millions of individuals, freelancers, and small businesses sign legal contracts every day without fully understanding the legal implications. Hiring a lawyer for every contract review costs **$200–$500+ per hour**, making it inaccessible for most people.

**ContractShield AI** democratizes access to contract risk intelligence by leveraging Xiaomi MiMo's advanced reasoning capabilities to provide instant, affordable, and accurate contract analysis.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Multi-Risk Detection** | Identifies 40+ types of risky clauses including non-compete, unlimited liability, IP traps, auto-renewal, and termination imbalances |
| **Quantitative Risk Scoring** | 0–100 risk score with severity-categorized breakdown (high/medium/low) |
| **Actionable Recommendations** | Generates specific, negotiation-ready suggestions for each identified risk |
| **Executive Summary** | Plain-language summary of complex legal text for quick decision-making |
| **Token Usage Dashboard** | Real-time API consumption monitoring with historical charts and per-analysis tracking |
| **Drag & Drop Upload** | Supports .txt, .md, .rtf file uploads with drag-and-drop interface |
| **Privacy-First Architecture** | 100% client-side processing, no data stored on servers, API keys stored in localStorage |
| **Export Capability** | One-click JSON export of full analysis results for integration with other tools |

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Client (Browser)                     │
├──────────────────────────────────────────────────────┤
│  React 19 + Vite 8 + Tailwind CSS + Framer Motion    │
│                                                        │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  Analyzer   │  │ Token Usage  │  │  Settings   │ │
│  │    Page     │  │  Dashboard   │  │   Modal     │ │
│  └──────┬──────┘  └──────────────┘  └─────────────┘ │
│         │                                             │
│         ▼                                             │
│  ┌─────────────────────────────────────────────┐     │
│  │         analyzer.js (API Client)             │     │
│  │   - System prompt engineering                │     │
│  │   - Structured JSON output parsing           │     │
│  │   - Error handling & retry logic             │     │
│  └──────────────────┬──────────────────────────┘     │
└─────────────────────┼────────────────────────────────┘
                      │ HTTPS (OpenAI-compatible)
                      ▼
┌──────────────────────────────────────────────────────┐
│              Xiaomi MiMo API                          │
│              Model: MiMo-7B-RL                        │
│              Temperature: 0.3                         │
│              Max Tokens: 4,096                        │
└──────────────────────────────────────────────────────┘
```

---

## AI Model Integration

### MiMo-7B-RL

This application integrates with **Xiaomi MiMo-7B-RL** through an OpenAI-compatible API interface.

**Why MiMo-7B-RL?**

- **Strong reasoning capability** — excels at multi-step logical analysis required for legal clause evaluation
- **Structured output** — reliable JSON generation for programmatic risk assessment
- **Context understanding** — captures nuanced legal language and identifies implicit risks
- **Cost-efficient** — 7B parameter model provides excellent performance-to-cost ratio

**Token Consumption Profile:**

| Contract Type | Avg Input Tokens | Avg Output Tokens | Total |
|---------------|-----------------|-------------------|-------|
| Employment Agreement | 2,500–4,000 | 1,500–2,500 | ~5,500 |
| NDA | 1,200–2,000 | 1,000–1,800 | ~3,200 |
| Service Agreement | 3,000–5,000 | 1,800–2,800 | ~6,000 |
| Lease Agreement | 2,800–4,500 | 1,500–2,500 | ~5,800 |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 19 | Component-based UI with hooks |
| **Build Tool** | Vite 8 | Fast HMR development + optimized production builds |
| **Styling** | Tailwind CSS 4 | Utility-first CSS with custom design tokens |
| **Animation** | Framer Motion | Declarative motion components |
| **Icons** | Lucide React | Consistent iconography system |
| **AI** | Xiaomi MiMo API | Contract analysis inference |
| **Deployment** | Vercel | Edge-optimized global CDN |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ or pnpm/yarn
- MiMo API key ([Get one here](https://100t.xiaomimimo.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/contractshield-ai.git
cd contractshield-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Usage

1. **Configure API** — Click "Setup" in the navigation bar and enter your MiMo API key
2. **Input Contract** — Paste contract text directly or drag & drop a text file
3. **Run Analysis** — Click "Run Analysis" to initiate AI-powered review
4. **Review Results** — Navigate between Risks, Recommendations, and Summary tabs
5. **Monitor Usage** — Switch to "Token Usage" tab to track API consumption
6. **Export** — Click "Export JSON" to download structured analysis results

---

## Risk Detection Categories

ContractShield AI evaluates contracts across 8 primary risk categories:

1. **Termination Asymmetry** — Unequal termination rights between parties
2. **Non-Compete/Restrictive Covenants** — Overly broad geographic or temporal scope
3. **Intellectual Property** — Excessive IP assignment clauses
4. **Liability & Indemnification** — Unlimited or disproportionate liability exposure
5. **Payment & Compensation** — Ambiguous payment terms or penalty clauses
6. **Confidentiality** — Unreasonable confidentiality obligations
7. **Auto-Renewal & Lock-in** — Hidden renewal or exit barrier mechanisms
8. **Dispute Resolution** — Missing or one-sided dispute resolution processes

---

## Use Cases

- **Freelancers** — Review client contracts before signing to protect your rights
- **Startup Founders** — Evaluate partnership and investment agreements
- **Small Businesses** — Assess vendor service agreements and NDAs
- **Job Seekers** — Analyze employment contracts for unfair clauses
- **Tenants** — Review lease agreements for hidden risks
- **Consultants** — Evaluate engagement letters and SOWs

---

## Project Structure

```
contractshield-ai/
├── index.html              # Entry HTML with meta tags
├── vite.config.js          # Vite + Tailwind configuration
├── package.json            # Dependencies and scripts
├── src/
│   ├── main.jsx            # React DOM entry point
│   ├── App.jsx             # Main application with routing
│   ├── analyzer.js         # MiMo API integration + prompt engineering
│   ├── TokenUsage.jsx      # Token usage dashboard component
│   ├── demoData.js         # Initial state data
│   └── index.css           # Global styles + design tokens
├── public/
│   └── favicon.svg         # App icon
└── README.md               # This file
```

---

## Security & Privacy

- **No server-side storage** — All processing happens in the browser
- **Local key storage** — API keys persist only in browser localStorage
- **Direct API calls** — Contract text is sent directly to MiMo API, never routed through intermediary servers
- **No telemetry** — Zero analytics or tracking scripts

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

MIT License — See [LICENSE](LICENSE) for details.

---

## Acknowledgments

Built with **Xiaomi MiMo AI** as part of the [MiMo Orbit Trillion Token Creator Incentive Plan](https://100t.xiaomimimo.com).

---

<p align="center">
  <strong>ContractShield AI</strong> — Making contract review accessible to everyone.
  <br />
  Powered by Xiaomi MiMo-7B-RL
</p>
