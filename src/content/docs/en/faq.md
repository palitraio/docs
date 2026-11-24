---
title: FAQ
description: Short answers to common questions about setting up and working in Palitra.
editions: [saas, byoc]
sources:
  - palitra-frontend/components/onboarding/onboarding-wizard.tsx
  - palitra-frontend/components/onboarding/onboarding-wizard.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-attribution.en.messages.json
  - palitra-frontend/components/chat/chat-composer.en.messages.json
  - palitra-frontend/components/org-settings/org-invite-dialog.en.messages.json
  - palitra-frontend/components/connectors/connected-connector-card.tsx
  - palitra-frontend/components/connectors/connected-connector-card.en.messages.json
  - palitra-frontend/components/layout/AppSidebar.tsx
  - palitra-frontend/components/layout/app-sidebar.en.messages.json
  - palitra-frontend/app/[locale]/(app)/projects/[projectId]/settings/project-settings.en.messages.json
  - palitra-backend/src/connectors/yandex/yandex_direct/manifest.yaml
  - palitra-frontend/app/[locale]/(app)/chat/page.tsx
  - palitra-frontend/app/[locale]/(app)/chat/[chatId]/page.tsx
---

## Can I skip steps in the setup wizard?

Yes, the optional ones. They have a "Skip" button — you can set up anything you skipped later.
The organization, payment and project steps have no such button. You can leave the
payment step with "Set up later": the wizard opens the billing page.

## Why is there no "Attribution settings" step in the wizard?

This step appears only if you connected an analytics platform, such as Yandex.Metrika. Go back
to the "Connect your platforms" step and connect one.

## Will the agent change my campaigns without telling me?

Not by default. Changes in Yandex.Direct need your approval, and deletion is off in the connector's
guardrails. If you can approve actions, you can choose "Auto" in the "Approval mode" menu of the
chat input. The agent then carries out changes that match your requests on its own, but it still
asks about deletions. See [For project managers](/en/getting-started/manager/).

## How do I invite someone who already works in another organization?

A person can belong to only one organization. Invite them to the project they need as "Guest".

## What happens to the data if I delete a connector?

Syncs and tool calls stop immediately, and the data already loaded is kept and stays available.
To connect the account again, add it from the "Marketplace" tab.

## Where do I change the agent's instructions?

Open "Project settings" → "Instructions & context".

## Why don't I see "Organization settings"?

Only the organization's owner and admins have this item. If you need access, ask them.
