---
title: Adjust
description: How to connect Adjust, set up callbacks and the cloud storage upload, what data Palitra loads, and what the agent can do.
editions: [saas, byoc]
sources:
  - palitra-backend/src/connectors/adjust/vendor_manifest.yaml
  - palitra-backend/src/connectors/adjust/adjust/manifest.yaml
  - palitra-backend/src/connectors/adjust/adjust/extractor.py
  - palitra-backend/src/connectors/adjust/adjust/_aggregates.py
  - palitra-backend/src/connectors/adjust/adjust/_apps.py
  - palitra-backend/src/connectors/adjust/adjust/_template.py
  - palitra-backend/src/connectors/adjust/adjust/_channels.py
  - palitra-backend/src/connectors/adjust/adjust/_attribution.py
  - palitra-backend/src/connectors/adjust/adjust/_pii.py
  - palitra-backend/src/connectors/adjust/adjust/_schemas.py
  - palitra-backend/src/connectors/adjust/adjust/_errors.py
  - palitra-backend/src/connectors/adjust/adjust/push_receiver.py
  - palitra-backend/src/connectors/adjust/adjust/upload_receiver.py
  - palitra-backend/src/connectors/adjust/adjust/source_event_discoverer.py
  - palitra-backend/src/connectors/adjust/adjust/tools/_generic.py
  - palitra-backend/src/connectors/adjust/adjust/_endpoints.py
  - palitra-backend/src/modules/data_layer/application/services/connector_upload_expiry_service.py
  - palitra-frontend/lib/stores/connector-wizard-store.ts
  - palitra-frontend/lib/connectors/connect-settings.ts
  - palitra-frontend/components/onboarding/steps/step-connectors.tsx
  - palitra-frontend/components/billing/feature-gates.ts
  - palitra-frontend/components/billing/feature-gates.en.messages.json
  - palitra-frontend/components/billing/feature-lock.tsx
  - palitra-frontend/components/billing/feature-lock-state.en.messages.json
  - palitra-frontend/components/connectors/catalog-connector-card.tsx
  - palitra-frontend/components/connectors/catalog-connector-card.en.messages.json
  - palitra-frontend/components/connectors/catalog-list.en.messages.json
  - palitra-frontend/components/connectors/connectors-tabs.en.messages.json
  - palitra-frontend/components/connectors/use-connector-copy.en.messages.json
  - palitra-frontend/components/connectors/use-setting-copy.en.messages.json
  - palitra-frontend/components/connectors/use-trigger-copy.en.messages.json
  - palitra-frontend/components/connectors/use-tool-copy.en.messages.json
  - palitra-frontend/components/connectors/connector-push-panel.tsx
  - palitra-frontend/components/connectors/connector-push-panel.en.messages.json
  - palitra-frontend/components/connectors/connector-uploads-panel.tsx
  - palitra-frontend/components/connectors/connector-uploads-panel.en.messages.json
  - palitra-frontend/components/connectors/connector-channel-badge.en.messages.json
  - palitra-frontend/components/connectors/connector-issue-icon.tsx
  - palitra-frontend/components/connectors/connector-issue-icon.en.messages.json
  - palitra-frontend/components/connectors/credentials-list.tsx
  - palitra-frontend/components/connectors/credentials-list.en.messages.json
  - palitra-frontend/components/connectors/rotate-key-dialog.tsx
  - palitra-frontend/components/connectors/rotate-key-dialog.en.messages.json
  - palitra-frontend/components/connectors/disconnect-actions-dialog.en.messages.json
  - palitra-frontend/app/[locale]/(app)/projects/[projectId]/connectors/[connectorId]/page.tsx
  - palitra-frontend/components/connector-setup/wizard.en.messages.json
  - palitra-frontend/components/connector-setup/use-account-list.ts
  - palitra-frontend/components/connector-setup/steps/auth-step.tsx
  - palitra-frontend/components/connector-setup/steps/auth-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/select-account-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/tool-permissions-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/connector-settings-edit.en.messages.json
  - palitra-frontend/components/connector-setup/steps/event-mapping-step.tsx
  - palitra-frontend/components/connector-setup/steps/event-mapping-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/review-step.tsx
  - palitra-frontend/components/connector-setup/steps/review-step.en.messages.json
---

The Adjust connector loads one mobile app's data into Palitra: installs, re-engagements, in-app
events, ad revenue, subscriptions and uninstalls. This data comes from Adjust through server
callbacks and the cloud storage upload; the app's daily statistics come through the sync.
Advertising device IDs, e-mails and phones are stored only as hashes. The agent gets tools for
working with the Adjust account.

Connecting has two parts: first you connect the connector in Palitra, then you set up the
callbacks and the upload in your Adjust dashboard.

## Plan availability

Mobile trackers are not available on every plan. If your plan does not include them, the Adjust
card in the marketplace shows "Available on Pro" and its "Connect" button is disabled. Click it
to see "Mobile trackers aren't included in your plan" and an "Upgrade plan" button. See
[Billing](/organization/billing/).

