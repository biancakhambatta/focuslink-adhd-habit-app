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

~~~
assets/             app icons and splash screen
hooks/              useEncouragements.js (notification logic)
screens/            HomeScreen, ChatScreen, SettingsScreen
App.js              app entry point
firebaseConfig.js   Firebase setup
theme.js            colours and styles
~~~

## Run it locally

1. Clone the repository and install the dependencies:

   ~~~
   git clone https://github.com/biancakhambatta/focuslink-adhd-habit-app.git
   cd focuslink-adhd-habit-app
   npm install
   ~~~

2. Create a file called `openaiConfig.js` in the project root and add your own OpenAI API key. This file is not included in the repository:

   ~~~js
   export const OPENAI_API_KEY = "your_key_here";
   ~~~

3. Start the app:

   ~~~
   npm start
   ~~~

   Then scan the QR code with the Expo Go app on your phone, or press `a` for an Android emulator or `i` for an iOS simulator.

## Limitations and next steps

- The OpenAI key is read inside the app. For a real release, I would move the API calls to a small backend so the key is never stored on the device.
- Habit suggestions use a short prompt. I would add guardrails and a fallback message if the API is unavailable.
- Automated tests for the habit and daily-reset logic.

## Report

The full capstone report is included in this repository: [Capstone Report Final.pdf](Capstone%20Report%20Final.pdf)
