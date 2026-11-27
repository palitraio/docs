---
title: AppsFlyer
description: How to connect AppsFlyer, what data Palitra loads, how push works, and what the agent can do.
editions: [saas, byoc]
sources:
  - palitra-backend/src/connectors/appsflyer/vendor_manifest.yaml
  - palitra-backend/src/connectors/appsflyer/appsflyer/manifest.yaml
  - palitra-backend/src/connectors/appsflyer/appsflyer/extractor.py
  - palitra-backend/src/connectors/appsflyer/appsflyer/_reports.py
  - palitra-backend/src/connectors/appsflyer/appsflyer/_schemas.py
  - palitra-backend/src/connectors/appsflyer/appsflyer/_events.py
  - palitra-backend/src/connectors/appsflyer/appsflyer/_event_names.py
  - palitra-backend/src/connectors/appsflyer/appsflyer/source_event_discoverer.py
  - palitra-backend/src/connectors/appsflyer/appsflyer/_errors.py
  - palitra-backend/src/connectors/appsflyer/appsflyer/_raw_refusals.py
  - palitra-backend/src/connectors/appsflyer/appsflyer/_push_setup.py
  - palitra-backend/src/connectors/appsflyer/appsflyer/_push_channel.py
  - palitra-backend/src/connectors/appsflyer/appsflyer/push_receiver.py
  - palitra-backend/src/connectors/appsflyer/appsflyer/_server_rules.json
  - palitra-backend/src/connectors/appsflyer/appsflyer/_endpoints.py
  - palitra-backend/src/connectors/appsflyer/appsflyer/tools/_generic.py
  - palitra-backend/src/modules/billing/domain/models/feature_matrix.py
  - palitra-backend/src/modules/billing/infrastructure/gating/feature_gate_adapter.py
  - palitra-frontend/lib/stores/connector-wizard-store.ts
  - palitra-frontend/lib/connectors/connect-settings.ts
  - palitra-frontend/lib/auth/roles.ts
  - palitra-frontend/components/connectors/catalog-connector-card.tsx
  - palitra-frontend/components/connectors/catalog-connector-card.en.messages.json
  - palitra-frontend/components/billing/feature-gates.ts
  - palitra-frontend/components/billing/feature-gates.en.messages.json
  - palitra-frontend/components/billing/feature-lock.tsx
  - palitra-frontend/components/billing/feature-lock-state.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-connectors.tsx
  - palitra-frontend/components/connector-setup/wizard.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step.tsx
  - palitra-frontend/components/connector-setup/steps/auth-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step-reuse-picker.en.messages.json
  - palitra-frontend/components/connector-setup/steps/select-account-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/tool-permissions-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/review-step.tsx
  - palitra-frontend/components/connector-setup/steps/review-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/event-mapping-step.tsx
  - palitra-frontend/components/connector-setup/steps/event-mapping-step.en.messages.json
  - palitra-frontend/app/[locale]/(app)/projects/[projectId]/connectors/[connectorId]/page.tsx
  - palitra-frontend/components/connectors/connector-push-panel.tsx
  - palitra-frontend/components/connectors/connector-push-panel.en.messages.json
  - palitra-frontend/components/connectors/disconnect-actions-dialog.en.messages.json
  - palitra-frontend/components/connectors/connectors-tabs.en.messages.json
  - palitra-frontend/components/connectors/connected-connector-card.en.messages.json
  - palitra-frontend/components/connectors/connector-issues-list.tsx
  - palitra-frontend/components/connectors/connector-issue-icon.tsx
  - palitra-frontend/components/connectors/connector-issue-icon.en.messages.json
  - palitra-frontend/components/connectors/credentials-list.tsx
  - palitra-frontend/components/connectors/credentials-list.en.messages.json
  - palitra-frontend/components/connectors/rotate-key-dialog.tsx
  - palitra-frontend/components/connectors/rotate-key-dialog.en.messages.json
  - palitra-frontend/components/connectors/use-connector-copy.en.messages.json
  - palitra-frontend/components/data-pipeline/attribution/attribution-windows.en.messages.json
---

The AppsFlyer connector loads installs, re-engagements, uninstalls and in-app events from one
AppsFlyer app into Palitra and joins them to ads through AppsFlyer's attribution or the Palitra
Linker. The agent gets access to the reports and settings of the AppsFlyer account. Advertising
device IDs, e-mails and phones are stored only as hashes.

## Palitra plan

AppsFlyer is a mobile tracker, and mobile trackers are available on the Pro plan and above. On
a lower plan, the "AppsFlyer" card in the marketplace carries the "Available on Pro" badge and
its "Connect" button is inactive. Click it to see "Mobile trackers aren't included in your
plan" with an "Upgrade plan" button. See [Billing](/organization/billing/) for plans.

## What to prepare in AppsFlyer

- **An API V2 token.** An admin of the AppsFlyer account issues it under Settings → API tokens.
  One token reaches every app of the account.
