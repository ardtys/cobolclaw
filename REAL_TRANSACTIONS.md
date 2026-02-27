# 🚨 COBOLCLAW - REAL TRANSACTION EXECUTION GUIDE

## ⚠️ CRITICAL WARNING - READ BEFORE USING ⚠️

**THIS IS NO LONGER A DEMO. TRANSACTIONS ARE REAL.**

- ✅ All transactions execute on Solana Mainnet
- ✅ Real money will be spent
- ✅ Real tokens will be bought/sold
- ✅ All actions are irreversible
- ✅ You are responsible for all trades

---

## 🔒 SAFETY FEATURES IMPLEMENTED

### 1. **Transaction Limits**
```
MAX SOL PER TRADE: 0.5 SOL
MIN SOL PER TRADE: 0.001 SOL
MAX SLIPPAGE: 10%
MAX PRICE IMPACT: 10%
```

Any transaction exceeding these limits will be **AUTOMATICALLY REJECTED**.

### 2. **Double Confirmation Required**
1. **Terminal Confirmation** - You must click [Y] CONFIRM
2. **Phantom Approval** - You must approve in Phantom wallet popup

Both steps required. You can cancel at either step.

### 3. **Real-Time Quotes**
- All quotes from Jupiter Aggregator (real prices)
- Price impact calculated before execution
- Slippage protection built-in
- Route optimization automatic

### 4. **Balance Checks**
- Insufficient balance = automatic rejection
- Reserves 0.01 SOL for transaction fees
- Checks both SOL and token balances

---

## 📊 WHAT CHANGED FROM MOCK TO REAL

| Feature | Before (Mock) | Now (Real) |
|---------|---------------|------------|
| **CONNECT** | Fake wallet | Real Phantom wallet |
| **Balance** | Random 12-22 SOL | Real SOL from blockchain |
| **SCAN** | Real tokens ✅ | Real tokens ✅ |
| **AUDIT** | Real on-chain data ✅ | Real on-chain data ✅ |
| **CLAW (Buy)** | Simulated | **REAL Jupiter swap** |
| **DUMP (Sell)** | Simulated | **REAL Jupiter swap** |
| **BAG** | Mock holdings | Real SPL token balances |
| **TX Hash** | Fake signature | Real Solana signature |
| **Portfolio** | Simulated | Real blockchain holdings |

---

## 🎯 HOW TO USE SAFELY

### Step 1: Prepare Test Wallet

**RECOMMENDED: Use a separate test wallet**

1. Create new Phantom wallet specifically for testing
2. Send **SMALL AMOUNT** of SOL (0.1 - 0.5 SOL maximum)
3. **NEVER** use your main wallet with large holdings

```bash
# Example: Send 0.1 SOL from main → test wallet
# Do this in Phantom, not in terminal
```

### Step 2: Connect Wallet

```
> CONNECT
```

**What happens:**
1. Phantom popup appears
2. Review connection request
3. Click "Connect" (or cancel if unsure)
4. Real address and balance displayed

### Step 3: Scan Tokens

```
> SCAN
```

**Returns:**
- Real tokens from Raydium pools
- Real prices from Jupiter
- Real market data (volume, holders, etc.)

### Step 4: Audit Token (IMPORTANT!)

```
> AUDIT $TICKER
```

**Before buying ANY token:**
- Check risk score (1-10, lower = safer)
- Review holder distribution
- Check deployer history
- Look for red flags (mint authority, freeze authority, etc.)

### Step 5: Buy Token (SMALL AMOUNT!)

```
> CLAW $TICKER 0.01
```

**⚠️ START WITH 0.01 SOL MAXIMUM FOR FIRST TEST**

**What happens:**
1. Terminal shows confirmation screen with:
   - Estimated tokens you'll receive
   - Price impact
   - Slippage tolerance
   - Safety limit warnings
2. Click [Y] CONFIRM or [N] CANCEL
3. If confirmed, Phantom popup appears
4. Review transaction details in Phantom
5. Approve or reject in Phantom
6. If approved:
   - Transaction broadcasts to blockchain
   - Wait for confirmation (~5-30 seconds)
   - Success message with Solscan link
   - Portfolio updates automatically

### Step 6: Check Portfolio

```
> BAG
```

**Shows:**
- Real SPL token balances from your wallet
- Current market value
- SOL balance
- Total portfolio value

### Step 7: Sell Token

```
> DUMP $TICKER 100
```

**What happens:**
- Same confirmation process as buy
- Sells specified amount of tokens
- Receives SOL back
- Updates portfolio automatically

---

## 🚨 SAFETY PROTOCOLS

### BEFORE Each Trade:

