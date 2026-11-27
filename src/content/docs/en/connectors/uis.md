---
title: UIS
description: How to connect UIS, which calls, requests, chats and deals Palitra loads and how they are linked to ads.
editions: [saas, byoc]
sources:
  - palitra-backend/src/connectors/uis/vendor_manifest.yaml
  - palitra-backend/src/connectors/uis/uis/manifest.yaml
  - palitra-backend/src/connectors/uis/uis/extractor.py
  - palitra-backend/src/connectors/uis/uis/transformer.py
  - palitra-backend/src/connectors/uis/uis/_events.py
  - palitra-backend/src/connectors/uis/uis/_rows.py
  - palitra-backend/src/connectors/uis/uis/_schemas.py
  - palitra-backend/src/connectors/uis/uis/_errors.py
  - palitra-backend/src/connectors/uis/uis/_client.py
  - palitra-backend/src/connectors/uis/uis/_site.py
  - palitra-backend/src/connectors/_base/traffic_source.py
  - palitra-backend/src/modules/connector_registry/domain/models/connector_manifest.py
  - palitra-backend/src/modules/connector_registry/application/dtos/catalog.py
  - palitra-backend/src/modules/data_layer/application/services/etl_service.py
  - palitra-frontend/lib/stores/connector-wizard-store.ts
  - palitra-frontend/lib/connectors/connect-settings.ts
  - palitra-frontend/components/onboarding/steps/step-connectors.tsx
  - palitra-frontend/components/connector-setup/wizard.tsx
  - palitra-frontend/components/connector-setup/use-account-list.ts
  - palitra-frontend/components/connector-setup/wizard.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step.tsx
  - palitra-frontend/components/connector-setup/steps/auth-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step-reuse-picker.en.messages.json
  - palitra-frontend/components/connector-setup/steps/ip-allow-list-notice.tsx
  - palitra-frontend/components/connector-setup/steps/ip-allow-list-notice.en.messages.json
  - palitra-frontend/components/connector-setup/steps/select-account-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/connector-settings-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/review-step.tsx
  - palitra-frontend/components/connector-setup/steps/review-step.en.messages.json
  - palitra-frontend/components/connectors/connectors-tabs.en.messages.json
  - palitra-frontend/components/connectors/catalog-list.en.messages.json
  - palitra-frontend/components/connectors/catalog-connector-card.en.messages.json
  - palitra-frontend/components/connectors/connected-connector-card.en.messages.json
  - palitra-frontend/components/connectors/connector-issue-icon.en.messages.json
  - palitra-frontend/components/connectors/use-connector-copy.en.messages.json
  - palitra-frontend/components/connectors/use-setting-copy.en.messages.json
  - palitra-frontend/components/connectors/credentials-list.tsx
  - palitra-frontend/components/connectors/credentials-list.en.messages.json
  - palitra-frontend/components/connectors/rotate-key-dialog.tsx
  - palitra-frontend/components/connectors/rotate-key-dialog.en.messages.json
  - palitra-frontend/components/connector-setup/steps/credential-key-fields.tsx
---

The UIS connector (formerly CoMagic) loads calls, requests, chats and deals from one UIS site
into Palitra. Each contact is linked to the ad that brought the visitor, through the Palitra
Linker. Phone numbers and e-mails are stored only as hashes keyed with the project's key.

One connector works with one UIS site. The connector only reads data: it changes nothing in
UIS.

UIS is not offered in the setup wizard after sign-up, which connects only services that sign
in with OAuth. Connect UIS from the "Connectors" section.

## Connect from the Connectors section

1. In the sidebar, open "Connectors" and go to the "Marketplace" tab. UIS is in the "Call
   tracking" category.
2. On the "UIS" card, click "Connect". The "Connect UIS" page opens.
3. **"Auth".** First allow Palitra's address in the UIS cabinet, as described below. Then
   paste the key into the "API key" field. The hint under the field reads: "A UIS user's API key
   from Account → User management in your UIS cabinet." The key has its user's rights and sees
   only that user's sites. If a UIS key is already saved in Palitra, you can
   pick the existing credentials. Tick "Save at organization level" if you need the same key
   in other projects.
4. Click "Continue". Palitra asks UIS for the sites this key can see.
5. **"Select account".** In the "Choose sub-account" list, pick the site. Sites are listed by
   domain. The step appears even when there is only one site.
6. **"Review".** Check the settings and click "Finish". Palitra connects the connector and
   checks access.

If UIS returns no sites, the wizard shows a "Settings" step with a "Site ID" field instead of
the list. The hint under the field: "The numeric site ID in your UIS cabinet. The key reads only
the sites its user can see: for another site, connect the key of a user who sees it."

The site cannot be changed after connecting. To load another site, connect UIS again with
"Connect another" and pick that site.

UIS has no "Permissions", "Guardrails", "Auto-tagging" or "Event mapping" steps. How the wizard
works in general is described in the [connectors overview](/connectors/overview/).

### Allow Palitra's address

UIS accepts API calls only from addresses on its allowed list. On the "Auth" step, the wizard
shows the "Allow Palitra's address" block:

1. Copy the value from the "Address to allow" field with the "Copy" button.
2. Add it in the UIS cabinet. The block gives the path: "In the UIS cabinet: Administrator →
   Account → Security rules and settings → API."
3. Return to the wizard and continue connecting.

