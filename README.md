# MediRemind: Medication Reminder App

A comprehensive medication reminder application that helps users track their medication schedule, sends timely notifications, and alerts caregivers if doses are missed. Built for the AlgoArena Hackathon 2025.

## Problem Statement

Medication non-adherence is a significant issue, especially for elderly patients or those with chronic conditions. Missed doses can lead to health complications, reduced treatment effectiveness, and increased healthcare costs. Existing solutions often lack caregiver integration and easy-to-use interfaces for seniors.

## Motivation

This project was inspired by my grandmother who struggled with managing her multiple medications. Witnessing her challenges firsthand made me realize the need for a more accessible and comprehensive medication management solution, especially for elderly users who may not be tech-savvy. MediRemind aims to solve this problem while providing peace of mind to both patients and their caregivers.

## Solution

MediRemind addresses these challenges by providing:

- **Intuitive Medication Tracking**: Simple interface to add and manage medication reminders
- **Timely Notifications**: Browser notifications when it's time to take medication
- **Caregiver Alerts**: Notification system for caregivers when doses are missed
- **Emergency Contact Feature**: Quick access to emergency contacts
- **Recurring Medication Support**: Set up medications on customizable schedules

## Features

- User authentication with email/password
- Add medication reminders with name, dosage, and time
- Mark medications as taken
- Recurring medication scheduling
- Caregiver notification system for missed doses
- Emergency contact feature
- Password reset functionality
- Responsive design suitable for mobile and desktop

## Technologies Used

- **Frontend**: React.js, CSS3
- **Backend**: Firebase Authentication, Firebase Realtime Database
- **Notifications**: Browser Notifications API
- **Version Control**: Git/GitHub

## Installation and Setup

1. Clone the repository: git clone https://github.com/Drishti2601/MediRemind.git
2. Install dependencies:
cd MediRemind
npm install
3. Create a Firebase project and update the firebase configuration in `src/services/firebase.js`

4. Run the application: npm start

## Future Enhancements
- Mobile app using React Native
- Medication inventory tracking
- Integration with pharmacies for refill reminders
- Medication interaction warnings
- Voice commands for accessibility
