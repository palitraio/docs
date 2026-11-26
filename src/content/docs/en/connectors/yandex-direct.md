---
title: Yandex.Direct
description: How to connect Yandex.Direct, what data Palitra loads, and what the agent can do.
editions: [saas, byoc]
sources:
  - palitra-backend/src/connectors/yandex/vendor_manifest.yaml
  - palitra-backend/src/connectors/yandex/yandex_direct/manifest.yaml
  - palitra-backend/src/connectors/yandex/yandex_direct/extractor.py
  - palitra-backend/src/connectors/yandex/yandex_direct/error_mapping.py
  - palitra-frontend/components/onboarding/connect-dialog.tsx
  - palitra-frontend/components/onboarding/connect-dialog.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-connectors.en.messages.json
  - palitra-frontend/lib/stores/connector-wizard-store.ts
  - palitra-frontend/components/connector-setup/wizard.tsx
  - palitra-frontend/components/connector-setup/wizard.en.messages.json
  - palitra-frontend/components/connector-setup/oauth-popup.en.messages.json
  - palitra-frontend/components/connector-setup/oauth-error-client.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step.tsx
  - palitra-frontend/components/connector-setup/steps/auth-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step-reuse-picker.tsx
  - palitra-frontend/components/connector-setup/steps/select-account-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/tool-permissions-step.tsx
  - palitra-frontend/components/connector-setup/steps/tool-permissions-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/guardrails-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auto-tagging-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/review-step.en.messages.json
  - palitra-frontend/components/connectors/connectors-tabs.en.messages.json
  - palitra-frontend/components/connectors/catalog-connector-card.en.messages.json
  - palitra-frontend/components/connectors/connected-connector-card.en.messages.json
  - palitra-frontend/components/connectors/connector-issue-icon.tsx
  - palitra-frontend/components/connectors/connector-issue-icon.en.messages.json
  - palitra-frontend/components/connectors/use-connector-copy.en.messages.json
  - palitra-frontend/lib/connectors/tool-title.ts
  - palitra-frontend/components/connectors/credentials-list.en.messages.json
---

The Yandex.Direct connector loads your campaign statistics into Palitra and gives the agent
access to your ad account: it can look at campaigns, ads and keywords and, with your approval,
change them. Ad links are tagged automatically so visits are attributed to the ads that drove
them.

## Connect in the setup wizard

If you are going through the setup wizard after signing up:

1. On the "Connect your platforms" step, find the "Yandex.Direct" card and click "Connect".
2. In the "Connect Yandex.Direct" window, click "Authorize".
3. Sign in to Yandex in the pop-up window and allow access.
4. If you signed in with an agency account, Palitra shows a list of clients. Pick a client and
   click "Connect".

The connector is set up with default settings. You can change them later in the "Connectors"
section.

## Connect from the Connectors section

1. In the sidebar, open "Connectors" and go to the "Marketplace" tab.
2. On the "Yandex.Direct" card, click "Connect". The "Connect Yandex.Direct" page opens.
3. **"Auth".** Click "Connect with OAuth" and sign in to Yandex in the pop-up window. If access
   to Yandex is already saved in Palitra, you can pick the existing credentials instead. Tick
   "Save at organization level" if you need the same access in other projects.
4. **"Select account".** This step appears if you signed in with an agency account. In the
   "Choose sub-account" list, pick the client.
5. **"Permissions".** For each agent tool, choose "Always Allow", "Needs Approval" or
   "Blocked".
6. **"Guardrails".** Set limits for the agent's actions — see below.
7. **"Auto-tagging".** Turn automatic link tagging on or off — see below.
8. **"Review".** Check the settings and click "Finish". Palitra connects the connector and tests
   access.

Use "Continue" and "Back" to move between steps.

## What data is loaded

Palitra loads from Yandex.Direct:

- campaigns, ad groups, ads and keywords;
- impressions, clicks and spend by day — by campaign, ad group and ad, by keyword, by region and
  by device.

## What the agent can do

The agent works with Yandex.Direct through tools. You see the list and the permissions on the
"Permissions" step.

**Reading.** Always allowed by default. For example: "List campaigns", "List ads", "List
keywords", "Account balance", "Forecast budget", "Keyword suggestions", "Custom report".

**Changes.** Need your approval by default. For example: "Set bid", "Set campaign budget", "Stop
campaign", "Start campaign", "Create campaign", "Create ad", "Add negative keywords", "Archive
campaign".

**Deletion.** Tools such as "Delete campaign" or "Delete ad" work only if "Allow deletion" is
on in the guardrails. Deletion is off by default.

## Guardrails

The "Guardrails" step sets safety limits for the agent's actions:

- "Change limits" — how much one action can change a budget, a bid or a bid adjustment;
- "Budget bounds" — the minimum and maximum daily budget;
- "Destructive actions" — "Allow archiving" and "Allow deletion";
- "Minimum data threshold" — the agent will not change items that have too little data;
- "Maximum paused ratio" — the agent will not pause more than this share of active campaigns,
  ads or keywords.

## Auto-tagging

Palitra adds its own tag to ad links so it can attribute clicks and conversions to the ads that
drove them.

- With "Enable automatic tagging" on, Palitra appends tracking parameters to ad URLs after every
  sync.
- If you prefer to tag links yourself, copy the template from the "Manual tracking template"
  block with "Copy template" and paste it into the tracking settings in Yandex.Direct.

## Common problems

If something is wrong with the connector, an icon appears on its card in the "Connectors"
section. Hover over it to see what happened and what to do.

**"Sign-in has expired."** In "Connectors", open the "Credentials" tab, click the three dots on
the Yandex credential's row, choose "Reconnect" and sign in to Yandex again. See the
[connectors overview](/connectors/overview/).

**"The connector has no access to this account."** Check that the login you connected with is
linked to Yandex.Direct and that the account has access to the Yandex.Direct API. Then reconnect
the connector.

**"The last sync failed."** Palitra retries on the next sync. If it keeps failing, click "Sync
now" on the connector card or contact support.

**"Some ads could not be tagged with the Palitra link."** Traffic from those ads is not linked
to conversions. Tag them by hand with the template from the "Auto-tagging" step, or try again
later.

**The pop-up window did not open.** Your browser blocked it. Click the link under the button to
open the authorization page in a new tab, or allow pop-ups for Palitra.

**"You declined the requested permissions."** Authorize again and approve all requested scopes.

**"This account is already connected in this project."** You cannot connect the same account to
a project twice. Open the existing connector, or delete it and connect again.

**"This Yandex sign-in was issued without access to Direct."** The Yandex credential was saved
while connecting another Yandex connector, such as Metrika, and access to Direct was not
requested then. Click "Allow access" and confirm it in the Yandex pop-up: Palitra updates the
same credential, and the other Yandex connectors keep working.
