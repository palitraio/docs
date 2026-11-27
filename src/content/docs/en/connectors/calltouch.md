---
title: CallTouch
description: How to connect CallTouch, which calls, requests and deals Palitra loads, and how they are linked to ads.
editions: [saas, byoc]
sources:
  - palitra-backend/src/connectors/calltouch/vendor_manifest.yaml
  - palitra-backend/src/connectors/calltouch/calltouch/manifest.yaml
  - palitra-backend/src/connectors/calltouch/calltouch/extractor.py
  - palitra-backend/src/connectors/calltouch/calltouch/transformer.py
  - palitra-backend/src/connectors/calltouch/calltouch/_schemas.py
  - palitra-backend/src/connectors/calltouch/calltouch/_events.py
  - palitra-backend/src/connectors/calltouch/calltouch/_traffic.py
  - palitra-backend/src/connectors/calltouch/calltouch/_attribution.py
  - palitra-backend/src/connectors/calltouch/calltouch/_errors.py
  - palitra-backend/src/connectors/calltouch/calltouch/_dates.py
  - palitra-backend/src/connectors/_base/pii.py
  - palitra-backend/src/connectors/_base/traffic_source.py
  - palitra-backend/src/modules/data_layer/application/services/etl_service.py
  - palitra-frontend/lib/stores/connector-wizard-store.ts
  - palitra-frontend/lib/connectors/connect-settings.ts
  - palitra-frontend/components/onboarding/steps/step-connectors.tsx
  - palitra-frontend/components/connector-setup/wizard.tsx
  - palitra-frontend/components/connector-setup/wizard.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step.tsx
  - palitra-frontend/components/connector-setup/steps/auth-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step-reuse-picker.en.messages.json
  - palitra-frontend/components/connector-setup/steps/connector-settings-step.en.messages.json
  - palitra-frontend/components/connector-setup/steps/connector-settings-edit.en.messages.json
  - palitra-frontend/components/connector-setup/steps/review-step.tsx
  - palitra-frontend/components/connector-setup/steps/review-step.en.messages.json
  - palitra-frontend/components/connectors/connectors-tabs.en.messages.json
  - palitra-frontend/components/connectors/catalog-list.en.messages.json
  - palitra-frontend/components/connectors/catalog-connector-card.en.messages.json
  - palitra-frontend/components/connectors/connected-connector-card.en.messages.json
  - palitra-frontend/components/connectors/connector-issue-icon.tsx
  - palitra-frontend/components/connectors/connector-issue-icon.en.messages.json
  - palitra-frontend/components/connectors/use-connector-copy.en.messages.json
  - palitra-frontend/components/connectors/use-setting-copy.en.messages.json
---

The CallTouch connector loads calls, site requests and deals from one CallTouch site into
Palitra. Palitra joins them to the ads that produced them through the Palitra Linker. Phone
numbers and e-mails are stored only as hashes keyed with the project's key.

The connector only reads data: it changes nothing in CallTouch, and it has no agent tools.

## What to prepare in CallTouch

You need two things from Integrations → API in your CallTouch cabinet:

- the API token;
- the numeric site ID.

While there, check that API data transfer is on for the site and that the site is activated.
The login that owns the token must have access to the site.

One token opens every site its login can see, but one connector works with one site. For a
second site, connect CallTouch again: you can pick the token from the saved credentials.

## Connect

CallTouch is connected from the Connectors section (the setup wizard after sign-up does not
offer it).

1. In the sidebar, open "Connectors" and go to the "Marketplace" tab. CallTouch is in the "Call
   Tracking" category.
2. On the "CallTouch" card, click "Connect". The "Connect CallTouch" page opens.
3. **"Auth".** Paste the token into the "API token" field. If a CallTouch token is already
   saved in Palitra, you can pick it from the "Existing credentials" list. Tick "Save at
   organization level" if you need the same token in other projects.
4. **"Settings".** Fill in:
   - "Site ID" — the numeric site ID from Integrations → API. Marked "Fixed after
     connecting.";
   - "Attribution model" — "Last interaction" (the default) or "Last non-direct interaction".
     See below.
