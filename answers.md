# Technical Questions – Answers   

---

## 1. Timezone Conflicts  
I store all appointment times in **UTC** in the database to keep them consistent. When creating a new appointment, the system converts the UTC time into each participant’s **local timezone** and checks if it’s still within **08:00–17:00 local working hours**. If any participant’s time is outside that range, the request is rejected **rejected** with an error message. 
This approach avoids confusion from daylight saving time and ensures everyone’s working hours are respected.

---

## 2. Database Optimization  
I use **Prisma ORM** to manage queries efficiently and only fetch the necessary data.  
To optimize performance:
- Added **indexes** on `startUtc`, `endUtc`, and `creatorId` to improve lookup speed.  
- Used `select` and `include` to limit the data fetched.  
- Filtered results to show **upcoming appointments** (`endUtc >= now`) where the user is either the **creator** or an **invitee**. 

---

## 3. Additional Features  
If this system were developed further into a real product, I would add:  
- **Edit & Reschedule Appointment** — for flexibility.  
- **Suggested Meeting Times** — that automatically fit all participants.  
- **Email / WhatsApp Notifications** — as reminders.  
- **Google Calendar Integration** — easy syncing  
These features would make the application more practical and user-friendly for real-world use.

---

## 4. Session Management  
For session handling, I use a **lightweight JWT (JSON Web Token)** that only stores the user’s ID, username, and expiration time. The token expires in about **one hour** for security, and a **refresh token** can be added later for longer sessions. Full user data is always fetched from the database when needed, keeping the token small. For better security, the JWT can be stored in an **httpOnly cookie** and restricted to trusted origins.

---
