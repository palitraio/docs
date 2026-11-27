---
title: AppMetrica
description: How to connect AppMetrica, what mobile app data Palitra loads, and what the agent can do.
editions: [saas, byoc]
sources:
  - palitra-backend/src/connectors/yandex/vendor_manifest.yaml
  - palitra-backend/src/connectors/yandex/yandex_appmetrica/manifest.yaml
  - palitra-backend/src/connectors/yandex/yandex_appmetrica/extractor.py
  - palitra-backend/src/connectors/yandex/yandex_appmetrica/_errors.py
  - palitra-backend/src/connectors/yandex/yandex_appmetrica/_apps.py
  - palitra-backend/src/connectors/yandex/yandex_appmetrica/_events.py
  - palitra-backend/src/connectors/yandex/yandex_appmetrica/_event_names.py
  - palitra-backend/src/connectors/yandex/yandex_appmetrica/_attribution.py
  - palitra-backend/src/connectors/yandex/yandex_appmetrica/_aggregates.py
  - palitra-backend/src/connectors/yandex/yandex_appmetrica/_schemas.py
  - palitra-backend/src/connectors/yandex/yandex_appmetrica/_pii.py
  - palitra-backend/src/connectors/yandex/yandex_appmetrica/source_event_discoverer.py
  - palitra-backend/src/connectors/yandex/yandex_appmetrica/tools/_generic.py
  - palitra-backend/src/modules/billing/domain/models/feature_matrix.py
  - palitra-backend/src/modules/billing/infrastructure/gating/feature_gate_adapter.py
  - palitra-frontend/components/onboarding/connect-dialog.tsx
  - palitra-frontend/components/onboarding/connect-dialog.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-connectors.tsx
  - palitra-frontend/components/onboarding/steps/step-connectors.en.messages.json
  - palitra-frontend/lib/stores/connector-wizard-store.ts
  - palitra-frontend/lib/connectors/connect-settings.ts
  - palitra-frontend/components/connector-setup/wizard.en.messages.json
  - palitra-frontend/components/connector-setup/oauth-popup.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step-reuse-picker.tsx
  - palitra-frontend/components/connector-setup/steps/auth-step-reuse-picker.en.messages.json
  - palitra-frontend/components/connector-setup/steps/select-account-step.tsx
  - palitra-frontend/components/connector-setup/steps/select-account-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/tool-permissions-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/event-mapping-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/connector-settings-edit.tsx
  - palitra-frontend/components/connector-setup/steps/connector-settings-edit.en.messages.json
  - palitra-frontend/components/connector-setup/steps/review-step.tsx
  - palitra-frontend/components/connector-setup/steps/review-step.en.messages.json
  - palitra-frontend/components/connectors/connectors-tabs.en.messages.json
  - palitra-frontend/components/connectors/catalog-list.en.messages.json
  - palitra-frontend/components/connectors/catalog-connector-card.tsx
  - palitra-frontend/components/connectors/catalog-connector-card.en.messages.json
  - palitra-frontend/components/connectors/connected-connector-card.en.messages.json
  - palitra-frontend/components/connectors/connector-issue-icon.tsx
  - palitra-frontend/components/connectors/connector-issue-icon.en.messages.json
  - palitra-frontend/components/connectors/use-connector-copy.en.messages.json
  - palitra-frontend/components/connectors/use-setting-copy.en.messages.json
  - palitra-frontend/components/connectors/credentials-list.en.messages.json
  - palitra-frontend/components/billing/feature-gates.ts
  - palitra-frontend/components/billing/feature-gates.en.messages.json
  - palitra-frontend/components/billing/feature-lock.tsx
  - palitra-frontend/components/billing/feature-lock-state.en.messages.json
---

The AppMetrica connector loads mobile app data into Palitra: installs, deeplink opens, in-app
events, purchases and ad revenue, with each install's traffic source, plus daily totals by
tracker and country. One connector works with one AppMetrica app.

AppMetrica connects with the same Yandex sign-in as Direct and Metrika: one Yandex credential can
serve all three connectors.

## Plan availability

AppMetrica is a mobile tracker, and mobile trackers are available from the Pro plan. On a plan
without them, the AppMetrica card in the marketplace shows "Available on Pro" and its "Connect"
button is disabled. Click it to see "Mobile trackers aren't included in your plan" with an
"Upgrade plan" button. See [Billing](/organization/billing/).

## Connect in the setup wizard

If you are going through the setup wizard after signing up:

1. On the "Connect your platforms" step, find the "AppMetrica" card and click "Connect".
2. In the "Connect AppMetrica" window, click "Authorize".
3. Sign in to Yandex in the pop-up window and allow access.
4. Palitra shows the apps your login can reach. Pick an app and click "Connect".

The connector is set up with default settings and no event mapping. You can change them later in
the "Connectors" section.

If your plan doesn't include mobile trackers, the AppMetrica card in the wizard also shows
"Available on Pro", and its "Connect" button is disabled.

## Connect from the Connectors section

1. In the sidebar, open "Connectors" and go to the "Marketplace" tab. AppMetrica is in the
   "Mobile tracker" category.
2. On the "AppMetrica" card, click "Connect". The "Connect AppMetrica" page opens.
3. **"Auth".** Click "Connect with OAuth" and sign in to Yandex in the pop-up window. If access
   to Yandex is already saved in Palitra, for example for Direct or Metrika, you can pick the
   existing credentials instead. Tick "Save at organization level" if you need the same access in
   other projects.
4. **"Select account".** In the "Choose the AppMetrica app" list, pick the app. The list has
   every app your login can open, including apps shared through agency access.
5. **"Permissions".** For each agent tool, choose "Always Allow", "Needs Approval" or
   "Blocked".
