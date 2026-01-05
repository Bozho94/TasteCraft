# TasteCraft

## 🚀 Beta v1 – Current Functionality

TasteCraft is a **Single Page Application (SPA)** built with **ASP.NET Core (REST API)** and **React**. The project demonstrates a complete end‑to‑end flow for an online marketplace: authentication, role‑based access, product management, cart, checkout, and order processing.

This README describes **only the functionality that is currently implemented**.

---

## ✨ Implemented Features (Beta v1)

### 👤 Authentication & Roles

* User registration and login using ASP.NET Identity
* Cookie‑based authentication
* Role‑based authorization (User / Admin)
* Demo functionality: logged‑in users can switch **Admin mode on/off** via the UI
* Logout ends the current session (authentication cookie)

### 🛍️ Categories & Products

* Create categories (Admin only)
* Create products assigned to categories (Admin only)
* Edit and delete categories and products (Admin only)
* Browse products by category (authenticated users)

### 🛒 Cart & Checkout

* Add products to cart
* Cart persisted per authenticated user
* Checkout flow with delivery details
* Order creation from cart items

### 📦 Orders

#### User Orders

* View "My Orders" list
* View order details
* Track order status

#### Admin Orders

* View all orders with full customer details
* Filter orders by status
* Update order status (Pending / Shipped / Cancelled)

---

## 🔐 Access Control

* Backend API endpoints are protected using `[Authorize]` and role‑based authorization
* Admin‑only actions require `Admin` role
* Frontend routes for admin pages are guarded to prevent unauthorized access
* Guest users have limited UI access and are prompted to log in or register

---

## 🧱 Tech Stack

### Backend

* ASP.NET Core Web API
* Entity Framework Core
* ASP.NET Identity (authentication & roles)
* PostgreSQL (Npgsql)

### Frontend

* React
* React Router
* Axios
* Bootstrap

---

## 🔄 Current Application Flow

1. User registers and logs in
2. User may enable Admin mode (demo feature)
3. Admin creates categories and products
4. User adds products to cart
5. User completes checkout
6. Orders are visible to both user and admin
7. Admin processes orders and updates status

---

## 📌 Project Status

* Version: **v0.1‑beta**
* State: **Working demo / portfolio project**

---

# TasteCraft (Български)

## 🚀 Бета версия v1 – Текуща функционалност

TasteCraft е **Single Page Application (SPA)**, разработено с **ASP.NET Core (REST API)** и **React**. Проектът демонстрира пълен работен процес за онлайн платформа – автентикация, роли, продукти, количка, поръчки и администраторска обработка.

Този README описва **само вече реализираната функционалност**.

---

## ✨ Реализирани функционалности (Бета v1)

### 👤 Потребители и роли

* Регистрация и вход с ASP.NET Identity
* Cookie‑базирана автентикация
* Ролева система (User / Admin)
* Демо функционалност: потребителят може да включва и изключва администраторски режим
* Изход от системата прекратява текущата сесия

### 🛍️ Категории и продукти

* Създаване на категории (само администратор)
* Създаване на продукти към категории (само администратор)
* Редакция и изтриване на категории и продукти (само администратор)
* Разглеждане на продукти по категории (логнати потребители)

### 🛒 Количка и поръчка

* Добавяне на продукти в количка
* Количката се пази за логнат потребител
* Процес на поръчка с данни за доставка
* Създаване на поръчка от количката

### 📦 Поръчки

#### Поръчки на потребителя

* Списък "Моите поръчки"
* Детайли на поръчка
* Проследяване на статус

#### Администраторски поръчки

* Преглед на всички поръчки с клиентски данни
* Филтриране по статус
* Промяна на статуса на поръчките (В обработка / Изпратена / Отказана)

---

## 🔐 Контрол на достъпа

* Backend API е защитено с `[Authorize]` и ролеви проверки
* Администраторските действия изискват Admin роля
* Frontend страниците за администратор са защитени чрез routing guards
* Нелогнати потребители виждат ограничен интерфейс и покана за вход/регистрация

---

## 🧱 Технологии

### Backend

* ASP.NET Core Web API
* Entity Framework Core
* ASP.NET Identity
* PostgreSQL

### Frontend

* React
* React Router
* Axios
* Bootstrap

---

## 🔄 Работен процес (текущ)

1. Потребителят се регистрира и влиза в системата
2. По желание включва администраторски режим
3. Администраторът създава категории и продукти
4. Потребителят добавя продукти в количката
5. Завършва поръчка
6. Поръчките се виждат от потребителя и администратора
7. Администраторът обработва и променя статуса на поръчките

---

## 📌 Статус на проекта

* Версия: **v0.1‑beta**
* Състояние: **Работещо демо / портфолио проект**
