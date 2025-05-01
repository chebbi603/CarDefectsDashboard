# QLab Case Study Dashboard

A comprehensive dashboard platform for analyzing and managing case studies with anomaly detection capabilities.

## Features

- **Dashboard Overview**: Visual representation of key metrics and anomalies
- **Data Analysis**: Detailed examination of dataset patterns and trends
- **Case Management**: 
  - Create and track cases with status updates
  - Add messages and comments to cases
  - View historical case data
- **Alert System**: Notification system for detected anomalies
- **Data Visualization**: Interactive charts and tables for data exploration

## Pages

1. **Home**: Landing page with quick access to main features
2. **Dashboard**: 
   - Overview: Summary of key metrics
   - Analysis: Detailed data examination
   - Alerts: Notification center
3. **Cases**: 
   - Case list view with search functionality
   - Individual case details with messaging system
4. **List**: Tabular view of complete dataset with filtering options

## Technology Stack

- Frontend: React.js with Tailwind CSS
- Backend: Node.js/Express
- Data Visualization: MUIX Charts
- Icons: Tabler Icons
- Routing: React Router

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start development server (It should start both frontend and backend servers)
```bash
npm run dev
```

## Project Structure

```bash
qlab-casestudy-dashboard-frontend/
├── src/
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── LeftPanel.jsx
│   │   ├── Layouts.css
│   │   └── sidebar.css
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SubPages/
│   │   │   │   ├── Overview.jsx
│   │   │   │   ├── Analysis.jsx
│   │   │   │   └── Alerts.jsx
│   │   │   └── Tabulation/
│   │   │       ├── Tabulation.jsx
│   │   │       └── tabulation.css
│   │   ├── Cases/
│   │   │   ├── Cases.jsx
│   │   │   ├── CaseView.jsx
│   │   │   └── CaseContainer.jsx
│   │   └── Table/
│   │       └── TablePage.jsx
│   ├── components/
│   │   ├── ChartCard/
│   │   │   └── ChartCard.jsx
│   │   ├── IconButton.jsx
│   │   └── buttons.css
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── assets/
│       └── logo.svg
├── vite.config.js
└── index.html
```

