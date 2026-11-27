---
title: Desktop app
description: How to install Palitra on macOS or Windows, sign in, and connect to your company's own server.
editions: [saas, byoc]
sources:
  - palitra-desktop/src/main/app-menu.ts
  - palitra-desktop/src/main/menus.ts
  - palitra-desktop/src/main/tray.ts
  - palitra-desktop/src/main/window-title.ts
  - palitra-desktop/src/main/update-check.ts
  - palitra-desktop/src/main/server.ts
  - palitra-desktop/src/build-config.json
  - palitra-desktop/src/pages/server.html
  - palitra-desktop/src/pages/error.html
  - palitra-desktop/src/pages/update-required.html
  - palitra-desktop/src/pages/signin-bar.html
  - palitra-desktop/electron-builder.yml
  - palitra-frontend/app/oauth/callback/callback-client.tsx
  - palitra-frontend/components/auth/oauth-button.tsx
---

The Palitra desktop app opens the same Palitra as your browser: the same chats, projects and
data under your account. The app's own windows and menus are in Russian; the labels below are
quoted as the app shows them, with a translation. What it adds:

- **System notifications.** While the app window is minimised or closed, new notifications
  arrive as regular macOS or Windows notifications. Clicking one opens the app on the right
  page.
- **Unread count on the icon.** On macOS the Dock icon shows the number of unread
  notifications in the current project; on Windows a red dot appears on the taskbar icon.
- **Runs in the background.** Closing the window keeps the app running and sending
  notifications: on macOS it stays in the Dock, on Windows in the notification area next to
  the clock. «Выйти» (Quit) closes it completely.

## Install

Download the app from [ru.palitra.io/download](https://ru.palitra.io/download/):

| System                             | File                     |
| ---------------------------------- | ------------------------ |
| macOS, Mac with M1 or later        | `.dmg` for Apple Silicon |
| macOS, Mac with an Intel processor | `.dmg` for Intel         |
| Windows 10 and 11, 64-bit          | `.exe` installer         |

The app is not yet signed with an Apple or Microsoft certificate, so on first launch the
system asks you to confirm that you trust it. You do this once.

**macOS**

1. Open the `.dmg` and drag «Палитра» (Palitra) into Applications.
2. Launch «Палитра». macOS shows a warning: click Done.
3. Open System Settings → Privacy & Security, scroll to Security and click Open Anyway next to
   the message about «Палитра». The button is available for about an hour after the launch
   attempt.
4. Confirm with your Mac password and click Open.

**Windows**

1. Run `Palitra-Setup.exe`.
2. If "Windows protected your PC" appears, click More info, then Run anyway.
3. The app opens by itself once installed.

To start the app when you log in, turn on «Запускать при входе» (Launch at login) in the
icon's menu: on macOS, right-click the Dock icon; on Windows, right-click the icon in the
notification area.

## Sign in

You sign in the same ways as in the browser:

- **Email and password**: right in the app window.
- **Your organization's single sign-on (SSO)**: your company's sign-in page opens in the same
  window. A bar above it shows which site you are entering your password on and has an
  «Отменить вход» (Cancel sign-in) button.
- **Yandex**: in an app pop-up window, as in the browser.
- **Google**: in your browser, because Google does not allow signing in through windows
  embedded in apps. After you sign in, the browser shows "Вернитесь в приложение Палитра"
  (Return to the Palitra app) and the app opens already signed in. If it does not, click
  «Открыть Палитру» (Open Palitra) on the same page. Do not forward that link to anyone.

If your organization requires SSO, Google sign-in is not available: the browser says so, and
you sign in with SSO in the app.

## Server

By default the app connects to Palitra in the cloud. The server's name and address are in the
window title, for example «Палитра — app.ru.palitra.io».

If your company runs its own Palitra server, choose «Подключиться к другому серверу» (Connect
to another server):

- on macOS, in the **Палитра** menu in the menu bar, or by right-clicking the Dock icon;
- on Windows, in the app window's **Палитра** menu, or by right-clicking the icon in the
  notification area.

Enter the server address (for example `palitra.example.com`) and click «Подключиться»
(Connect). The app checks that Palitra runs at that address and remembers your choice. Only
secure (`https`) addresses are accepted. To go back to the cloud, use «Вернуться к Палитре RU»
(Back to Palitra RU) in the same place. Each server has its own sign-in.

## Updates

The app does not update itself. When a new version is out, you get a «Доступна новая версия»
(New version available) notification, and an item with the same name appears in the icon's
menu. Both open the download page: download the new version and install it over the current
one; you stay signed in.

## If something goes wrong

- **«Не удалось открыть Палитру» (Could not open Palitra).** The app could not reach the
  server: check your connection and click «Повторить» (Retry). If the server address is wrong,
  click «Сменить сервер» (Change server).
- **«Нужно обновить приложение» (Update required).** Your version of the app is too old for
  this server. Click «Скачать новую версию» (Download the new version) and install it over the
  current one.
