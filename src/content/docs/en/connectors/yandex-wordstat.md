---
title: Yandex Wordstat
description: How to connect Yandex Wordstat, how Palitra's key differs from your own key, and what the agent can do.
editions: [saas, byoc]
sources:
  - palitra-backend/src/connectors/yandex_wordstat/vendor_manifest.yaml
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/manifest.yaml
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/extractor.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/_account.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/_errors.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/_client.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/_batch.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/tools/_base.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/tools/get_top_requests.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/tools/get_query_dynamics.py
  - palitra-backend/src/connectors/yandex_wordstat/yandex_wordstat/tools/get_regions_distribution.py
  - palitra-backend/src/connectors/_base/errors.py
  - palitra-backend/src/modules/connector_registry/application/services/platform_credential.py
  - palitra-backend/src/modules/connector_registry/application/services/connector_service.py
  - palitra-backend/src/modules/connector_registry/application/services/tool_registry.py
  - palitra-backend/src/modules/billing/domain/models/feature_matrix.py
  - palitra-backend/src/modules/billing/application/services/platform_usage_warning.py
  - palitra-backend/src/modules/notifications/infrastructure/i18n/catalog/en.json
  - palitra-frontend/lib/stores/connector-wizard-store.ts
  - palitra-frontend/lib/connectors/platform-key.ts
  - palitra-frontend/lib/connectors/connect-settings.ts
  - palitra-frontend/components/onboarding/steps/step-connectors.tsx
  - palitra-frontend/components/connector-setup/wizard.tsx
  - palitra-frontend/components/connector-setup/wizard.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step.tsx
  - palitra-frontend/components/connector-setup/steps/auth-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/platform-key-choice.tsx
  - palitra-frontend/components/connector-setup/steps/platform-key-choice.en.messages.json
  - palitra-frontend/components/connector-setup/steps/tool-permissions-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/review-step.tsx
  - palitra-frontend/components/connector-setup/steps/review-step.en.messages.json
  - palitra-frontend/components/connectors/use-connector-copy.en.messages.json
  - palitra-frontend/components/connectors/connectors-tabs.en.messages.json
  - palitra-frontend/components/connectors/catalog-list.tsx
  - palitra-frontend/components/connectors/catalog-list.en.messages.json
  - palitra-frontend/components/connectors/catalog-connector-card.tsx
  - palitra-frontend/components/connectors/catalog-connector-card.en.messages.json
  - palitra-frontend/components/layout/app-sidebar.en.messages.json
  - palitra-frontend/components/connectors/connected-connector-card.tsx
  - palitra-frontend/components/connectors/connected-connector-card.en.messages.json
  - palitra-frontend/components/connectors/connector-key-line.en.messages.json
  - palitra-frontend/components/connectors/connector-issue-icon.en.messages.json
  - palitra-frontend/components/connectors/credentials-list.tsx
  - palitra-frontend/components/connectors/credentials-list.en.messages.json
  - palitra-frontend/components/connectors/rotate-key-dialog.tsx
  - palitra-frontend/components/connectors/rotate-key-dialog.en.messages.json
  - palitra-frontend/components/billing/usage-card.tsx
  - palitra-frontend/components/billing/usage-card.en.messages.json
---

The Yandex Wordstat connector gives the agent search demand data: how often a phrase is searched,
which queries people run with it, how demand changes over time and in which regions it is
higher. No data is loaded into the project: the agent asks Wordstat each time it needs an answer.

The connector can run on Palitra's key or on your own Yandex Cloud key.

## Palitra's key or your own key

- **Palitra's key.** Nothing to set up in Yandex. The agent's requests spend Wordstat units from
  your organization's plan — see below. Palitra's key is available only in the cloud version of
  Palitra; on a BYOC installation, connect your own key.
- **Your own Yandex Cloud key.** Requests go through your key and spend none of your
  organization's plan units.

You choose the key once, when connecting. You cannot change it later: "To switch to your own
key, delete the connection and connect again." The same applies the other way round: to move
from your own key to Palitra's key, delete the connector and connect it again.

A project can have only one Wordstat connector on Palitra's key. You also cannot connect the same
own key to a project twice, but you can connect a different key with "Connect another".

## How to get your own key

The hint in the wizard: "In the console.yandex.cloud console, create a service account with the
search-api.webSearch.user role, issue an API key for it and paste the key here."

Nothing else is needed — only the key itself.

## Connect

The connector is connected only from the "Connectors" section; it is not offered in the setup
wizard after signing up. The general wizard steps are described in the
[connectors overview](/connectors/overview/).

1. In the sidebar, open "Connectors" and go to the "Marketplace" tab. Wordstat is in the "Other"
   category, and its card has the "Research" badge.
