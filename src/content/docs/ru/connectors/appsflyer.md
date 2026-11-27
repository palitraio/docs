---
title: AppsFlyer
description: Как подключить AppsFlyer, какие данные загружает Палитра, как работает Push и что умеет агент.
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
  - palitra-frontend/components/connectors/catalog-connector-card.ru.messages.json
  - palitra-frontend/components/billing/feature-gates.ts
  - palitra-frontend/components/billing/feature-gates.ru.messages.json
  - palitra-frontend/components/billing/feature-lock.tsx
  - palitra-frontend/components/billing/feature-lock-state.ru.messages.json
  - palitra-frontend/components/onboarding/steps/step-connectors.tsx
  - palitra-frontend/components/connector-setup/wizard.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step.tsx
  - palitra-frontend/components/connector-setup/steps/auth-step.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step-reuse-picker.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/select-account-step.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/tool-permissions-step.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/review-step.tsx
  - palitra-frontend/components/connector-setup/steps/review-step.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/event-mapping-step.tsx
  - palitra-frontend/components/connector-setup/steps/event-mapping-step.ru.messages.json
  - palitra-frontend/app/[locale]/(app)/projects/[projectId]/connectors/[connectorId]/page.tsx
  - palitra-frontend/components/connectors/connector-push-panel.tsx
  - palitra-frontend/components/connectors/connector-push-panel.ru.messages.json
  - palitra-frontend/components/connectors/disconnect-actions-dialog.ru.messages.json
  - palitra-frontend/components/connectors/connectors-tabs.ru.messages.json
  - palitra-frontend/components/connectors/connected-connector-card.ru.messages.json
  - palitra-frontend/components/connectors/connector-issues-list.tsx
  - palitra-frontend/components/connectors/connector-issue-icon.tsx
  - palitra-frontend/components/connectors/connector-issue-icon.ru.messages.json
  - palitra-frontend/components/connectors/credentials-list.tsx
  - palitra-frontend/components/connectors/credentials-list.ru.messages.json
  - palitra-frontend/components/connectors/rotate-key-dialog.tsx
  - palitra-frontend/components/connectors/rotate-key-dialog.ru.messages.json
  - palitra-frontend/components/connectors/use-connector-copy.ru.messages.json
  - palitra-frontend/components/data-pipeline/attribution/attribution-windows.ru.messages.json
---

Коннектор AppsFlyer загружает в Палитру установки, повторные вовлечения, удаления и события в
приложении из одного приложения AppsFlyer и связывает их с рекламой через атрибуцию AppsFlyer
или Линкер Палитры. Агент получает доступ к отчётам и настройкам аккаунта AppsFlyer.
Рекламные идентификаторы устройств, e-mail и телефоны хранятся только в виде хешей.

## Тариф Палитры

AppsFlyer — мобильный трекер, а мобильные трекеры доступны на тарифе Pro и выше. На тарифе
ниже у карточки «AppsFlyer» в маркетплейсе есть отметка «Доступно на Pro», а кнопка
«Подключить» неактивна. Нажмите на неё — появится подсказка «Мобильные трекеры не входят в ваш
тариф» с кнопкой «Повысить тариф». Подробнее о тарифах — в разделе
[Оплата](/organization/billing/).

## Что подготовить в AppsFlyer

- **Токен API V2.** Его выпускает администратор аккаунта AppsFlyer в разделе Settings → API
  tokens. Один токен даёт доступ ко всем приложениям аккаунта.
- **Токен S2S и токен OneLink** — по желанию. Они нужны только инструментам агента, которые
  отправляют server-to-server события или работают со ссылками OneLink. Без них коннектор
  загружает данные как обычно, а эти инструменты не выполнятся.

В мастере настройки после регистрации AppsFlyer нет: там подключаются только сервисы со входом
через OAuth. Подключите AppsFlyer из раздела «Коннекторы».

## Подключение