The setup wizard after sign-up does not offer Adjust: connect it from the Connectors section.

## Connect from the Connectors section

1. In the sidebar, open "Connectors", go to the "Marketplace" tab and pick the "Mobile tracker"
   category.
2. On the "Adjust" card, click "Connect". The "Connect Adjust" page opens.
3. **"Auth".** Paste the tokens from your Adjust dashboard:
   - "API token" — required. In Adjust it is under Account settings → My profile → API Token.
     If you sign in to Adjust with SSO, the dashboard shows no token: ask your Adjust
     representative or support@adjust.com.
   - "S2S token" — optional. Only the agent tools that send server-side events and user data
     deletion requests need it.

   Click "Continue": Palitra loads the apps this token can see.

4. **"Select account".** In the "Choose the app" list, pick the app. One connector loads one
   app; for another app of the same token, connect another connector.
5. **"Permissions".** For each agent tool, choose "Always Allow", "Needs Approval" or
   "Blocked".
6. **"Review".** Check the settings and click "Finish". Palitra connects the connector and tests
   access.
7. **"Event mapping".** This step comes after the connector is connected. See below.

The app cannot be changed after connecting: "To change the app, delete the connector and connect
it again."

General wizard rules, saving credentials at organization level and reusing saved tokens are
covered in the [connectors overview](/connectors/overview/).

## Event mapping

Here you map Adjust in-app events to project events. The list comes from the app's settings in
Adjust and from the events that have already arrived. An event is recognised by its Adjust
token, so renaming it in Adjust does not break the mapping.

Installs, re-engagements, ad impressions, subscriptions and uninstalls are always imported —
there is nothing to map for them. For in-app events:

- while nothing is mapped, every event is imported under its own name;
- once you map at least one event, events without a mapping are not imported.

Click "Save mapping" or "Skip for now". You can come back to this step later in the connector's
settings.

## Setup in Adjust after connecting

Palitra does not request device data from Adjust: Adjust sends it. So after connecting, set up
the callbacks and, optionally, the cloud storage upload in your Adjust dashboard.

Everything you need is on the connector's settings page: in "Connectors", click the Adjust
connector's name. The "Push" and "Cloud storage upload" cards are shown only to project managers
and above, since they hold secret URLs and keys.

### Callbacks

The "Push" card has the "Add the callbacks in Adjust by hand" block with a list of triggers:
"Install", "Reinstall", "Reattribution", "Reattribution with reinstall", "In-app event", "Ad
revenue", "Subscription", "Uninstall", "Attribution update", "Forgotten user (GDPR)". Each
trigger has two copy buttons: the URL and the request body. The URLs are masked; click "Reveal"
to see them.

For each trigger:

1. In Adjust, open AppView → All apps → your app → Data management → Server callbacks → Add
   callback.
2. Pick the trigger in Callback trigger.
3. Paste the URL into Server endpoint.
4. Choose POST in Request method.
5. Paste the request body.

Above the list, the channel's state is shown: "Waiting for the first message", "Working" or
"Working with gaps". If Palitra rejects messages, the card shows "… messages rejected: a wrong
token or another app."

Palitra stores callbacks from Adjust's sandbox, but they never become project events.

### Cloud storage upload

The upload is optional and recommended: it refills what callbacks missed — Adjust resends a
failed callback for only 24 hours.

The "Cloud storage upload" card holds the values to enter: "Bucket URL", "Access key ID",
"Secret access key", "CSV definition" and the "Triggers" list. In Adjust:

1. Open AppView → All apps → your app → Data management → Cloud storage upload → Configure →
   New setup.
2. Pick Custom S3 as the Storage provider.
3. Fill in Access key ID, Secret access key and Bucket URL. Leave Region empty.
4. Under Triggers, tick the triggers listed on the card.
5. Paste the CSV definition whole and unchanged: Palitra can't read files written with an
   edited CSV definition.
6. Click Save and apply.

The card shows how many files wait to be imported and a "Files not imported" list with the
reasons. Uploaded files are kept at most 7 days. If the card says "The CSV definition changed —
copy it into Adjust again: files are not imported while the old one stays there.", copy the new
CSV definition into Adjust.

Each app needs its own connector and its own storage: Palitra does not import another app's
files.

### Changing the token and the key

You can replace the callback URL and the storage key with "Change the URL's token" on the
"Push" card and "Change storage key" on the upload card. The old value stops
working at once, and Adjust is not told: right after the change, paste the new URLs or key into
Adjust's settings, or its callbacks are refused and its uploads fail.

## What data is loaded

Through callbacks and the cloud storage upload, Palitra receives activity on devices:

- installs and reinstalls, reattributions, uninstalls;
- in-app events;
- ad revenue and subscriptions;
- attribution updates — stored, but they create no project events.

Installs, re-engagements, ad impressions, subscriptions and uninstalls become project events;
in-app events become them through the mapping. Device data is kept for 90 days.

