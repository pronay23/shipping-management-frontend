# Ledger Reports API Contract

Endpoints consumed by the new frontend report pages (`app/(app)/features/journal/reports/`).
Implements §5 of [`ledger-best-practices.md`](ledger-best-practices.md) — all figures come
from **approved entries only**; voided originals are excluded while their approved
reversals stay included (net zero).

## GET `/api/reports/trial-balance`

Per §5.3 trial-balance query, grouped per account.

```json
{
  "data": [
    {
      "account_id": 3,
      "account_code": "1010",
      "account_name": "Cash in Hand",
      "account_type": "asset",
      "debit_total": "50000.00",
      "credit_total": "20000.00",
      "balance": "30000.00"
    }
  ],
  "totals": {
    "debit": "135740.00",
    "credit": "135740.00"
  }
}
```

Rules:

- `balance` = `SUM(debit - credit)` per account (Dr positive / Cr negative).
- `totals.debit` and `totals.credit` must be equal — if not, the ledger is corrupt and the
  backend should log loudly.
- Amounts serialized as strings (2 dp), never floats.

## GET `/api/accounts/{accountId}/ledger?page=1&per_page=50`

General ledger for one account with running balance (§5.3 window-function query).
Paginated — the ledger grows forever.

```json
{
  "account": {
    "id": 3,
    "code": "1010",
    "name": "Cash in Hand",
    "type": "asset",
    "opening_balance": "0.00"
  },
  "data": [
    {
      "journal_entry_id": 45,
      "entry_date": "2026-08-19",
      "voucher_number": "JV-2026-0007",
      "reference": "MR/BCLL/2026/0819-101530",
      "note": "Bank Transfer",
      "debit": "135740.00",
      "credit": "0.00",
      "running_balance": "135740.00"
    }
  ],
  "meta": { "current_page": 1, "last_page": 3, "per_page": 50, "total": 120 }
}
```

Rules:

- Order by `entry_date`, then `journal_entries.id`, then line id — deterministic ordering;
  `running_balance` is the cumulative `SUM(debit - credit)` in that order.
- `opening_balance` = sum of all approved activity **before** the first row of the current
  page (`null`/`"0.00"` on page 1). The frontend renders it above the table.
- Default `per_page = 50`, cap at 200.
- 404 when the account does not exist.

## Frontend files

| File | Purpose |
|---|---|
| `features/journal/api/getTrialBalance.ts` | Trial-balance client |
| `features/journal/api/getAccountLedger.ts` | GL client (page + per_page) |
| `features/journal/types/index.ts` | Response types |
| `features/journal/reports/trial-balance/page.tsx` | `/features/journal/reports/trial-balance` |
| `features/journal/reports/[accountId]/page.tsx` | Per-account GL with pagination |