1. В боковой панели откройте «Коннекторы» и перейдите на вкладку «Маркетплейс».
2. На карточке «AppsFlyer» нажмите «Подключить». Откроется страница «Подключение AppsFlyer».
3. **«Авторизация».** Вставьте токен в поле «Токен API V2». Поля «Токен S2S» и «Токен
   OneLink» необязательные. Если токен AppsFlyer уже сохранён в Палитре, его можно выбрать в
   списке «Существующие учётные данные» кнопкой «Использовать эти учётные данные». Владелец и
   администратор организации могут отметить «Сохранить на уровне организации», если тот же
   токен понадобится в других проектах.
4. **«Выбор аккаунта».** На шаге «Выберите приложение» выберите приложение из списка
   приложений, доступных по токену.
5. **«Разрешения».** Для каждого инструмента агента выберите: «Всегда разрешать», «Требует
   подтверждения» или «Заблокировано».
6. **«Проверка».** Проверьте настройки и нажмите «Готово». Палитра подключит коннектор и
   проверит доступ: прочитает дневной сводный отчёт приложения.
7. **«Сопоставление событий».** Этот шаг идёт после подключения. Сопоставьте события AppsFlyer
   с событиями проекта и нажмите «Сохранить сопоставление» или «Пропустить» — подробнее ниже.

Шагов «Ограничения» и «Автотегирование» у AppsFlyer нет. Общие правила мастера описаны в
[обзоре коннекторов](/connectors/overview/).

Один коннектор загружает одно приложение. Приложение нельзя поменять после подключения: чтобы
загружать другое приложение того же аккаунта, подключите ещё один коннектор кнопкой «Подключить
ещё».

## Какие данные загружаются

Палитра загружает из AppsFlyer:

- установки и переустановки — неорганические и органические;
- повторные вовлечения и повторные атрибуции;
- события в приложении, включая события ретаргетинга;
- удаления приложения;
- доход от рекламы в приложении;
- дневные сводки по партнёрам и кампаниям и по странам — установки, события и выручку.

Установки, события в приложении и удаления становятся событиями проекта. Доход от рекламы и
дневные сводки событиями не становятся.

Данные по устройствам — установки, события, удаления и доход от рекламы — Палитра хранит за
последние 90 дней: дольше их не хранит и сам AppsFlyer. При подключении загружаются эти 90
дней. Дневные сводки хранятся 400 дней. Палитра синхронизирует данные каждые 6 часов и каждый
раз заново проверяет последние 14 дней.

Если в тарифе AppsFlyer нет сырых данных (Raw Data), Палитра загружает только дневные сводки и
предупреждает об этом на карточке коннектора. Без сводных отчётов коннектор работать не может:
их даёт любой тариф AppsFlyer, и если AppsFlyer в них отказал, подключение не пройдёт.

Если в проекте подключён мобильный трекер, в [настройках атрибуции](/data/attribution/)
появляется ползунок «Окно атрибуции установок».

## Push: события сразу, без ожидания синхронизации

Если в тарифе AppsFlyer есть Push API, AppsFlyer отправляет установки и события в Палитру сразу,
не дожидаясь синхронизации. Синхронизация потом подтягивает те же данные из отчётов, и они не
задваиваются.

Обычно делать ничего не нужно: при подключении Палитра сама добавляет свой адрес в настройки
Push API приложения в AppsFlyer, а ваши адреса оставляет на месте. Если AppsFlyer не ответил,
Палитра повторит попытку при следующей синхронизации. Если в тарифе нет Push API, события
загружаются только синхронизацией.

### Если адрес нужно добавить вручную

Если AppsFlyer не дал Палитре добавить адрес или у приложения уже 6 адресов Push API — это лимит
AppsFlyer, — на странице настроек коннектора появится карточка «Push» с заголовком «Добавьте
адрес в AppsFlyer вручную». Карточку видят менеджеры проекта, владелец и администраторы
организации.

1. На карточке коннектора нажмите на его название, чтобы открыть страницу «Настройки AppsFlyer».
2. В карточке «Push» прочитайте причину. Если в приложении уже 6 адресов, сначала удалите один
   из них в AppsFlyer.