- **An S2S token and a OneLink token**, optional. Only the agent tools that send
  server-to-server events or work with OneLink links need them. Without them the connector
  loads data as usual, and those tools do not run.

AppsFlyer is not in the setup wizard after sign-up: it offers only services that sign in with
OAuth. Connect AppsFlyer from the Connectors section.

## Connect

1. In the sidebar, open "Connectors" and go to the "Marketplace" tab.
2. On the "AppsFlyer" card, click "Connect". The "Connect AppsFlyer" page opens.
3. **"Auth".** Paste the token into "API V2 token". "S2S token" and "OneLink token" are
   optional. If an AppsFlyer token is already saved in Palitra, you can pick it in the
   "Existing credentials" list with "Use this credential". The organization owner and admins
   can tick "Save at organization level" if the same token is needed in other projects.
4. **"Select account".** On the "Choose the app" step, pick the app from the apps the token
   can reach.
5. **"Permissions".** For each agent tool, choose "Always Allow", "Needs Approval" or
   "Blocked".
6. **"Review".** Check the settings and click "Finish". Palitra connects the connector and tests
   access by reading the app's daily aggregate report.
7. **"Event mapping".** This step comes after the connector is connected. Map AppsFlyer events
   to project events and click "Save mapping" or "Skip for now" — see below.

AppsFlyer has no "Guardrails" or "Auto-tagging" step. The general wizard rules are in the
[connectors overview](/connectors/overview/).

One connector loads one app. The app cannot be changed after connecting: to load another app
of the same account, connect another connector with "Connect another".

## What data is loaded

Palitra loads from AppsFlyer:

- installs and reinstalls, non-organic and organic;
- re-engagements and re-attributions;
- in-app events, including retargeting events;
- app uninstalls;
- in-app ad revenue;
- daily totals by partner and campaign and by country: installs, events and revenue.

Installs, in-app events and uninstalls become project events. Ad revenue and the daily totals
do not.

Palitra keeps device-level data (installs, events, uninstalls and ad revenue) for the last 90
days, which is also as far back as AppsFlyer serves it. Connecting loads those 90 days. The
daily totals are kept for 400 days. Palitra syncs every 6 hours and re-checks the last 14 days
each time.

If the AppsFlyer plan has no raw data (Raw Data), Palitra loads only the daily totals and warns
about it on the connector card. The connector cannot work without the aggregate reports: every
AppsFlyer plan includes them, and if AppsFlyer refuses them, connecting fails.

Once a mobile tracker is connected in the project, the [attribution settings](/data/attribution/)
show the "Install attribution window" slider.

## Push: events right away, without waiting for a sync

If the AppsFlyer plan includes the Push API, AppsFlyer sends installs and events to Palitra
right away, without waiting for a sync. The sync later reads the same data from the reports,
and nothing is counted twice.

Usually there is nothing to do: when you connect, Palitra adds its endpoint to the app's Push
API settings in AppsFlyer itself and leaves your own endpoints in place. If AppsFlyer does not
answer, Palitra tries again at the next sync. If the plan has no Push API, events load by sync
only.

### If you have to add the endpoint by hand

If AppsFlyer did not let Palitra add the endpoint, or the app already has 6 Push API endpoints
(AppsFlyer's limit), the connector's settings page shows a "Push" card titled "Add the endpoint
in AppsFlyer by hand". Project managers, the organization owner and admins see this card.

1. Click the connector's name on its card to open the "AppsFlyer settings" page.
2. Read the reason on the "Push" card. If the app already has 6 endpoints, remove one of them in
   AppsFlyer first.
3. In AppsFlyer, open Export → API Access → Push API and add an endpoint.
4. Enter the values of "Endpoint URL", "Method", "Event types" and "Fields" from the "Push"
   card. The URL is hidden: click "Reveal" to see it, or copy it with "Copy".

If you send a test message from AppsFlyer (Send Test), the card shows "An AppsFlyer test message
(Send Test) arrived."

### Change the endpoint's token

The push endpoint's URL carries a secret token, which has nothing to do with the API V2 token.
While the "Push" card is shown on the settings page, it has a "Change token" button. Click it
and confirm. The old URL stops working at once. If Palitra added the endpoint, it sets up the
new one in AppsFlyer itself; if you added it by hand, paste the new URL in AppsFlyer yourself.

## Event mapping

The "Event mapping" step lists AppsFlyer's events: installs, reinstalls, re-engagements and
re-attributions, uninstalls, AppsFlyer's recommended events (`af_purchase`, `af_add_to_cart`,
`af_complete_registration` and others), and the events the app has already sent.

While nothing is mapped, events load under default names:

- install and reinstall: `first_open`;
- re-engagement and re-attribution: `app_reengagement`;
- uninstall: `app_remove`;
- AppsFlyer's recommended events get standard names, for example `af_purchase` becomes
  `purchase`, `af_add_to_cart` becomes `add_to_cart`, `af_complete_registration` becomes
  `sign_up`;