6. **"Review".** Check the settings and click "Finish". Palitra connects the connector and checks
   access to the app.
7. **"Event mapping".** This step comes after the connector is connected. Map AppMetrica events
   to project events and click "Save mapping" or "Skip for now".

The general wizard steps are described in the [connectors overview](/connectors/overview/).

The app cannot be changed after connecting. To work with another app, connect one more
AppMetrica connector with the same Yandex sign-in.

### If the Yandex credential was issued without AppMetrica access

A credential saved while connecting Direct or Metrika may not include access to AppMetrica. In
that case the "Existing credentials" list shows under it: "This sign-in lacks some of the access
the connector needs. Re-authorize it: the other connectors on it keep working." Click
"Re-authorize".

If you pick such a credential anyway, the wizard shows "This Yandex sign-in was issued without
access to AppMetrica. Allow access: Direct and Metrika keep working." Click "Allow access" and
confirm it in the Yandex pop-up: Palitra updates the same credential and the connection
continues.

## Event mapping

Event mapping links AppMetrica events to project events. The list has the fixed events (installs,
reinstalls, re-attributions, re-engagements, purchases, ad revenue and e-commerce actions) and
the custom events the app has actually sent. Custom events appear in the list once a sync has
loaded them.

While nothing is mapped, every event is imported. Fixed events take Palitra's default names: for
example, an install becomes `first_open`, a purchase `purchase`, an ad impression
`ad_impression`. The app's custom events keep their own names. Once you map at least one event,
events without a mapping are not imported.

## What data is loaded

Palitra loads from AppMetrica, per device:

- installs, reinstalls and re-attributions;
- app opens from deeplinks; only re-engagements become events;
- the app's custom events with their parameters;
- in-app purchases with revenue;
- e-commerce events: screen views, product card and product details views, adding to and
  removing from the cart, checkout starts and purchases;
- in-app ad revenue.

The traffic source works like this. If the tracking link or the deeplink carries the Palitra
tag, the source comes from it. Otherwise it comes from AppMetrica's attribution: the partner, the
touch type and the tracker. An install without a partner or tracker is organic. Events,
purchases and ad revenue take the source of the device's latest install or re-engagement.

Palitra also loads daily totals by partner and tracker and by country: installs, sessions,
events and revenue. They do not become project events.

E-mails, phone numbers and device advertising IDs are stored only as hashes.

## Settings after connecting

The connector's settings page has a "Settings" step:

- "App ID" cannot be changed: "Another app is another connector: delete this one and connect
  again."
- "Revenue currency in daily totals" is RUB, USD or EUR, RUB by default. "Revenue is converted
  the way the AppMetrica interface shows it."

If you change the currency, the "Review" step warns: "After saving, the last 89 days load again;
daily totals for earlier days keep the previous currency." The currency applies to daily totals
only: per-device purchases keep the currency they were made in.

## What the agent can do

The agent works with the AppMetrica app through tools. You see the list and the permissions on
the "Permissions" step. The agent cannot send a request that names another app. The exception
is account-wide tools such as "List apps".

**Reading.** Always allowed by default. For example: "App statistics", "App statistics over
time", "App statistics drill-down", "App details", "List apps", "Installations export", "App
events export", "Revenue events export", "Crashes export", "List push groups", "Push send
status".

Export tools return per-device rows, with personal data hashed or left out the same way Palitra
stores it. Exports share AppMetrica's queue with the sync: if the app's queue already holds two
other exports, the tool refuses.

**Changes.** Need your approval by default. For example: "Change app settings", "Create a push
group", "Change a push group", "Upload events", "Upload purchases", "Upload profile
attributes", "Grant access to the app", "Change Data Stream settings".

**Irreversible actions.** Need your approval by default and cannot be undone once sent: "Delete
the app", "Send push notifications", "Revoke access to the app", "Delete a push group", "Delete
an Android certificate fingerprint", "Cancel a Logs API export".

## Common problems

If something is wrong with the connector, an icon appears on its card in the "Connectors"
section. Hover over it to see what happened and what to do.

**"Sign-in has expired."** Yandex refused the token. In "Connectors", open the "Credentials"
tab, click the three dots on the Yandex credential's row, choose "Reconnect" and sign in to
Yandex again. Direct and Metrika use the same credential if they are connected with this
sign-in. See the [connectors overview](/connectors/overview/).

**"The connector has no access to this account."** The app was deleted, or the login you
connected with no longer has access to it. Ask the app's owner in AppMetrica to grant access,
then reconnect the connector.

**"AppMetrica is busy: this app's export queue is full or the daily request limit is spent. The
sync will continue by itself."** No action is needed.

**"The last sync failed."** Palitra retries on the next sync. If it keeps failing, choose "Sync
now" in the connector card's menu or contact support.

**The pop-up window did not open.** Your browser blocked it. Click the link under the button to
open the authorization page in a new tab, or allow pop-ups for Palitra.

**"You declined the requested permissions."** Authorize again and approve all requested scopes.

**"Yandex did not accept the sign-in. Sign in again."** Click "Sign in again" and authorize in
Yandex once more.

**"This Yandex sign-in was issued without access to AppMetrica."** Click "Allow access" and
confirm it in the Yandex pop-up. See "If the Yandex credential was issued without AppMetrica
access" above.

**"This Yandex login sees no AppMetrica app."** The app's owner grants access in the app's
settings in AppMetrica. Ask for access, or click "Choose another login" and sign in with another
login.

**"This login has no access to the app: ask the app's owner in AppMetrica to grant it."** Ask for
access or pick another app.

**"App not found: it may have been deleted. Choose another one."** Pick another app in the list.

**"This app is already connected in the project as “…”."** Click "Open the existing connector"
or pick another app.