- [ ] **Check token audit** - Use AUDIT command
- [ ] **Verify amount** - Double check you're not trading too much
- [ ] **Check slippage** - Default 1%, increase if needed
- [ ] **Review quote** - Make sure price makes sense
- [ ] **Read warnings** - Don't skip the confirmation screen

### DURING Trade:

- [ ] **Review Phantom popup** - Check all details match
- [ ] **Don't rush** - Take time to verify
- [ ] **Cancel if unsure** - Better safe than sorry
- [ ] **Don't close window** - Wait for confirmation

### AFTER Trade:

- [ ] **Verify on Solscan** - Check transaction succeeded
- [ ] **Check BAG** - Confirm tokens received
- [ ] **Review balance** - Make sure SOL balance correct

---

## 🐛 TROUBLESHOOTING

### "Amount exceeds safety limit"

**Problem:** Trying to trade more than 0.5 SOL

**Solution:**
- Reduce amount to 0.5 SOL or less
- This is a safety feature - cannot be overridden

### "Price impact too high"

**Problem:** Trade would move price too much (>10%)

**Solution:**
- Reduce trade size
- Token may have low liquidity
- Consider if you really want this token

### "Transaction rejected by user"

**Problem:** You clicked "Reject" in Phantom

**Solution:**
- Normal - transaction cancelled
- No money spent
- Try again if you meant to approve

### "Insufficient balance"

**Problem:** Not enough SOL or tokens

**Solution:**
- Check balance with `BAG` command
- Deposit more SOL to wallet
- Make sure you're selling tokens you own

### "Slippage tolerance exceeded"

**Problem:** Price changed too much during execution

**Solution:**
- Increase slippage in settings (default 1%)
- Try again immediately
- Market may be very volatile

### Transaction stuck "WAITING FOR CONFIRMATION"

**Problem:** Blockchain congestion

**Solution:**
- Wait up to 60 seconds
- Check Solscan with TX hash
- If failed, transaction will auto-revert
- Try again with higher priority fee

---

## 💰 TRANSACTION FEES

### What You Pay:

1. **Jupiter Swap Fee:** ~0.1% of trade (goes to Jupiter)
2. **Solana Network Fee:** ~0.00001-0.0001 SOL
3. **Priority Fee:** 0.0001 SOL default (faster confirmation)
4. **Price Impact:** Depends on liquidity (shown before trade)

### Total Cost Example:

```
Buying 0.1 SOL of $BEER:
- Swap amount: 0.1 SOL
- Jupiter fee: ~0.0001 SOL
- Network fee: ~0.00001 SOL
- Priority fee: 0.0001 SOL
- TOTAL: ~0.10021 SOL
```

---

## 📝 BEST PRACTICES

### ✅ DO:

- Start with TINY amounts (0.01 SOL)
- Audit tokens before buying
- Use test wallet with small balance
- Read all confirmations carefully
- Check Solscan after trades
- Keep transaction hashes saved

### ❌ DON'T:

- Trade large amounts without testing
- Skip the AUDIT command
- Ignore red flags in audit
- Rush through confirmations
- Trade unknown/suspicious tokens
- Use main wallet for testing
- Trade all your SOL at once

---

## 🔍 VERIFICATION LINKS

After any transaction, verify on blockchain explorers:

**Solscan (Recommended):**
```
https://solscan.io/tx/[YOUR_TX_HASH]
```

**Solana Explorer:**
```
https://explorer.solana.com/tx/[YOUR_TX_HASH]
```

**SolanaFM:**
```
https://solana.fm/tx/[YOUR_TX_HASH]
```

---

## 📊 UNDERSTANDING THE PORTFOLIO (BAG)

### Real Data Shown:

```
> BAG

═══════════════════════════════════════
 YOUR PORTFOLIO (REAL BLOCKCHAIN DATA)
═══════════════════════════════════════

TOKEN          BALANCE      VALUE
$BEER          1,234.56     0.0123 SOL
$MEME          9,876.54     0.0987 SOL

SOL BALANCE:   0.4567 SOL
TOTAL VALUE:   0.5677 SOL

✅ REAL DATA FROM BLOCKCHAIN
   Updated: [timestamp]
```

### What It Means:

- **BALANCE:** Actual token amount in your wallet (from blockchain)
- **VALUE:** Current market value in SOL (from Jupiter prices)
- **SOL BALANCE:** Your actual SOL balance (minus reserved for fees)
- **TOTAL VALUE:** SOL balance + all token values

### Refresh Portfolio:

```
> BAG
```

Run BAG command again to refresh. May take a few seconds to fetch from blockchain.

---

## 🎓 TESTING WORKFLOW

### First-Time Setup:

1. Create test Phantom wallet
2. Send 0.1 SOL to test wallet
3. Connect in terminal: `CONNECT`
4. Verify balance shown is correct

