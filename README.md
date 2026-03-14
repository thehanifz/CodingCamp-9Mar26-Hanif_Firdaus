# Productivity Dashboard

A lightweight, feature-rich productivity dashboard built with vanilla JavaScript. Helps users organize their day with time tracking, task management, and quick access to favorite websites.

## 🚀 Features

### Core Features
- **Greeting Display**
  - Real-time clock with 12h/24h format toggle
  - International date format
  - Time-based greetings (Morning, Afternoon, Evening, Night)
  
- **Focus Timer**
  - 25-minute Pomodoro timer (default)
  - Customizable duration (1-120 minutes)
  - Preset durations (5, 10, 15, 25, 30, 45, 60 minutes)
  - Start, Stop, Reset controls

- **Task Manager**
  - Add, edit, delete tasks
  - Mark tasks as complete
  - Sort by: Date, Status, Alphabetical (ascending/descending)
  - Persistent storage with Local Storage

- **Quick Links**
  - Save favorite websites
  - One-click access (opens in new tab)
  - Auto URL normalization
  - Persistent storage

### Optional Features (3/5 Implemented)
✅ **Light/Dark Mode** - Toggle theme with floating button  
✅ **Custom Timer Duration** - Set custom Pomodoro time  
✅ **Task Sorting** - Multiple sort options with direction toggle

## 🛠️ Technical Stack

- **HTML5** - Structure
- **CSS3** - Styling with CSS Variables for theming
- **Vanilla JavaScript** - No frameworks or libraries
- **Local Storage API** - Client-side data persistence

## 📁 Project Structure

```
productivity-dashboard/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Single CSS file
├── js/
│   └── script.js      # Single JavaScript file
├── .kiro/             # Kiro specs folder
│   └── specs/
│       └── productivity-dashboard/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
└── README.md          # This file
```

## 🎨 Design Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Touch-Friendly** - 44px minimum touch targets
- **Clean UI** - Minimal, modern interface
- **Smooth Animations** - Hover effects and transitions
- **Accessible** - Readable typography and color contrast

## 🚦 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- No installation or build process required

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/yourusername/productivity-dashboard.git
```

2. Open `index.html` in your browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

That's it! No build process, no dependencies.

## 📱 Usage Guide

### Time Format Toggle
- Click on the time display to toggle between 12h and 24h format
- Preference is saved automatically

### Custom Timer
- Click "Custom" button or double-click timer display
- Choose preset (1-7) or enter custom minutes
- Timer duration is saved for future sessions

### Task Sorting
- Click sort buttons to change order
- Click same button again to reverse direction
- Arrow indicators show current sort direction (↑/↓)

### Theme Toggle
- Click the floating button (top-right) to switch themes
- Theme preference is saved automatically

## 💾 Data Persistence

All data is stored in browser Local Storage:
- Tasks and completion status
- Quick links
- Timer duration preference
- Time format preference (12h/24h)
- Theme preference (light/dark)
- Task sort order and direction

## 🌐 Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

## 📦 Deployment

### GitHub Pages

1. Push code to GitHub repository
2. Go to repository Settings → Pages
3. Select branch (main) and root folder
4. Save and wait for deployment
5. Access via: `https://yourusername.github.io/repository-name/`

## 🎯 Assignment Compliance

This project fulfills all requirements for the Coding Camp assignment:

### Technical Constraints ✅
- HTML, CSS, Vanilla JavaScript only
- Local Storage for data persistence
- Modern browser compatibility

### Required Features ✅
- Greeting with time and date
- 25-minute focus timer with controls
- To-do list with full CRUD operations
- Quick links with Local Storage

### Optional Challenges ✅ (3/5)
- Light/Dark mode
- Custom Pomodoro time
- Sort tasks

### Folder Rules ✅
- Single CSS file in `css/`
- Single JavaScript file in `js/`
- Clean, readable code

## 📝 License

This project is created for educational purposes as part of AWS Coding Camp.

## 👤 Author

Hanif Firdaus  
AWS Builder ID: d-9067642ac7.e4f8a418-f051-70b0-9451-759e8f03be22

## 🙏 Acknowledgments

- Built with Kiro AI assistance
- Part of AWS Coding Camp curriculum
- Inspired by productivity tools and Pomodoro technique
