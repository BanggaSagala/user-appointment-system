# User Appointment Management System

**Name:** Bangga Sagala  
**Position:** Technical Test For IT Programmer Intern  
**Date:** 30 October 2025  

---

## Overview
A user-friendly application for managing appointments while handling timezone conflicts and ensuring time readability. The system should allow users to create, view, and manage appointments while respecting the preferred timezones of participants.
I Built using **React + Vite (Frontend)** and **Node.js + Express + Prisma + PostgreSQL (Backend)**.

---

## Features
- Simple **username-only login** (JWT authentication)
- **Create**, **List**, and **Cancel** appointments
- Multi-timezone validation (08:00–17:00 local hours for all participants)
- Displays time in user’s **preferred timezone**
- Database: **PostgreSQL** via **Prisma ORM**

---

## How to Run

### 1️⃣ Backend
```bash
cd backend                          #sesuai lokasi file directory
npm i                               #run di cmd setelah berada di file directory    
npx prisma migrate dev --name init  #run di cmd
node src/seed.js                    #run di cmd
npm run dev                         #run di cmd
```

### 2️⃣ Frontend
```bash
cd frontend                         #sesuai lokasi file directory
npm i                               #run di cmd setelah berada di file directory
npm run dev                         #run di cmd
```
## Demo Video
Watch the demo here: [User Appointment System Demo] (https://drive.google.com/file/d/19wyJIncL85lh_jCJXCA6FLg9G-zNmQBw/view?usp=drive_link)
