---
title: For owners and admins
description: How to manage your organization in Palitra — members, roles and projects.
editions: [saas, byoc]
sources:
  - palitra-frontend/app/[locale]/(app)/org/settings/layout.tsx
  - palitra-frontend/app/[locale]/(app)/org/settings/org-settings.en.messages.json
  - palitra-frontend/components/layout/AppSidebar.tsx
  - palitra-frontend/components/layout/app-sidebar.en.messages.json
  - palitra-frontend/components/layout/project-switcher.tsx
  - palitra-frontend/components/layout/project-switcher.en.messages.json
  - palitra-frontend/components/org-settings/create-project-dialog.en.messages.json
  - palitra-frontend/components/org-settings/org-invite-dialog.en.messages.json
  - palitra-frontend/components/org-settings/org-member-list.en.messages.json
  - palitra-frontend/components/org-settings/org-role-change-dialog.en.messages.json
  - palitra-frontend/lib/types/auth.ts
---

This article is for people who run the organization: they create projects and decide who has
access to what.

## Organization roles

Everyone in the organization has one of these roles:

- "Owner" — manages the whole organization. Only the owner changes members' roles and sees the
  "Single Sign-On" tab.
- "Admin" — manages members, projects and AI settings.
- "Member" — works only in the projects they have been given access to.

Inside a project, a member also has a project role: "Manager", "Viewer" or "Guest". For work
inside a project, see [For project managers](/en/getting-started/manager/).

## Organization settings

Click your name at the bottom of the sidebar and choose "Organization settings". Only owners
and admins have this item. The settings have these tabs:

- "General"
- "Members"
- "Single Sign-On" — owner only
- "Projects"
- "Billing"

## Invite members

1. Open "Organization settings" → "Members".
2. Click "Invite members".
3. Enter the person's email.
4. Choose the "Organization role": "Admin" or "Member".
5. Under "Project access", select projects and the role in each.
6. Click "Send invitation".

A person can belong to only one organization. If they already work in another organization,
invite them to a project as a guest.

## Change a role or remove a member

On the "Members" tab, open the actions menu next to the person:

- "Change role" — switch the role to "Admin" or "Member". Only the owner can do this.
- "Remove from organization" — the person loses access to every project in the organization.
- "Transfer ownership" — the chosen person becomes the owner, and you become an admin.

## Create a project

A project is a separate workspace for one client or brand. Owners and admins can create
projects.

1. Open the project list at the top of the sidebar and choose "New project". Or click "New
   project" on the "Projects" tab of organization settings.
2. Enter the "Project name".
3. Click "Create project".

Next, connect ad accounts and analytics to the project:
[Yandex.Direct](/en/connectors/yandex-direct/), [Yandex.Metrika](/en/connectors/yandex-metrika/).
