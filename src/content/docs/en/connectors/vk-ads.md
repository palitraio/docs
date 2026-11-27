---
title: VK Ads
description: How to connect VK Ads, what data Palitra loads, and what the agent can do.
editions: [saas, byoc]
sources:
  - palitra-backend/src/connectors/vk/vendor_manifest.yaml
  - palitra-backend/src/connectors/vk/account_grant.py
  - palitra-backend/src/connectors/vk/vk_ads/manifest.yaml
  - palitra-backend/src/connectors/vk/vk_ads/extractor.py
  - palitra-backend/src/connectors/vk/vk_ads/transformer.py
  - palitra-backend/src/connectors/vk/vk_ads/error_mapping.py
  - palitra-backend/src/connectors/vk/vk_ads/_guardrails.py
  - palitra-backend/src/connectors/vk/vk_ads/tagger.py
  - palitra-backend/src/connectors/vk/vk_ads/_utm_linker.py
  - palitra-backend/src/connectors/vk/vk_ads/tools/_generic.py
  - palitra-frontend/components/onboarding/connect-dialog.tsx
  - palitra-frontend/components/onboarding/connect-dialog.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-connectors.tsx
  - palitra-frontend/components/onboarding/steps/step-connectors.en.messages.json
  - palitra-frontend/lib/stores/connector-wizard-store.ts
  - palitra-frontend/components/connector-setup/wizard.en.messages.json
  - palitra-frontend/components/connector-setup/oauth-error-client.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step.tsx
  - palitra-frontend/components/connector-setup/steps/auth-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step-reuse-picker.tsx
  - palitra-frontend/components/connector-setup/steps/auth-step-reuse-picker.en.messages.json
  - palitra-frontend/components/connector-setup/steps/client-credentials-form.en.messages.json
  - palitra-frontend/components/connector-setup/steps/select-account-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/tool-permissions-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/guardrails-step.tsx
  - palitra-frontend/components/connector-setup/steps/guardrails-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auto-tagging-step.tsx
  - palitra-frontend/components/connector-setup/steps/auto-tagging-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/review-step.en.messages.json
  - palitra-frontend/components/connectors/connectors-tabs.en.messages.json
  - palitra-frontend/components/connectors/catalog-connector-card.en.messages.json
  - palitra-frontend/components/connectors/connected-connector-card.en.messages.json
  - palitra-frontend/components/connectors/connector-issue-icon.en.messages.json
  - palitra-frontend/components/connectors/credentials-list.en.messages.json
  - palitra-frontend/components/connectors/revoke-credential-dialog.en.messages.json
  - palitra-frontend/components/connectors/use-connector-copy.en.messages.json
  - palitra-frontend/lib/connectors/tool-title.ts
---

The VK Ads connector loads campaigns, ad groups, ads and daily statistics into Palitra and
gives the agent access to your ad cabinet: it can look at campaigns and reports and, with your
approval, change them. Links in ad groups are tagged automatically so visits are attributed to
the ads that drove them.

If you are an agency or a manager, you choose which client cabinet to connect. One connector
works with one cabinet; for another client, connect one more connector.

## Connect in the setup wizard

If you are going through the setup wizard after signing up:

1. On the "Connect your platforms" step, find the "VK Ads" card and click "Connect".
2. In the "Connect VK Ads" window, click "Authorize".
3. Sign in to VK Ads in the pop-up window and allow access.
4. If you signed in with an agency or manager cabinet, Palitra shows a list of its clients.
   Pick a client and click "Connect".

The connector is set up with default settings. You can change them later in the "Connectors"
section. This window cannot connect through your own API client; use the "Connectors" section
for that.

## Connect from the Connectors section

1. In the sidebar, open "Connectors" and go to the "Marketplace" tab.
2. On the "VK Ads" card, click "Connect". The "Connect VK Ads" page opens.
3. **"Auth".** Choose one of the ways in:
   - click "Connect with OAuth" and allow access in the VK Ads pop-up window;
   - or connect through your own API client — see below;
   - or, if access to VK is already saved in Palitra, pick the existing credentials.

   Tick "Save at organization level" if you need the same access in other projects.

4. **"Select account".** This step appears if you signed in with an agency or manager cabinet.
   In the "Choose sub-account" list, pick the client cabinet. A plain advertiser cabinet skips
   this step.
5. **"Permissions".** For each agent tool, choose "Always Allow", "Needs Approval" or
   "Blocked".
6. **"Guardrails".** Set limits for the agent's actions — see below.
7. **"Auto-tagging".** Turn automatic link tagging on or off — see below.
8. **"Review".** Check the settings and click "Finish". Palitra connects the connector and tests
   access.

The general wizard rules are in the [connectors overview](/connectors/overview/).

### Your own API client

Instead of granting access through Palitra, you can connect through an API client created in
your cabinet. In the "Connect with your own API client" block:

1. In the VK Ads cabinet, open "Settings → API access" (the hint above the fields links to it)
   and create an API client.