5. **"Review".** Check the settings and click "Finish". Palitra connects the connector and tests
   access by reading the site's calls journal for today.

The connector appears on the "Connectors" tab under a name with the site ID, such as
"CallTouch — сайт 12345".

The general wizard steps are described in the [connectors overview](/connectors/overview/).

## Attribution model

The "Attribution model" setting tells CallTouch which visit to credit a call to when it reports
the call's source:

- "Last interaction";
- "Last non-direct interaction".

Keep "Last interaction" unless you reconcile with CallTouch reports: Palitra applies its own
attribution model on top.

You can change the model later in the connector's settings, on the "Settings" step. Once you
save, the connector's data for the full sync window loads again, because every stored row
records the model it was read with.

## What data is loaded

Palitra loads from the chosen CallTouch site:

- **calls** — time, duration, whether the call was answered, whether it was the caller's first
  and whether it was a target call, the tracking number called, tags and linked deals;
- **requests** from site forms — time, form, page, unique and target flags, device, tags and
  linked deals;
- **deals** — status, funnel, amount, margin, currency, products and tags;
- **visits** of the visitor before and after a call or request.

Every row carries the visit's source: the landing page, the referrer, UTM tags, and the source,
medium and campaign Palitra worked out.

Calls, requests and deals become project events:

- a call becomes a `phone_call` event;
- a request becomes a `submit_form` event;
- a deal with an amount above zero that was not deleted becomes a `purchase` event with that
  amount.

Visits do not become events; they are stored for analysis only.

Palitra syncs every 4 hours. CallTouch keeps revising calls and requests for weeks: it changes
tags and the target flag and links deals later. So every sync re-reads the last 30 days.

### Linking to ads

When a visitor came from an ad whose link Palitra tagged, the call or request is linked to the
campaign, ad group and ad through the Palitra Linker, and so to the ad spend. Without Palitra's
tag, the source comes from UTM tags, then from the referrer; otherwise the visit counts as
direct. Ad connectors tag links — see auto-tagging in
[Yandex Direct](/connectors/yandex-direct/).

### Phone numbers and e-mails

Phone numbers and e-mail addresses do not reach Palitra as they are. Before storing, Palitra
replaces them with a hash keyed with the project's key. The hash lets you recognise the same
person across calls, requests and deals, while the number or address itself does not appear in
the data.

## Common problems

### While connecting

When CallTouch refuses, the wizard takes you back to the step at fault and shows a hint under
the field.

**"CallTouch rejected the token: it is wrong, inactive or was reissued."** Copy the current
token from Integrations → API and paste it again, or choose another saved one.

**"CallTouch has no site with this ID."** Use the site ID shown in Integrations → API in your
CallTouch cabinet.

**"The login that issued the token has no access to this site."** Give that login access to
the site in your CallTouch cabinet.

**"API data transfer is off for this site."** Switch it on in Integrations → API in your
CallTouch cabinet.

**"This site is not activated in CallTouch."** Activate it in your CallTouch cabinet.

**"This is already connected in the project as “…”."** This site is already connected in the
project. Click "Open the connected connector", or delete it and connect again.

### After connecting

If something is wrong with the connector, an icon appears on its card in the "Connectors"
section. Hover over it to see what happened and what to do.

**"Sign-in has expired."** CallTouch no longer accepts the token — for example, it was
reissued. On the connector card, click the three dots and choose "Configure". On the "Auth"
step, click "Connect a different account", paste the current token into the "API token" field,
then click "Save" on the "Review" step.

**"The connector has no access to this account."** The token's login lost access to the site,
API data transfer was switched off, or the site was deactivated. Fix it in your CallTouch
cabinet.

**"The vendor's API limit is used up for now."** CallTouch limits API requests. No action is
needed: the sync continues by itself once the limit resets.

**"The last sync failed."** Palitra retries on the next sync. If it keeps failing, click "Sync
now" in the connector card's menu or contact support.
