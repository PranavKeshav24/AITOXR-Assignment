# Filter Table Component

A React component for filtering, sorting, and displaying tabular data. Built with TypeScript and Tailwind CSS for styling.

## Features

- **Filtering**: Add filters to specific columns with operators like equals, contains, greater than, etc.
- **Sorting**: Sort data in ascending or descending order.
- **Responsive UI**: Built with Tailwind CSS for a clean and responsive design.
- **TypeScript Support**: Strongly typed for better developer experience.

## Screenshots

### Default View
![image](https://github.com/user-attachments/assets/73fc2bff-a66e-4d12-94d5-e5aa0608b689)


### Filter Dropdown
![image](https://github.com/user-attachments/assets/db515680-75a0-45d6-8ccb-f8daf5291a65)

### Set Filter Options
![image](https://github.com/user-attachments/assets/5000fbde-12f1-4ab2-b1e1-f8fff6073f66)


### Sort Options
![image](https://github.com/user-attachments/assets/55656eef-4430-4a8a-92eb-b3e1a67a43e0)


### Active Filters
![image](https://github.com/user-attachments/assets/c0adfd39-b123-40e7-ad52-87041049a700)


## Project Setup

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

Clone the repository:
```sh
git clone https://github.com/PranavKeshav24/AITOXR-Assignment.git
cd AITOXR-Assignment
```

Install dependencies:
```sh
npm install
```

Start the development server:
```sh
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Folder Structure
```
src/
├── components/
│   └── filterTable/
│       └── FilterTable.tsx  # Main component containing all logic and UI
├── App.tsx                   # Main application entry
├── main.tsx                  # Entry point for the app
├── vite-env.d.ts              # Vite environment type definitions
└── index.css                  # Global styles
```

## Explanation

- **FilterTable.tsx**: The main component that handles filtering, sorting, and displaying the table. It contains all the logic and UI.
- **App.tsx**: Renders the `FilterTable` component.
- **main.tsx**: Entry point for the React application, where the app is mounted to the DOM.
- **vite-env.d.ts**: TypeScript type definitions for Vite environment variables.
- **index.css**: Global styles for the application.

## How to Run the Project

### Development Mode:
Run:
```sh
npm run dev
```
The app will open in your default browser at [http://localhost:3000](http://localhost:3000).

## Usage

### Adding a Filter
1. Click the **"Add Filter"** button.
2. Select a field from the dropdown.
3. Choose an operator and enter a value.
4. Click **"Apply Filter"**.

### Adding a Sort
1. Click the **"Add Sort"** button.
2. Select a field from the dropdown.
3. Choose the sort direction (ascending or descending).

### Removing Filters/Sorts
- Click the **Delete** button next to an active filter or sort to remove it.

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Adds static typing to JavaScript.
- **Vite**: Fast development and build tooling.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Lucide Icons**: Beautiful and consistent icons.