### Test Buy Flow:

```bash
> SCAN                    # Find tokens
> AUDIT $TOKEN           # Check safety
> CLAW $TOKEN 0.01       # Buy tiny amount
  [Read confirmation]
  [Approve in Phantom]
  [Wait for confirmation]
> BAG                    # Verify tokens received
```

### Test Sell Flow:

```bash
> BAG                    # Check holdings
> DUMP $TOKEN 100        # Sell small amount
  [Read confirmation]
  [Approve in Phantom]
  [Wait for confirmation]
> BAG                    # Verify SOL received
```

---

## 🚨 EMERGENCY PROCEDURES

### If Something Goes Wrong:

1. **DON'T PANIC**
2. Check transaction on Solscan
3. Transaction either succeeded or failed (no "stuck" state)
4. If failed: money automatically refunded
5. If succeeded but tokens not showing: wait 30 seconds, run `BAG` again

### If You Made a Mistake:

**Bought wrong token?**
- Immediately sell it back: `DUMP $TOKEN ALL`
- Some loss from slippage is normal

**Sold wrong amount?**
- Buy it back immediately: `CLAW $TOKEN [amount]`
- Again, expect some loss from fees/slippage

**Lost access to terminal?**
- Your tokens are safe in Phantom wallet
- Open Phantom directly to manage
- Or reconnect in new terminal session

---

## 📚 TECHNICAL DETAILS

### Technologies Used:

- **Jupiter Aggregator v6:** Swap execution
- **Helius RPC:** Blockchain connection
- **@solana/web3.js:** Transaction building
- **@solana/spl-token:** Token operations
- **Phantom Wallet:** Transaction signing

### Transaction Flow:

1. User inputs command
2. Fetch Jupiter quote
3. Show confirmation
4. User confirms in terminal
5. Build Jupiter swap transaction
6. Request Phantom signature
7. User approves in Phantom
8. Broadcast to Solana blockchain
9. Wait for confirmation
10. Update local state
11. Fetch updated balances

### Security Measures:

- Client-side only (your private keys never leave Phantom)
- No backend server (decentralized)
- All transactions signed by YOU in Phantom
- Open source (audit the code)

---

## 📞 SUPPORT & ISSUES

### If You Find Bugs:

1. Save transaction hash
2. Take screenshot of error
3. Note what you were doing
4. Report at: [GitHub Issues URL]

### Common Non-Issues:

- Slippage difference from quote = NORMAL
- Small fee differences = NORMAL
- Confirmation taking 10-30 seconds = NORMAL
- Price changes between quote and execution = NORMAL (volatile market)

---

## 📖 GLOSSARY

**Slippage:** Difference between expected and actual price
**Price Impact:** How much your trade moves the market price
**Liquidity:** How easy it is to buy/sell without affecting price
**TX Hash:** Unique transaction identifier on blockchain
**Lamports:** Smallest unit of SOL (1 SOL = 1 billion lamports)
**SPL Token:** Solana's token standard (like ERC-20 on Ethereum)
**Associated Token Account:** Your wallet's account for specific token

---

## ✅ FINAL CHECKLIST BEFORE FIRST TRADE

- [ ] Using TEST wallet (not main wallet)
- [ ] Wallet has small amount only (0.1-0.5 SOL)
- [ ] Read this entire document
- [ ] Understand risks and costs
- [ ] Tested CONNECT and DISCONNECT
- [ ] Phantom wallet extension working
- [ ] Know how to check Solscan
- [ ] Ready to lose test funds (worst case)
- [ ] Will start with 0.01 SOL trade
- [ ] Know how to cancel if needed

**If all checked: You're ready to test!**

**If any unchecked: DO NOT PROCEED**

---

## 🎯 RECOMMENDED FIRST TRADE

```bash
# 1. Connect wallet
> CONNECT

# 2. Scan for tokens
> SCAN

# 3. Find a well-known token (not random memecoin)
#    Look for high holders count (>1000)

# 4. Audit the token
> AUDIT $SAFE_TOKEN

# 5. If risk score < 5, proceed with tiny buy
> CLAW $SAFE_TOKEN 0.01

# 6. After confirmation, check portfolio
> BAG

# 7. Immediately sell it back to test sell flow
> DUMP $SAFE_TOKEN ALL

# 8. Verify SOL returned
> BAG
```

This completes a full buy→sell cycle with minimal risk.

---

**REMEMBER:**
- This is real money
- Start small
- Test everything
- Don't trade what you can't afford to lose
- When in doubt, don't trade

**Good luck and trade safely! 🍀**

---

**Document Version:** 1.0
**Last Updated:** 2026-02-27
**Status:** ✅ Production Ready
**Risk Level:** 🔴 HIGH - Real Money Involved