- every other in-app event keeps the name the app sent.

Once you map at least one event, events without a mapping, installs and uninstalls included,
are no longer loaded. So map every event you need. You can come back to this step later in the
connector's settings. See [Events](/data/events/).

## What the agent can do

The agent works with AppsFlyer through tools, more than a hundred of them. The list and the
permissions are on the "Permissions" step.

**Reading.** Always allowed by default. For example: "List apps", "App statistics", "Daily
report", "Report by partner", "Report by country", "Cohort report", "Master report", "Raw
installs", "Raw in-app events", "SKAN performance report", "OneLink link details", "List active
audiences".

**Changes and deletion.** Need your approval by default. For example: "Create OneLink link",
"Update OneLink link", "Send in-app event from server", "Create imported audience", "Update
Push API settings", "Set up ad revenue integrations", "Add test device", "Delete OneLink link",
"Delete app", "Delete users".

The tools that send server-to-server events need the S2S token, and the OneLink tools need the
OneLink token. If the token was not given when connecting, such a tool does not run.

## Disconnecting

When you delete the connector, Palitra removes its endpoint from the app's Push API settings.
If it cannot (for example, you added the endpoint by hand), the "AppsFlyer is disconnected"
window appears with the step "Remove Palitra's endpoint … in AppsFlyer: Export → API Access →
Push API." Remove the endpoint in AppsFlyer and click "Done". How to delete a connector is in
the [connectors overview](/connectors/overview/).

## Common problems

If something is wrong with the connector, an icon appears on its card in the "Connectors"
section. Hover over it to see what happened and what to do. On the connector's settings page,
push warnings link to the "Push" card with "Open the Push panel".

**When connecting: "AppsFlyer did not accept the token…"** Paste a valid API V2 token from
Settings → API tokens. Only account admins issue tokens; AppsFlyer revoked the tokens created
before 2026-03-10.

**"The AppsFlyer plan has no aggregated reports."** The connector cannot load data without
them. Check the account's status and plan in AppsFlyer.

**"The AppsFlyer account may be suspended — contact AppsFlyer support."**

**"This app is not visible with this token."** Pick another app, or use the token of the
account that owns the app.

**"This app is already connected in this project as "…"."** One app cannot be connected to a
project twice. Open the existing connector with "Open the existing connector".

**"AppsFlyer no longer accepts the connector's API V2 token."** For example, the token was
reissued, or its owner lost admin rights. The hint under the message: "Issue a new token in
AppsFlyer and replace it: choose “Configure” in the connector's menu, click “Connect a different
account” on the “Auth” step, paste the new API V2 token and click “Save” on the “Review” step."

If the credential's status is "Invalid — needs Reconnect", you can also replace the key on the
"Credentials" tab of "Connectors": click the three dots on the AppsFlyer credential's row, choose
"Reconnect", paste the new API V2 token and click "Save key". This replaces the key in every
connector on that credential. See the [connectors
overview](/connectors/overview/#reconnect-a-credential). If you use the S2S and OneLink tokens,
paste them in the dialog too, or they are removed.

**"The connector has no access to this account."** The token no longer sees the connector's
app. In the connector's settings, use the token of the AppsFlyer account that owns the app.

**"The vendor's API limit is used up for now."** AppsFlyer limits report requests per day.
Nothing to do: the sync resumes after the limits reset at 00:00 UTC.

**"The vendor plan no longer gives device-level data."** The AppsFlyer plan no longer includes
raw data. Device tables stopped updating; rows already loaded stay. Bring the package back to
the plan and loading resumes with the next sync.

**"Part of your vendor account is disabled, so some data is not loaded."** AppsFlyer does not
serve some reports, for example retargeting or ad revenue. Enable what is missing in AppsFlyer;
the data loads on the next sync.

**"The app already has as many Push API endpoints as the vendor allows."** Remove one endpoint
in AppsFlyer and add the one from the "Push" card.

**"Palitra's endpoint is gone from the app's Push API list."** Copy the URL from the "Push"
card and add it in AppsFlyer again: Export → API Access → Push API.

**"No push messages for a long time, though the vendor sees new installs."** Check in AppsFlyer
that Palitra's endpoint is set up and enabled.

**"Push messages or the endpoint's setup lack required fields."** The warning names the
missing fields. Select them in the setup of Palitra's endpoint in AppsFlyer.

**"Palitra could not read some push messages."** Check that the setup of Palitra's endpoint in
AppsFlyer has every needed field selected. If the warning repeats, contact support.

**"The last sync failed."** Palitra retries on the next sync. If it keeps failing, choose "Sync
now" in the connector card's menu or contact support.

**"A setup step failed while connecting."** Palitra repeats it with the next sync. Nothing to
do.
