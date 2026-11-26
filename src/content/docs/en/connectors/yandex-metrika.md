---
title: Yandex.Metrika
description: How to connect Yandex.Metrika, what data Palitra loads, and what the agent can do.
editions: [saas, byoc]
sources:
  - palitra-backend/src/connectors/yandex/vendor_manifest.yaml
  - palitra-backend/src/connectors/yandex/yandex_metrika/manifest.yaml
  - palitra-backend/src/connectors/yandex/yandex_metrika/extractor.py
  - palitra-backend/src/connectors/yandex/yandex_metrika/error_mapping.py
  - palitra-frontend/components/onboarding/onboarding-wizard.tsx
  - palitra-frontend/components/onboarding/connect-dialog.tsx
  - palitra-frontend/components/onboarding/connect-dialog.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-connectors.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-attribution.en.messages.json
  - palitra-frontend/lib/stores/connector-wizard-store.ts
  - palitra-frontend/components/connector-setup/wizard.tsx
  - palitra-frontend/components/connector-setup/wizard.en.messages.json
  - palitra-frontend/components/connector-setup/oauth-popup.en.messages.json
  - palitra-frontend/components/connector-setup/oauth-error-client.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step.tsx
  - palitra-frontend/components/connector-setup/steps/auth-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/select-account-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/tool-permissions-step.tsx
  - palitra-frontend/components/connector-setup/steps/tool-permissions-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/event-mapping-step.tsx
  - palitra-frontend/components/connector-setup/steps/event-mapping-step.en.messages.json
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

The Yandex.Metrika connector loads site visits and goal completions into Palitra. Goals become
project events. One connector works with one Metrika counter.

## Connect in the setup wizard

If you are going through the setup wizard after signing up:

1. On the "Connect your platforms" step, find the "Yandex.Metrika" card and click "Connect".
2. In the "Connect Yandex.Metrika" window, click "Authorize".
3. Sign in to Yandex in the pop-up window and allow access.
4. Palitra shows the counters your account can reach. Pick a counter and click "Connect".

The connector is set up with default settings. Once Metrika is connected, the wizard adds the
"Attribution settings" step.

## Connect from the Connectors section

1. In the sidebar, open "Connectors" and go to the "Marketplace" tab.
2. On the "Yandex.Metrika" card, click "Connect". The "Connect Yandex.Metrika" page opens.
3. **"Auth".** Click "Connect with OAuth" and sign in to Yandex in the pop-up window. Tick "Save
   at organization level" if you need the same access in other projects.
4. **"Select account".** In the "Choose sub-account" list, pick the counter.
5. **"Permissions".** For each agent tool, choose "Always Allow", "Needs Approval" or
   "Blocked".
6. **"Review".** Check the settings and click "Finish". Palitra connects the connector and tests
   access.
7. **"Event mapping".** This step comes after the connector is connected. Map Metrika events to
   project events and click "Save mapping" or "Skip for now".

While nothing is mapped, every event is imported under its own name. Once you map at least one
event, events without a mapping are not imported.

The counter cannot be changed after connecting. To work with another counter, connect Metrika
again and pick that counter.

## What data is loaded

Palitra loads from Yandex.Metrika:

- site visits;
- the counter's goal completions — they become project events;
- e-commerce events: product and list views, adding to and removing from the cart, purchases and
  refunds.

## What the agent can do

The agent reads Metrika data through tools. All of them only read data and are always allowed
by default:

- "Custom report" — a report with the dimensions, metrics and filters you need;
- "List goals" — the goals set up on the counter;
- "List segments" — the counter's saved segments;
- "Compare periods" — two date ranges side by side.

## Common problems

If something is wrong with the connector, an icon appears on its card in the "Connectors"
section. Hover over it to see what happened and what to do.

**"Sign-in has expired."** In "Connectors", open the "Credentials" tab, click the three dots on
the Yandex credential's row, choose "Reconnect" and sign in to Yandex again. See the
[connectors overview](/connectors/overview/).

**"The connector has no access to this account."** The login you connected with no longer has
access to the counter. Ask the counter's owner to grant access, then reconnect the connector.

**"The last sync failed."** Palitra retries on the next sync. If it keeps failing, click "Sync
now" on the connector card or contact support.

**The pop-up window did not open.** Your browser blocked it. Click the link under the button to
open the authorization page in a new tab, or allow pop-ups for Palitra.

**"You declined the requested permissions."** Authorize again and approve all requested scopes.

**"This account is already connected in this project."** This counter is already connected.
Open the existing connector, or delete it and connect again.

**"This Yandex sign-in was issued without access to Metrika."** The Yandex credential was saved
while connecting another Yandex connector, such as Direct, and access to Metrika was not
requested then. Click "Allow access" and confirm it in the Yandex pop-up: Palitra updates the
same credential, and the other Yandex connectors keep working.

**The counter step lists no counter.** The login you signed in with has no access to any
counter. Ask the counter's owner to grant access, or click "Back to authentication" and choose
another login.