If the address is not on the list, UIS refuses the key. If the block says "Palitra has no fixed
address yet", the value shown allows API calls from any address.

The connector needs no notifications, webhooks or file uploads set up in the UIS cabinet.

## What data is loaded

For the chosen site, Palitra loads from UIS:

- calls, which become `phone_call` events, with the talk duration and whether the call was
  missed;
- requests, which become `submit_form` events, with the form type and name;
- chats, which become `chat_start` events, with the chat channel and the number of messages;
- deals, which become `purchase` events.

A deal is loaded only if it grew from a call, request or chat of this site. Each deal is one
purchase: Palitra takes its current stage and the revenue at that stage, in rubles. A deal
without revenue does not count as a purchase. When a deal moves to another stage, the purchase
is updated, not duplicated.

Each contact comes with its landing page, referrer, UTM parameters and search query. From them
Palitra works out the ad that brought the visitor: first by the
[Palitra Linker](/data/pixel/) in the link, then by UTM parameters and the referring site. This
is how calls and deals are linked to ad campaign spend.

To match a contact to a site visitor, Palitra uses the UIS visitor ID, the Metrika and Google
Analytics client IDs, and the phone and e-mail hashes.

Palitra does not store phone numbers or e-mails: on load they are replaced with hashes keyed
with the project's key. A value that does not look like a phone number or e-mail is not
stored.

UIS updates calls and requests after the fact, so each sync re-reads the last 30 days. Syncs
run automatically every 4 hours.

How to work with project events is described in [Events](/data/events/).

## What the agent can do

The UIS connector has no agent tools, so there is no "Permissions" step.

## Replace the key

If the UIS key has expired, been blocked or been reissued:

1. On the connector card, click the three dots and choose "Configure". The "UIS settings" page
   opens.
2. On the "Auth" step, click "Connect a different account" and paste the new key into the "API
   key" field.
3. Go to the "Review" step and click "Save".

If UIS has already stopped accepting the key and the credential's status is "Invalid — needs
Reconnect", you can also replace the key on the "Credentials" tab of "Connectors": click the
three dots on the UIS credential's row, choose "Reconnect", paste the new key and click "Save
key". This replaces the key in every connector on that credential. Palitra checks the key with
UIS before saving it. See the [connectors overview](/connectors/overview/#reconnect-a-credential).

## Common problems

### While connecting

The wizard shows errors on the "Auth" step, under the key field or above the form.

**"UIS refused the request: Palitra's address is not on the allowed list."** Add the address
from the "Allow Palitra's address" block in the UIS cabinet and try again.

**"UIS does not recognise this API key."** Copy the key again from the user management section
of your UIS cabinet.

**"This UIS API key has expired."** Issue a new key in the user management section of your UIS
cabinet and paste it into the field.

**"This UIS API key is blocked."** Unblock it or issue a new one in the user management section
of your UIS cabinet.

**"The UIS user this key belongs to has no access to reports."** A key has its user's rights.
Grant that user access in the user management section of your UIS cabinet, then try again.

**"Your UIS account is disabled."** Contact UIS support to restore the account, then try
again.

**"Couldn't load the accounts".** Palitra could not get the list of sites for the key. Click
"Try again". If it keeps failing, check the key.

**"This account no longer exists. Pick another one."** The chosen site was deleted in UIS. Pick
another site from the list. If every site is gone, the wizard returns you to the "Auth" step
with "The UIS key no longer reaches any account". Check the key's access in your UIS cabinet or
enter another key.

**"UIS could not read this site with this key. …"** Appears on the "Settings" step when you
entered the site ID yourself. Check the site ID and that the user the key belongs to can see the
site, or connect the key of a user who sees it.

**"This account is already connected in this project."** This site is already connected. Click
"Open the existing connector" or pick another site.

### After connecting

If something is wrong with the connector, an icon appears on its card in the "Connectors"
section. Hover over it to see what happened and what to do.

**"UIS refuses Palitra's requests: its address is not on the allowed list."** Palitra's address
was removed from the allowed list in the UIS cabinet. The hint under the message: "Add Palitra's
address in the UIS cabinet: Administrator → Account → Security rules and settings → API. The
address is shown in the connector settings on the "Auth" step. Then choose "Sync now" in the
connector card's menu — no need to reconnect the connector."

**"UIS no longer accepts the connector's API key."** The key is wrong, expired or blocked, or the
UIS account is disabled. [Replace the key](#replace-the-key) — the hint under the message
suggests the same route through "Configure". If the account is disabled, contact UIS support.

**"The connector has no access to this account."** The user the key belongs to has no rights to
reports or no longer sees the chosen site. Grant the rights in the UIS cabinet or
[replace the key](#replace-the-key) with the key of a user who sees the site.

**"The vendor's API limit is used up for now."** UIS limits requests per minute and per day. No
action is needed: the sync continues once the limit resets.

**"Part of your vendor account is disabled, so some data is not loaded."** The UIS account lacks
a component one of the reports needs. That data is not loaded, and the data loaded earlier is
kept. Enable the component in the UIS cabinet; the data loads on the next sync.

**"The vendor is retiring the API version Palitra uses."** Palitra will update the connector
before the cut-off. No action is needed unless this warning stays.

**"The last sync failed."** Palitra retries on the next sync. If it keeps failing, click "Sync
now" in the connector card menu or contact support.