2. Paste its values into the "Client id" and "Client secret" fields.
3. Click "Connect with client id and secret". When it is done, the wizard shows "Connected. You
   can continue."

An agency's or manager's API client works too: you pick the client cabinet on the "Select
account" step. If this API client is already connected, Palitra issues no new token and uses
the existing one. To enter a different one, click "Use a different API client".

If you later revoke such a credential in Palitra, the token stays active at VK: revoke it in the
VK Ads cabinet if you no longer need it.

## What data is loaded

Palitra loads from VK Ads:

- campaigns, ad groups and ads — including stopped and deleted ones, so their history is kept;
- impressions, clicks, goal completions and spend in the cabinet currency — by day, for each ad,
  linked to its ad group and campaign.

VK Ads provides no breakdown by keyword, region or device, so this connector has no such
reports.

Data is refreshed every 6 hours. On every sync Palitra re-checks the last two weeks and
downloads again the days whose totals changed in the cabinet.

## What the agent can do

The agent works with VK Ads through tools — more than a hundred of them, one for each VK Ads
API method. You see the list and the permissions on the "Permissions" step. If VK granted only
read access when you authorized, the agent gets only the reading tools.

**Reading.** Always allowed by default. For example: "List campaigns", "List ad groups", "List
ads", "Account balance", "Performance report", "Last hour statistics", "Goal statistics", "Why
ads are not running", "Ad landing links", "Forecast reach", "List agency clients".

**Changes.** Need your approval by default. For example: "Stop campaign", "Start campaign",
"Create campaign", "Update campaign", "Create ad group", "Update ad", "Update ads in bulk",
"Upload creative", "Send ads for re-moderation", "Create audience segment".

**Deletion.** Tools such as "Delete ad" or "Delete ad group", and any change that sets an item's
status to deleted (this is how VK deletes campaigns), work only if "Allow deletion" is on in
the guardrails. Deletion is off by default.

**Archiving.** "Archive lead forms" and "Archive surveys" work only if "Allow archiving" is on.
Archiving is off by default.

## Guardrails

The "Guardrails" step sets safety limits for the agent's actions. By default no numeric limits
are set, and deletion and archiving are off.

- "Change limits" — "Max budget change per action" and "Max bid change per action" for
  campaigns and ad groups. The change is measured from the current value in the cabinet, and
  several changes to the same item within 24 hours add up.
- "Budget bounds" — the minimum and maximum daily budget. With a maximum daily budget set, the
  agent cannot remove the daily budget limit.
- "Destructive actions" — "Allow archiving" and "Allow deletion".
- "Minimum data threshold" — the agent will not change the budget or bid of a campaign or ad
  group that has too little data.

The "Max bid modifier change per action" field and the "Maximum paused ratio" section do not
apply to VK Ads.

## Auto-tagging

Palitra adds its own tag to links so it can attribute clicks and conversions to the ads that
drove them. In VK Ads the tag goes into the URL parameters of each ad group.

- With "Enable automatic tagging" on, Palitra appends its tag to the ad groups' URL parameters
  after a sync and turns on their use. Your own parameters are kept; deleted ad groups are
  skipped.
- If the agent changes an ad group's URL parameters, Palitra keeps its tag in them.
- If you prefer to tag links yourself, copy the template from the "Manual tracking template"
  block with "Copy template" and add it to the URL parameters of your ad groups. VK applies
  these parameters only while URL tagging is on for the ad group.

## Common problems

If something is wrong with the connector, an icon appears on its card in the "Connectors"
section. Hover over it to see what happened and what to do.

**"Sign-in has expired."** Access to the cabinet is no longer valid. In "Connectors", open the
"Credentials" tab, click the three dots on the VK credential's row, choose "Reconnect" and sign
in again. See the [connectors overview](/connectors/overview/).

**"The connector has no access to this account."** Check the rights of the cabinet the
connector uses, then reconnect the connector.

**"The last sync failed."** Palitra retries on the next sync. If it keeps failing, click "Sync
now" on the connector card or contact support.

**"Some ads could not be tagged with the Palitra link."** Traffic from those ads is not linked
to conversions. Tag them by hand with the template from the "Auto-tagging" step, or try again
later.

**"This sign-in lacks some of the access the connector needs."** VK grants rights by cabinet
type, so a saved credential may lack some of them. You can still pick it. The "Re-authorize"
button starts a new authorization.

**The pop-up window did not open.** Your browser blocked it. Click the link under the button to
open the authorization page in a new tab, or allow pop-ups for Palitra.

**"You declined the requested permissions."** Authorize again and approve the requested
scopes.

**"This account is already connected in this project."** You cannot connect the same cabinet to
a project twice. Click "Open the existing connector" or pick another cabinet.

**"VK rejected the client id or secret".** Copy both again from the cabinet's API access
settings and check that API access isn't blocked there.

**"Token limit reached for this API client".** VK issues a limited number of tokens per API
client. Release unused tokens of this client in the cabinet, or wait until unused tokens
expire.

**"VK refused to issue a token".** If this is an agency's or manager's API client, check that
the cabinet is still its client.