2. On the "Yandex Wordstat" card, click "Connect". The "Connect Yandex Wordstat" page opens.
3. **"Auth".** If Palitra's key is available, the "Which key to use" block is at the top, with
   "Palitra's key" selected by default. Below it you see how many units are already used: "…
   of … Wordstat units of your organization's plan used this month."
   - To run on Palitra's key, just click "Continue".
   - To run on your own key, choose "Your own Yandex Cloud key" and paste the key into the "API
     key" field. If a Wordstat key is already saved in Palitra, you can pick the existing
     credentials instead. The organization owner and admin can tick "Save at organization
     level".

   If there is no "Which key to use" block, Palitra's key is not available on this installation
   — paste your own key right away.

4. **"Permissions".** For each agent tool, choose "Always Allow", "Needs Approval" or "Blocked".
5. **"Review".** Click "Finish". On your own key, Palitra checks that Wordstat accepts the key
   while connecting.

Wordstat has no other steps: there is no account to pick, no guardrails and no auto-tagging.

## What data is loaded

None. Wordstat does not sync, so the connector card has no "Sync now" item and no last-sync
line. Instead the card says which key the connector runs on: "Palitra's key" or "Key: …" with
the start and end of your key.

## What the agent can do

Wordstat has three tools. All of them only read data and are always allowed by default.

- **"Top search queries"** — for each phrase over the last 30 days: how many queries contain it,
  the most frequent queries with it, and similar queries. All counts are broad match (the phrase
  in any word form and among other words); Wordstat gives no exact, quoted frequency through
  its API.
- **"Search demand over time"** — the number of queries with the phrase and their share of all
  queries, by month, week or day. Dates are widened to whole periods, and the current incomplete
  period is not included. Daily data covers only the last 60 days.
- **"Search demand by region"** — for each phrase over the last 30 days: the number of queries in
  a region, its share and an affinity index (100 is average interest, above 100 is more than
  average). You can look at cities, at federal subjects or at all regions together.

The agent can ask about up to 20 phrases in one call. All three tools can be narrowed by device:
desktop, phone, tablet. "Top search queries" and "Search demand over time" can also be narrowed
by region (by name or by Wordstat region number).

## Wordstat units on Palitra's key

On Palitra's key, every Wordstat answer spends units from your organization's plan:

| Tool                      | Units per phrase |
| ------------------------- | ---------------- |
| "Top search queries"      | 1                |
| "Search demand over time" | 1                |
| "Search demand by region" | 2                |

- Units are shared by all projects of the organization and renew once a month.
- You pay only for phrases Wordstat answered. A phrase Wordstat refused, or a request that
  failed, costs nothing.
- If the units left do not cover the agent's whole request, it is refused as a whole, before
  Wordstat is asked.
- The "Wordstat units this month" counter and its renewal date are shown in
  [Billing](/organization/billing/). The same balance is shown on the "Auth" step and in the
  connector settings.
- When the organization has used 80% of its units, the organization owner and admins get a
  "Usage limit approaching" notification — once a month.

Palitra's key works only with a working subscription: without a subscription, while the
subscription is not active, or while an invoice is overdue, the agent's requests are refused.
Your own key spends no plan units, and these limits do not apply to it.

## Common problems

**"Yandex did not accept the key: it is wrong or was deleted. Copy the key again or issue a new
one in the Yandex Cloud console."** The wizard shows this on the "Auth" step if Yandex does not
recognise the key. Paste a valid key.

**"The key's service account lacks the search-api.webSearch.user role. Assign it in the Yandex
Cloud console and try again."** Assign the role to the service account the key was issued for,
then click "Finish" again.

**"Yandex Wordstat is not responding right now. Try again later."** Wordstat is temporarily
unavailable. Connect again later.

**"Palitra's key for … is not available right now. Connect your own key."** The wizard switches
to the field for your own key by itself — paste a Yandex Cloud key.

**"Yandex Wordstat is already connected in this project…"** A connector on Palitra's key, or
one with the same key, already exists in the project. Open it, or delete it to connect again.

**"Yandex no longer accepts the connector's API key." on the connector card.** For example, the
key was deleted in Yandex Cloud. The hint under the message: "On your own key, issue a new one
in the Yandex Cloud console and replace it: choose “Configure” in the connector's menu, click
“Connect a different account” on the “Auth” step, paste the new API key and click “Save” on the
“Review” step. On Palitra's key, contact support."

On your own key, if the credential's status is "Invalid — needs Reconnect", you can also paste the
new key on the "Credentials" tab of "Connectors": click the three dots on the Wordstat credential's
row, choose "Reconnect", paste the new key and click "Save key". See the [connectors
overview](/connectors/overview/#reconnect-a-credential). A connector on Palitra's key has no
credential in that list.

**The agent says the Wordstat limit on Palitra's key is used up.** The message says how many
units are used and when the limit renews. Wait for the renewal, change plan, or connect the
connector again on your own key.

**The agent says Wordstat is temporarily unavailable on Palitra's key.** Try again later, or
connect the connector on your own key.

## Related articles

- [Connectors overview](/connectors/overview/)
- [Billing](/organization/billing/)
