# HazardHub

**Created by**  
Team: Twenty One Pilots
- **Rafael Jabbour**  
- **Alina Khan**  
- **Lavneet Sidhu**  
- **Daniel Rolfe**

---

## Table of Contents
1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Key Features](#key-features)
4. [Tech Stack](#tech-stack)
5. [How It Works](#how-it-works)
6. [Project Structure](#project-structure)
7. [Installation & Usage](#installation--usage)

---

## Introduction
**HazardHub** is a versatile web and mobile application designed to empower communities with real-time hazard reporting and safe navigation during emergencies. The platform allows users to report and track various hazards, such as fires, floods, earthquakes, and other custom events, while providing safe routes (in progress) to avoid danger zones. Leveraging technologies like **MapBox**, **MongoDB**, and **React Native**, HazardHub integrates community-driven hazard reporting with advanced navigation.

---

## Project Overview
In times of crisis, quick access to accurate hazard information is critical. **HazardHub** enables users to report and visualize hazards in real time, fostering a safer and more informed community:

- **Real-Time Reporting**: Users can mark hazards, such as fires, floods, earthquakes, or create custom hazard reports.
- **Safe Navigation**: The platform dynamically adjusts routes based on reported hazards using the **MapBox Directions API**.
- **Community-Driven Data**: Crowdsourced information ensures hazard reports and safe routes remain up to date.

HazardHub combines intuitive functionality with cutting-edge technology to enhance emergency preparedness and response.

---

## Key Features

1. **Hazard Reporting**
   - Users can report various hazard types, including fires, floods, earthquakes, and custom hazards.
   - These reports are immediately stored and visualized on a map.

2. **Safe Navigation (in progress)**
   - Routes are calculated dynamically, avoiding reported hazard zones.

3. **Push Notifications**
   - Users receive real-time notifications about new hazards near their location.

4. **Map Integration**
   - HazardHub utilizes **MapBox GL JS** to provide an interactive and visually appealing map interface.

5. **Custom Hazards**
   - Users can create personalized hazard types to address specific local needs.

---

## Tech Stack

- **Frontend**: React Native (Expo) and MapBox GL JS for mapping
- **Backend**: Node.js / Express.js
- **Database**: MongoDB (Atlas or a hosted instance)
- **Map & Routing**: MapBox Directions API & MapBox GL JS
- **Push Notifications**: Expo Notifications API
- **Additional Libraries**: 
  - **Turf.js** for geometric operations (e.g., buffer zones)

---

## How It Works

1. **Hazard Reporting**
   - Users mark hazards on the map with details like type and severity.
   - Data is sent to the backend (Node/Express) and stored in MongoDB.

2. **Dynamic Routing**
   - MapBox’s Directions API recalculates routes based on reported hazards, avoiding danger zones.

3. **Web Based Information**
   - Data is obtained from embedded websites
   - Disasters: https://disaster-production.up.railway.app/
   - Diseases: https://disease-production.up.railway.app/ 

4. **Data Visualization**
   - All hazards are displayed on the map with distinct markers and visual indicators based on type.

---

## Project Structure

```bash
HazardHub/
│
├── backOEC/
│   ├── server.js              # Backend server logic
│   ├── routes.js              # API routes for hazard and user management
│   ├── models/                # MongoDB schema definitions
│   └── ... (other backend files)
│
├── frontOEC/
│   ├── App.tsx                # Main entry point for the React Native application
│   ├── screens/               # React Native screens
│   ├── components/            # Reusable components
│   └── ... (other frontend files)
│
└── README.md                  # Project documentation
```

---

## Installation & Usage

### Prerequisites

- Node.js and npm
- MongoDB database (local or hosted)
- MapBox access token
- Expo CLI

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/rafaeljabbour/OEC-2025_Programming_Competition
   cd OEC-2025_Programming_Competition
   ```

2. **Install Dependencies**

   - **Backend**
     ```bash
     cd backOEC
     npm install
     ```

   - **Frontend**
     ```bash
     cd frontOEC
     npm install
     ```

3. **Run the Backend**

   ```bash
   cd backOEC
   npm start
   ```

4. **Run the Frontend**

   ```bash
   cd frontOEC
   npx expo start
   ```

   - Scan the QR code displayed in the terminal using the Expo Go app on your mobile device.