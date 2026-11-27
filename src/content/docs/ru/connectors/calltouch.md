---
title: CallTouch
description: Как подключить CallTouch, какие звонки, заявки и сделки загружает Палитра и как они связываются с рекламой.
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
  - palitra-frontend/components/connector-setup/wizard.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/auth-step.tsx
  - palitra-frontend/components/connector-setup/steps/auth-step.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/credential-key-fields.tsx
  - palitra-frontend/components/connector-setup/steps/auth-step-reuse-picker.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/connector-settings-step.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/connector-settings-edit.ru.messages.json
  - palitra-frontend/components/connector-setup/steps/review-step.tsx
  - palitra-frontend/components/connector-setup/steps/review-step.ru.messages.json
  - palitra-frontend/components/connectors/connectors-tabs.ru.messages.json
  - palitra-frontend/components/connectors/catalog-list.ru.messages.json
  - palitra-frontend/components/connectors/catalog-connector-card.ru.messages.json
  - palitra-frontend/components/connectors/connected-connector-card.ru.messages.json
  - palitra-frontend/components/connectors/connector-issue-icon.tsx
  - palitra-frontend/components/connectors/connector-issue-icon.ru.messages.json
  - palitra-frontend/components/connectors/credentials-list.tsx
  - palitra-frontend/components/connectors/credentials-list.ru.messages.json
  - palitra-frontend/components/connectors/rotate-key-dialog.tsx
  - palitra-frontend/components/connectors/rotate-key-dialog.ru.messages.json
  - palitra-frontend/components/connectors/use-connector-copy.ru.messages.json
  - palitra-frontend/components/connectors/use-setting-copy.ru.messages.json
---

Коннектор CallTouch загружает в Палитру звонки, заявки с сайта и сделки одного сайта CallTouch.
Палитра связывает их с рекламой, которая их принесла, через Линкер Палитры. Телефоны и e-mail
хранятся только в виде хешей с ключом проекта.

Коннектор только читает данные: в CallTouch он ничего не меняет, и инструментов агента у него
нет.

## Что подготовить в CallTouch

Для подключения нужны две вещи из раздела «Интеграции → API» в кабинете CallTouch:

- API-токен;
- числовой ID сайта.

Проверьте там же, что для сайта включена передача данных по API и что сайт активирован. У
логина, которому принадлежит токен, должен быть доступ к этому сайту.

Один токен открывает все сайты своего логина, но один коннектор работает с одним сайтом. Для
второго сайта подключите CallTouch ещё раз: токен можно взять из сохранённых учётных данных.

## Подключение

CallTouch подключается из раздела «Коннекторы» (в мастере настройки после регистрации его
нет).

1. В боковой панели откройте «Коннекторы» и перейдите на вкладку «Маркетплейс». CallTouch есть
   в категории «Коллтрекинг».
2. На карточке «CallTouch» нажмите «Подключить». Откроется страница «Подключение CallTouch».
3. **«Авторизация».** Вставьте токен в поле «API-токен». Подсказка под полем: «API-токен из
   раздела «Интеграции → API» в кабинете CallTouch.» Если токен CallTouch уже сохранён в
   Палитре, его можно выбрать в списке «Существующие учётные данные». Отметьте «Сохранить на
   уровне организации», если тот же токен понадобится в других проектах.
4. **«Параметры».** Укажите:
   - «ID сайта» — числовой ID сайта из раздела «Интеграции → API». С пометкой «Не меняется после
     подключения.»;
   - «Модель атрибуции» — «Последнее взаимодействие» (по умолчанию) или «Последнее непрямое
     взаимодействие». Подробнее — ниже.
5. **«Проверка».** Проверьте настройки и нажмите «Готово». Палитра подключит коннектор и
   проверит доступ: прочитает журнал звонков сайта за сегодня.

Коннектор появится на вкладке «Коннекторы» под названием вида «CallTouch — сайт 12345».

Общие шаги мастера описаны в [обзоре коннекторов](/connectors/overview/).

## Модель атрибуции

Параметр «Модель атрибуции» говорит, какому визиту CallTouch приписывает звонок, когда отдаёт
его источник:

- «Последнее взаимодействие»;
- «Последнее непрямое взаимодействие».

Оставьте «Последнее взаимодействие», если не сверяете данные с отчётами CallTouch: Палитра
применяет поверх свою модель атрибуции.

Модель можно поменять потом в настройках коннектора, на шаге «Параметры». После сохранения
данные коннектора за окно полной синхронизации загрузятся заново, потому что каждая
загруженная строка помнит модель, с которой её прочитали.