If an Adjust link is tagged with the `palitra` parameter (Palitra's tag), the install is linked
to the ad by that tag; without it, by Adjust's attribution.

Through the sync, Palitra loads the app's daily statistics in the connector's time zone — by
partner, network, campaign, ad group, creative and OS, and by country: installs, clicks,
impressions, sessions, reattributions, reinstalls, uninstalls, events, revenue events,
revenue, ad revenue, cost and SKAdNetwork installs. The sync runs every 6 hours; the first one
loads the last 400 days.

After every sync, Palitra compares the installs and events that came through callbacks and the
upload with Adjust's daily statistics, and warns when device rows fall noticeably short.

### Personal data

Advertising device IDs are stored only as hashes. Palitra takes the app's user ID from the
callback parameter the app sets in the Adjust SDK. If it holds an e-mail or a phone, only its
hash is stored. When Adjust reports an erased user (the "Forgotten user (GDPR)" trigger),
Palitra deletes that device's data.

## Connector settings

After connecting, the connector's settings have a "Settings" step:

- "Report time zone (UTC±)" — the time zone Adjust counts report days in. On connecting, it is
  set to the project's time zone. "Changing it reloads the connector's recent data (the full
  sync window)."
- "App user ID parameter" — the Adjust SDK callback parameter in which the app passes its user
  ID. Empty means `user_id`. This parameter is part of the CSV definition: after changing it,
  copy the CSV definition from the upload card into Adjust again.
- "App" — fixed after connecting.

Save the changes on the "Review" step with "Save".

## What the agent can do

The agent works with Adjust through tools. Their list and permissions are on the "Permissions"
step.

**Reading and reports.** Always allowed by default. For example: "App statistics", "Pivot
report", "Report as CSV", "List apps", "App details", "App settings", "List tracker links",
"List partners", "Device details", "Deep link quota", "QR code image".

**Changes.** Need your approval by default. For example: "Create tracker link", "Update tracker
link", "Block tracker link", "Create deep link", "Create app", "Update app", "Create app events",
"Update SDK signature settings".

**Irreversible actions.** Also need approval; what they remove or revoke cannot be restored:
"Forget test device", "Request user data erasure", "Revoke SDK secret", "Revoke outdated SDK
secrets".

"Send event from server", "Send session from server", "Send ad revenue from server", "Set
third-party data sharing" and "Request user data erasure" work only if the "S2S token" is saved
in the credential.

## Disconnecting

Palitra cannot remove the callbacks and the cloud storage upload from Adjust itself. When you
delete the connector, the "Adjust is disconnected" window lists what to do in Adjust by hand:
remove Palitra's callbacks and turn off the Custom S3 upload. Do the steps and click "Done".

## Common problems

If something is wrong with the connector, an icon appears on its card in the "Connectors"
section. Hover over it to see what happened and what to do. The same messages are shown on the
connector's page, with the links "Open the Push panel" and "Open the cloud storage card".

**"Adjust did not accept the token. Copy it again from Account settings → My profile → API
Token."** The token was pasted wrong or no longer works. Copy it again.

**"Adjust no longer accepts the connector's API token."** The hint under the message: "Issue a
new token in Adjust and replace it: choose “Configure” in the connector's menu, click “Connect a
different account” on the “Auth” step, paste the new API token and click “Save” on the “Review”
step."

If the credential's status is "Invalid — needs Reconnect", you can also replace the key on the
"Credentials" tab of "Connectors": click the three dots on the Adjust credential's row, choose
"Reconnect", paste the new API token and click "Save key". This replaces the key in every connector
on that credential. See the [connectors overview](/connectors/overview/#reconnect-a-credential). If
you use the S2S token, paste it in the dialog too, or it is removed.

**"The token's user has no access to this app: ask an Adjust administrator to grant it."** or
**"The connector has no access to this account."** The user whose token you pasted cannot see
the app. Ask your Adjust administrator to grant access.

**"This app is not visible with this token."** Pick another app, or paste the token of a user
who can see the one you need.

**"This app is already connected in this project as “…”."** One app cannot be connected to a
project twice. Open the connector that is already connected.

**"No push messages for a long time, though the vendor sees new installs."** Check in Adjust
that the callbacks from the "Push" card are added for every trigger.

**"Palitra could not read some push messages."** Compare the callbacks in Adjust with the
"Push" card: URL, POST method and body. If the warning repeats, contact support.

**"Incoming data lacks fields the vendor should fill in."** The callbacks or the CSV definition
in Adjust differ from the ones Palitra issued. Copy the values from the connector's cards into
Adjust again.

**"Device data holds fewer rows than the vendor's reports."** Some callbacks did not arrive. The
cloud storage upload refills such gaps: check that it is set up.

**"No cloud storage files arrive, while callbacks do."** Compare the upload setup in Adjust
with the "Cloud storage upload" card.

**"Some uploaded files were not imported."** The cloud storage card lists the files not
imported and why. A common reason: "the CSV definition differs from the one Palitra issued".

**"Uploaded files wait to be imported."** or **"Uploaded files near deletion without being
imported."** Palitra imports the files on its own. If the warning stays, contact support.

**"The last sync failed."** Palitra retries on the next sync. If it keeps failing, start a sync
manually or contact support.
