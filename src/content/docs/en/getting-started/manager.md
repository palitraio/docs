---
title: For project managers
description: How to work in a project — sections, chatting with the agent, approving actions and members.
editions: [saas, byoc]
sources:
  - palitra-frontend/lib/auth/roles.ts
  - palitra-frontend/lib/types/auth.ts
  - palitra-frontend/components/layout/app-sidebar.en.messages.json
  - palitra-frontend/components/layout/project-switcher.tsx
  - palitra-frontend/components/layout/project-switcher.en.messages.json
  - palitra-frontend/app/[locale]/(app)/projects/[projectId]/settings/layout.tsx
  - palitra-frontend/app/[locale]/(app)/projects/[projectId]/settings/project-settings.en.messages.json
  - palitra-frontend/components/chat/ApprovalCard.tsx
  - palitra-frontend/components/chat/chat-agent.en.messages.json
  - palitra-frontend/components/chat/chat-composer.en.messages.json
  - palitra-frontend/components/project-settings/project-add-member-dialog.tsx
  - palitra-frontend/components/project-settings/project-add-member-dialog.en.messages.json
  - palitra-frontend/components/layout/AppSidebar.tsx
  - palitra-frontend/components/project-settings/project-member-list.en.messages.json
  - palitra-frontend/app/[locale]/(app)/chat/page.tsx
  - palitra-frontend/app/[locale]/(app)/chat/[chatId]/page.tsx
---

This article is for people who run a project: they talk to the agent, connect ad accounts and
set up the project.

## Project roles

Everyone in a project has one of these roles:

- "Manager" — changes project settings, connectors, workflows, media plans and data.
- "Viewer" — sees the project but cannot change its settings.
- "Guest" — someone from outside your organization. They get an email invitation and access to
  this project only.

The organization's owner and admins can change any project, just like a manager.

## Project sections

You pick a project in the list at the top of the sidebar. Below it are the project's sections:

- "Chats"
- "Artifacts"
- "Workflows"
- "Connectors"
- "Data"
- "Jobs"
- "Skills"
- "Media Plans"
- "Action Logs"

## Chat with the agent

1. Click "New chat".
2. Type a question or a task in the input box. To see the commands, type `/`.

The agent answers from the project's data and can take actions in connected ad accounts.

## Approving actions

When the agent wants to change something in an ad account, it may ask you first. A card with
the action appears in the chat. You can:

- "Approve" — carry out the action;
- "Edit" — adjust the action's parameters, then "Approve edited";
- "Reject" — do not carry it out.

Some actions have two more buttons:

- "Allow in this chat" — stop asking about this action in the current chat;
- "Always allow" — stop asking in the whole project, including background tasks. You can revoke
  this in the connector settings.

If you can approve actions, you can choose the "Approval mode" in the input box:

- "Ask" — the agent asks before each change in your accounts;
- "Auto" — the agent carries out changes that match your requests on its own. It always asks
  about deletions.

## Project settings

To open "Project settings", click the gear icon next to the project name at the top of the
sidebar. The settings have these tabs:

- "General"
- "Instructions & context" — what the agent should know about the project
- "Members"
- "Notifications"
- "Domains"

## Project members

1. Open "Project settings" → "Members".
2. Click "Add members".
3. Choose a role: "Manager", "Viewer" or "Guest".
4. Pick people or enter an email.
5. Click "Invite".

Managers and viewers are picked from organization members. If the person is not in the
organization yet, invite them as "Guest". Only the owner or an admin can invite a new person to
the organization and the project at once.

To connect ad accounts to the project: [Yandex.Direct](/en/connectors/yandex-direct/),
[Yandex.Metrika](/en/connectors/yandex-metrika/).