3. В AppsFlyer откройте Export → API Access → Push API и добавьте адрес.
4. Перенесите из карточки «Push» значения полей «Адрес (URL)», «Метод», «Типы событий» и
   «Поля». Адрес скрыт: нажмите «Показать», чтобы его увидеть, или скопируйте кнопкой
   «Копировать».

Если вы отправите из AppsFlyer тестовое сообщение (Send Test), карточка покажет «Получено
тестовое сообщение AppsFlyer (Send Test).»

### Сменить токен адреса

Адрес Push содержит секретный токен — он не связан с токеном API V2. Пока карточка «Push» видна
на странице настроек, в ней есть кнопка «Сменить токен». Нажмите её и подтвердите. Старый адрес
сразу перестанет работать. Если адрес добавляла Палитра, она сама поставит новый в AppsFlyer;
если вы добавляли его вручную, вставьте новый адрес в AppsFlyer сами.

## Сопоставление событий

На шаге «Сопоставление событий» перечислены события AppsFlyer: установки, переустановки,
повторные вовлечения и атрибуции, удаления, рекомендованные события AppsFlyer (`af_purchase`,
`af_add_to_cart`, `af_complete_registration` и другие), а также события, которые приложение
уже присылало.

Пока ничего не сопоставлено, события загружаются с названиями по умолчанию:

- установка и переустановка — `first_open`;
- повторное вовлечение и повторная атрибуция — `app_reengagement`;
- удаление — `app_remove`;
- рекомендованные события AppsFlyer получают стандартные названия: например, `af_purchase` —
  `purchase`, `af_add_to_cart` — `add_to_cart`, `af_complete_registration` — `sign_up`;
- остальные события в приложении — под тем названием, которое прислало приложение.

Как только вы сопоставите хотя бы одно событие, события без сопоставления, в том числе
установки и удаления, перестают загружаться. Поэтому сопоставьте все нужные события. Вернуться к
шагу можно позже в настройках коннектора. Подробнее — в статье [События](/data/events/).

## Что умеет агент

Агент работает с AppsFlyer через инструменты — их больше сотни. Список и разрешения видны на
шаге «Разрешения».

**Чтение.** По умолчанию разрешено всегда. Например: «Список приложений», «Статистика
приложения», «Ежедневный отчёт», «Отчёт по партнёрам», «Отчёт по странам», «Когортный отчёт»,
«Мастер-отчёт», «Сырые данные: установки», «Сырые данные: события в приложении», «Отчёт об
эффективности SKAN», «Данные ссылки OneLink», «Список активных аудиторий».

**Изменения и удаление.** По умолчанию требуют вашего подтверждения. Например: «Создать ссылку
OneLink», «Изменить ссылку OneLink», «Отправить событие приложения с сервера», «Создать
импортированную аудиторию», «Изменить настройки Push API», «Настроить интеграции дохода от
рекламы», «Добавить тестовое устройство», «Удалить ссылку OneLink», «Удалить приложение»,
«Удалить пользователей».

Инструментам, которые отправляют server-to-server события, нужен токен S2S, а инструментам
OneLink — токен OneLink. Если токен не указан при подключении, такой инструмент не выполнится.

## Отключение

Когда вы удаляете коннектор, Палитра убирает свой адрес из настроек Push API приложения. Если
это не получилось — например, адрес вы добавляли вручную, — появится окно «AppsFlyer отключён»
с шагом «Удалите адрес Палитры … в AppsFlyer: Export → API Access → Push API.» Удалите адрес в
AppsFlyer и нажмите «Готово». Как удалять коннектор, описано в
[обзоре коннекторов](/connectors/overview/).

## Частые проблемы

Если с коннектором что-то не так, на его карточке в разделе «Коннекторы» появляется значок.
Наведите на него, чтобы увидеть, что случилось и что делать. На странице настроек коннектора
предупреждения о Push ведут к карточке «Push» ссылкой «Открыть панель Push».

