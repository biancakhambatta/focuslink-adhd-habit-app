# FocusLink

**An AI-powered habit tracker for people with ADHD.**

FocusLink replaces the long to-do list with one daily intention, gentle habit suggestions based on how you feel, and a supportive AI coach. There are no streaks and no failure states, so a missed day never feels like losing.

Final-year capstone project, Pune University (Grade A+). Designed and built solo.

---

## Features

- **The Big One:** a single daily intention on the home screen instead of a long list
- **Mood-based habit suggestions:** tap a mood and the app asks OpenAI for a habit that fits it
- **AI Coach:** a chatbot (GPT-3.5 Turbo) that gives short, supportive replies when you feel stuck
- **Visual rewards:** a celebration appears after you complete three habits in a day
- **Hourly encouragement:** a randomised, encouraging notification each hour while the app runs
- **Daily reset:** the checklist resets every day, with no streaks or penalties

## Tech stack

| Tool | Purpose |
|---|---|
| React Native (Expo) | Cross-platform iOS and Android app |
| React Navigation | Moving between screens |
| Firebase Firestore | Cloud database for habits |
| OpenAI GPT-3.5 Turbo | Habit suggestions and AI coaching |
| Expo Notifications | Scheduling the hourly encouragements |
| Axios | Calls to the OpenAI API |

## Project structure
