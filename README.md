# FocusLink — AI Powered ADHD Habit Tracking App

> Final Year Capstone Project | Savitribai Phule Pune University | Grade: A+

---

## Overview

FocusLink is a mobile application built for individuals with ADHD who struggle with conventional habit tracking tools. Most productivity apps are designed for neurotypical users and unintentionally create friction, overwhelm, and shame for neurodivergent minds. FocusLink was designed the other way around, starting from the cognitive and emotional reality of ADHD and building technology to support it.

The app was built using React Native and Firebase, with OpenAI's GPT 3.5 Turbo integrated for personalised habit suggestions and conversational coaching.

---

## The Problem

Individuals with ADHD experience real neurological challenges with working memory, emotional regulation, task initiation, and sustained attention. These are not motivation problems. Existing habit apps respond by adding more notifications, more streaks, and more gamification, all of which increase cognitive load and emotional pressure for ADHD users. FocusLink takes the opposite approach.

---

## Features

**The Big One**
A single daily intention prompt at the top of the home screen. Instead of a long to do list, the user answers one question: what is the one thing they want to accomplish today? This directly addresses the prioritisation and task initiation barriers that are central to ADHD.

**Mood Based Habit Suggestions**
An emoji bar lets users tap their current mood. The app sends that input to the OpenAI API and returns a personalised, context aware habit suggestion based on how the user is actually feeling. Structure adapts to the user rather than demanding the user adapt to it.

**AI Coach Chatbot**
A friendly AI chatbot powered by GPT 3.5 Turbo acts as an on demand coach. It responds in short, affirming, non judgmental language and provides suggestions, encouragement, and gentle redirection whenever the user feels stuck or overwhelmed.

**Visual Rewards**
When a user completes three habits in a day, a celebratory modal appears. This provides immediate positive reinforcement that activates dopamine pathways which are often under responsive in ADHD brains, without the pressure of streaks or perfectionism.

**Hourly Encouragement Notifications**
A custom React Native hook sends a randomised encouraging message every hour while the app is running. These nudges interrupt time blindness and simulate the kind of external structure that many ADHD individuals rely on to stay on track.

**Daily Reset Checklist**
The habit checklist resets every day. There are no streaks, no failure states, and no judgment. Each day is a clean start.

---

## Technology Stack

| Tool | Purpose |
|---|---|
| React Native | Cross platform mobile app development (iOS and Android) |
| Firebase Firestore | Real time cloud database for habit storage |
| OpenAI GPT 3.5 Turbo | AI powered habit suggestions and chatbot coaching |
| Expo Notifications | Local notification scheduling for hourly encouragements |
| Axios | API communication with OpenAI |

---

## Project Structure
