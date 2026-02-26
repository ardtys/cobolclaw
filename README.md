# COBOLCLAW

**OLD CODE. FAST CLAWS.**

A retro IBM mainframe terminal-themed platform for blockchain token trading. Built with SvelteKit + TailwindCSS.

![COBOLCLAW Terminal](https://img.shields.io/badge/STATUS-ONLINE-33FF33?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==)

## Features

### 🖥️ Authentic CRT Terminal Experience
- Scanline overlay with screen flicker animation
- Phosphor glow on all text
- Vignette effects
- Blinking block cursor (530ms)
- Command-line interface with autocomplete
- Command history navigation (↑/↓ arrows)

### 🚀 Core Functionality

#### SCAN - Live Token Feed
- Real-time token monitoring (auto-refresh every 10s)
- Filter by keyword: `SCAN AI`, `SCAN DOG`
- Sort options: `SCAN SORT:VOL`, `SCAN SORT:MCAP`, `SCAN SORT:AGE`
- Hot/Warm/Cool/Dead status indicators

#### AUDIT - Risk Analysis
- Comprehensive token risk scoring (1-10 scale)
- Holder concentration analysis
- Top 10 holder breakdown
- Deployer history tracking
- Serial rugger detection
- Mint/Freeze authority checks
- Risk factors with color-coded alerts

#### BAG - Portfolio Management
- Holdings tracker with real-time PnL
- Color-coded profit/loss indicators
- Diamond Hands score (% held >24h)
- Entry price vs current price comparison

#### CLAW & DUMP - Trading
- Buy tokens: `CLAW $TICKER 0.5`
- Sell tokens: `DUMP $TICKER ALL`
- Transaction confirmation UI
- Animated progress bars
- Mock transaction execution

### 🎨 Design System

**Color Palette:**
- Primary: `#33FF33` (CRT Green)
- Amber: `#FFB000` (Warnings)
- Red: `#FF3333` (Errors/Sell)
- Cyan: `#00FFFF` (Links)

**Typography:**
- IBM Plex Mono (primary)
- Share Tech Mono (display/headers)

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cobolclaw.git
cd cobolclaw

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the terminal.

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## Available Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `HELP` | Show all commands | `HELP` |
| `SCAN` | View live token feed | `SCAN [FILTER]` or `SCAN SORT:VOL` |
| `AUDIT` | Analyze token risk | `AUDIT $TICKER` or `AUDIT [ADDRESS]` |
| `BAG` | View portfolio | `BAG` |
| `CLAW` | Buy token | `CLAW $TICKER [AMOUNT_SOL]` |
| `DUMP` | Sell token | `DUMP $TICKER [AMOUNT]` or `DUMP $TICKER ALL` |
| `CONNECT` | Connect wallet | `CONNECT` |
| `DISCONNECT` | Disconnect wallet | `DISCONNECT` |
| `CLEAR` | Clear terminal | `CLEAR` |

## Tech Stack

- **Framework:** SvelteKit 2.x
- **Styling:** TailwindCSS 3.x
- **Language:** TypeScript (strict mode)
- **Testing:** Vitest
- **Deployment:** Vercel (configured with adapter-vercel)

## Project Structure

```
cobolclaw/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── crt/          # CRT effects components
│   │   │   ├── terminal/     # Terminal UI components
│   │   │   ├── features/     # Feature components (Scan, Audit, etc.)
│   │   │   └── ui/           # Reusable UI components
│   │   ├── stores/           # Svelte stores (state management)
│   │   ├── utils/            # Utilities and helpers
│   │   ├── mock-data/        # Mock data generators
│   │   └── types/            # TypeScript type definitions
│   └── routes/               # SvelteKit routes
├── static/                   # Static assets
└── tests/                    # Test files
```

## Features in Detail

### Boot Sequence
On first visit, experience an authentic mainframe boot sequence with:
- Typewriter animation (30ms per character)
- System diagnostics
- Memory check, disk array, network module initialization
- Press [ENTER] to continue or [ESC] to skip

### Risk Calculator
The AUDIT command uses a sophisticated risk scoring algorithm:
- **Holder Concentration** (0-2 points)
- **Dev Wallet %** (0-2 points)
- **Token Age** (0-1.5 points)
- **Mint Authority** (0-2 points)
- **Freeze Authority** (0-1.5 points)
- **Deployer Rug History** (0-2 points)
- **Liquidity Ratio** (0-1 point)
- **Sniper Wallets** (0-0.5 points)

### Mobile Support
- Responsive design (min-width: 320px)
- Touch-friendly interactions
- Optimized CRT effects for performance
- Sidebar toggle via `MENU` command

## Development

### Run Tests
```bash
npm run test
```

### Type Checking
```bash
npm run check
```

### Linting
```bash
npm run lint
```

## Deployment

This project is configured for Vercel deployment:

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

Environment variables: None required for v1 (uses mock data)

## Roadmap

- [ ] Real blockchain RPC integration
- [ ] Actual wallet adapter (Phantom/Solflare)
- [ ] Live pump.fun API connection
- [ ] Sound effects toggle
- [ ] Additional themes (Amber, Cyan, Red)
- [ ] Alert notifications
- [ ] Documentation pages
- [ ] Mobile gesture support

## License

MIT License - see LICENSE file

## Credits

Built with 💚 by the COBOLCLAW team

**Technologies:**
- SvelteKit
- TailwindCSS
- TypeScript
- IBM Plex Mono font
- Share Tech Mono font

## Support

Report issues: [GitHub Issues](https://github.com/yourusername/cobolclaw/issues)

---

**⚠️ DISCLAIMER:** This is a terminal interface simulation with mock data. Not financial advice. DYOR. NFA. Use at your own risk.

**OLD CODE. FAST CLAWS.** 🖥️⚡
