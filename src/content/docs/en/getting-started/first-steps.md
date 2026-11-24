---
title: First steps
description: How to go through the setup wizard after you sign up — from your organization to inviting your team.
editions: [saas, byoc]
sources:
  - palitra-frontend/components/onboarding/onboarding-wizard.tsx
  - palitra-frontend/components/onboarding/onboarding-wizard.en.messages.json
  - palitra-frontend/components/onboarding/connect-dialog.tsx
  - palitra-frontend/components/onboarding/connect-dialog.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-welcome.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-org.tsx
  - palitra-frontend/components/onboarding/steps/step-org.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-payment.tsx
  - palitra-frontend/components/onboarding/steps/step-payment.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-project.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-connectors.tsx
  - palitra-frontend/components/onboarding/steps/step-connectors.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-events.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-attribution.tsx
  - palitra-frontend/components/onboarding/steps/step-attribution.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-media-plan.tsx
  - palitra-frontend/components/onboarding/steps/step-media-plan.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-invite.en.messages.json
  - palitra-frontend/components/onboarding/steps/step-done.tsx
  - palitra-frontend/components/onboarding/steps/step-done.en.messages.json
  - palitra-frontend/components/org-settings/org-invite-dialog.en.messages.json
  - palitra-frontend/components/connectors/connectors-tabs.en.messages.json
---

After you sign up, Palitra opens the setup wizard. It walks you through creating your
organization and first project, connecting platforms, and inviting colleagues.

The wizard header shows which step you are on, for example "Step 1 of 10". The number of steps
changes: some steps appear only once everything they need is in place. Each step has "Back" and
"Continue" buttons at the bottom. You can skip optional steps with "Skip".

## Welcome

The first screen is "Welcome to Palitra". It briefly explains what comes next. Click
"Continue".

## Organization

On the "Set up your organization" step:

1. Enter the "Organization name". This is how your team will see it.
2. Choose the "Organization type":
   - "Agency" if you run several client projects;
   - "In-House" if you work on a single brand.
3. Click "Continue".

If you already created an organization and come back to the wizard, it opens the project step
straight away.

If the step shows a message that this installation has one organization, you cannot create a
new one. Ask its administrator to send you an invitation.

## Payment method

On the "Add a payment method" step:

1. Click "Add card" and enter your card details.
2. When "Trial active — you're all set." appears, click "Continue".

If you have a promo code, click "I have a promo code" and enter it.

To deal with payment later, click "Set up later". The wizard closes and opens your
organization's billing page.

## Project

A project is a separate workspace for one client or brand. On the "Create your first project"
step:

1. Enter the "Project name". You cannot continue without it.
2. Optionally fill in "Instructions": describe the business, goals and constraints. The agent
   takes these instructions into account in every answer within the project. You can edit them
   later in project settings.
3. Click "Continue".

## Platforms

On the "Connect your platforms" step, choose the ad accounts and analytics Palitra will work
with. Use search to find a platform.

1. On the platform's card, click "Connect".
2. In the "Connect Yandex.Direct" window (or the window for another platform), click
   "Authorize".
3. Sign in to the platform in the pop-up window and allow access.
4. If Palitra shows a list of accounts, pick the one you need and click "Connect".

A connected card is marked with a check mark. To remove a platform, click "Disconnect".

This step shows only platforms you connect by signing in to your account. You connect the
others later, on the "Marketplace" tab of the "Connectors" section. Platforms connected in the
wizard use default settings — you can change them in the "Connectors" section.

More: [Yandex.Direct](/en/connectors/yandex-direct/),
[Yandex.Metrika](/en/connectors/yandex-metrika/).

## Events

On the "Configure events" step, choose the conversion templates you want to track. You can
pick several:

- "E-commerce"
- "Lead Generation"
- "SaaS / Subscriptions"
- "Mobile App"
- "Offline"
- "Affiliate"

You can add your own events and change the templates later in project settings.

## Attribution

The "Attribution settings" step appears only if you connected an analytics platform, such as
Yandex.Metrika, on the platforms step.

- "Attribution window" — how many days back to look for events before a conversion.
- "Default attribution model" — the model Palitra uses by default in chat answers, dashboards
  and workflow triggers.
- "Attribution models" — the models to compute.

Some models may be unavailable and show a lock. Such a model needs more data and conversions —
the tooltip on the lock tells you how many.

## Media plan

On the "Upload media plan" step, upload your monthly media plan. It tells the agent your budget
and KPI targets per channel.

1. Drop a file onto the upload area, or click it and choose a file. The accepted files are
   described under the prompt: "Supports .xlsx, .csv (max 10 MB)".
2. Wait while Palitra reads the file and shows how many rows it recognized.
3. If the month could not be detected from the file, or it has already passed, choose the
   "Plan month".

The columns Palitra expects in the file are listed under the upload area.

## Team

On the "Invite your team" step:

1. Enter a colleague's address in the "Email addresses" field.
2. Click "Add". Repeat for each colleague.

Invitations are sent when you finish the wizard. Invitees join the organization as "Member" and
get access to the new project as "Viewer". You can also invite people later from organization
settings.

## Done

On the last step, Palitra carries out everything you chose and reports on each item:
"Organization created", "Project created", "Connectors configured" and so on.

If an item failed, the heading changes to "Almost there". The item shows an explanation and, if
trying again can help, a "Retry" button. You can set up failed items later in project settings.

Click "Finish" to go to the chat with the agent.