## Какие данные загружаются

Палитра загружает из CallTouch по выбранному сайту:

- **звонки** — время, длительность, ответили ли на звонок, первичный ли он, целевой ли,
  подменный номер, теги и связанные сделки;
- **заявки** с форм сайта — время, форма, страница, признаки уникальности и целевой заявки,
  устройство, теги и связанные сделки;
- **сделки** — статус, воронка, сумма, маржа, валюта, товары и теги;
- **визиты** посетителя до и после звонка или заявки.

У каждой строки есть источник визита: посадочная страница, реферер, UTM-метки, а также
источник, канал и кампания, которые определила Палитра.

Звонки, заявки и сделки становятся событиями проекта:

- звонок — событие `phone_call`;
- заявка — событие `submit_form`;
- сделка с суммой больше нуля, если она не удалена, — событие `purchase` с этой суммой.

Визиты событиями не становятся, они хранятся только для анализа.

Синхронизация идёт каждые 4 часа. CallTouch ещё долго уточняет звонки и заявки: меняет теги и
признак целевого, привязывает сделки. Поэтому каждая синхронизация перечитывает последние
30 дней.

### Связь с рекламой

Если посетитель пришёл по рекламе со ссылкой, размеченной Палитрой, звонок или заявка
связываются с кампанией, группой и объявлением через Линкер Палитры, а значит — с расходом на
рекламу. Без метки Палитры источник определяется по UTM-меткам, затем по рефереру; иначе визит
считается прямым заходом. Размечать ссылки умеют рекламные коннекторы — см. автотегирование в
статье [Яндекс Директ](/connectors/yandex-direct/).

### Телефоны и e-mail

Номера телефонов и адреса e-mail в Палитру не попадают. Перед сохранением Палитра заменяет их
хешем с ключом проекта. По хешу можно узнать одного и того же человека в разных звонках,
заявках и сделках, а сам номер или адрес в данных не виден.

## Частые проблемы

### При подключении

Если CallTouch отказал, мастер вернёт вас к шагу с ошибкой и покажет подсказку под полем.

**«CallTouch не принял токен: он неверный, неактивен или был перевыпущен.»** Скопируйте
действующий токен из раздела «Интеграции → API» и вставьте его заново или выберите другой
сохранённый.

**«В CallTouch нет сайта с таким ID.»** Укажите ID сайта из раздела «Интеграции → API» в
кабинете CallTouch.

**«У логина, выпустившего токен, нет доступа к этому сайту.»** Выдайте этому логину доступ к
сайту в кабинете CallTouch.

**«Для этого сайта выключена передача данных по API.»** Включите её в разделе «Интеграции →
API» в кабинете CallTouch.

**«Сайт не активирован в CallTouch.»** Активируйте его в кабинете CallTouch.

**«Это уже подключено в проекте как «…».»** Этот сайт уже подключён в проекте. Нажмите
«Открыть подключённый коннектор» или удалите его и подключите заново.

### После подключения

Если с коннектором что-то не так, на его карточке в разделе «Коннекторы» появляется значок.
Наведите на него, чтобы увидеть, что случилось и что делать.

**«CallTouch больше не принимает API-токен коннектора.»** Например, токен перевыпустили.
Подсказка под сообщением: «Скопируйте действующий токен в CallTouch и замените его: в меню
коннектора выберите «Настроить», на шаге «Авторизация» нажмите «Подключить другой аккаунт»,
вставьте новый API-токен и на шаге «Проверка» нажмите «Сохранить».»

Если у учётных данных статус «Недействителен — нужен Reconnect», ключ можно заменить и на вкладке
«Учётные данные» раздела «Коннекторы»: в строке учётных данных CallTouch нажмите на три точки,
выберите «Reconnect», вставьте действующий API-токен и нажмите «Сохранить ключ». Так ключ заменится
во всех коннекторах на этих учётных данных. Подробнее — в [обзоре
коннекторов](/connectors/overview/#переподключить-учётные-данные).

**«У коннектора нет доступа к этому аккаунту.»** У логина токена пропал доступ к сайту,
передачу данных по API выключили или сайт деактивировали. Исправьте это в кабинете CallTouch.

**«Лимит запросов к API сервиса пока исчерпан.»** CallTouch ограничивает число запросов к API.
Ничего делать не нужно: синхронизация продолжится сама, когда лимит обновится.

**«Последняя синхронизация завершилась ошибкой.»** Палитра повторит попытку при следующей
синхронизации. Если ошибка повторяется, нажмите «Синхронизировать» в меню карточки коннектора
или напишите в поддержку.