**При подключении: «AppsFlyer не принял токен…»** Вставьте действующий токен API V2 из Settings
→ API tokens. Токены выпускают только администраторы аккаунта; токены, выпущенные до 10.03.2026,
AppsFlyer отозвал.

**«Тариф AppsFlyer не даёт агрегированных отчётов.»** Без них коннектор не может загружать
данные. Проверьте состояние аккаунта и тариф в AppsFlyer.

**«Аккаунт AppsFlyer, возможно, заблокирован — обратитесь в поддержку AppsFlyer.»**

**«Это приложение не видно с этим токеном.»** Выберите другое приложение или укажите токен того
аккаунта, которому принадлежит приложение.

**«Это приложение уже подключено в проекте как «…».»** Одно приложение нельзя подключить в
проект дважды. Откройте уже подключённый коннектор кнопкой «Открыть подключённый коннектор».

**«AppsFlyer больше не принимает токен API V2 коннектора.»** Например, токен перевыпустили или
у его владельца больше нет прав администратора. Подсказка под сообщением: «Выпустите новый токен
в AppsFlyer и замените его: в меню коннектора выберите «Настроить», на шаге «Авторизация»
нажмите «Подключить другой аккаунт», вставьте новый токен API V2 и на шаге «Проверка» нажмите
«Сохранить».»

Если у учётных данных статус «Недействителен — нужен Reconnect», ключ можно заменить и на вкладке
«Учётные данные» раздела «Коннекторы»: в строке учётных данных AppsFlyer нажмите на три точки,
выберите «Reconnect», вставьте новый токен API V2 и нажмите «Сохранить ключ». Так ключ заменится во
всех коннекторах на этих учётных данных. Подробнее — в [обзоре
коннекторов](/connectors/overview/#переподключить-учётные-данные). Если вы пользуетесь токенами S2S
и OneLink, вставьте в окне и их, иначе они будут удалены.

**«У коннектора нет доступа к этому аккаунту.»** Токен больше не видит приложение коннектора.
Укажите в настройках коннектора токен того аккаунта AppsFlyer, которому принадлежит
приложение.

**«Лимит запросов к API сервиса пока исчерпан.»** AppsFlyer ограничивает число запросов к
отчётам в сутки. Ничего делать не нужно: синхронизация продолжится после обновления лимитов в
00:00 UTC.

**«Тариф сервиса больше не даёт данных по устройствам.»** В тарифе AppsFlyer больше нет сырых
данных. Таблицы устройств перестали обновляться, загруженные строки остаются. Верните пакет в
тарифе — загрузка продолжится со следующей синхронизации.

**«Часть аккаунта в сервисе отключена, поэтому некоторые данные не загружаются.»** AppsFlyer
не отдаёт часть отчётов — например, ретаргетинг или доход от рекламы. Включите недостающее в
AppsFlyer — данные загрузятся при следующей синхронизации.

**«У приложения уже столько адресов Push API, сколько допускает сервис.»** Удалите один адрес
в AppsFlyer и добавьте адрес из карточки «Push».

**«Адрес Палитры пропал из списка Push API приложения.»** Скопируйте адрес из карточки «Push» и
добавьте его в AppsFlyer заново: Export → API Access → Push API.

**«Давно нет push-сообщений, хотя сервис видит новые установки.»** Проверьте в AppsFlyer, что
адрес Палитры настроен и включён.

**«В push-сообщениях или в настройке адреса не хватает обязательных полей.»** Предупреждение
называет недостающие поля. Отметьте их в настройке адреса Палитры в AppsFlyer.

**«Палитра не смогла прочитать часть push-сообщений.»** Проверьте, что в настройке адреса
Палитры в AppsFlyer отмечены все нужные поля. Если предупреждение повторяется, напишите в
поддержку.

**«Последняя синхронизация завершилась ошибкой.»** Палитра повторит попытку при следующей
синхронизации. Если ошибка повторяется, нажмите «Синхронизировать» в меню карточки коннектора
или напишите в поддержку.

**«Один шаг настройки при подключении не удался.»** Палитра повторит его при следующей
синхронизации. Ничего делать не нужно.
