// ============================================
// Configuration & State
// ============================================

const CONFIG = {
  TIMER_DEFAULT_SECONDS: 1500, // 25 minutes
  STORAGE_KEYS: {
    TASKS: 'tasks',
    QUICK_LINKS: 'quickLinks',
    TIME_FORMAT: 'timeFormat',
    THEME: 'theme',
    TIMER_DURATION: 'timerDuration',
    TASK_SORT: 'taskSort'
  },
  TIME_FORMATS: {
    TWELVE_HOUR: '12',
    TWENTY_FOUR_HOUR: '24'
  },
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark'
  },
  SORT_OPTIONS: {
    CREATION: 'creation',
    COMPLETED: 'completed',
    ALPHABETICAL: 'alphabetical'
  }
};

let timeFormat = CONFIG.TIME_FORMATS.TWENTY_FOUR_HOUR;
let currentTheme = CONFIG.THEMES.LIGHT;
let taskSortOrder = CONFIG.SORT_OPTIONS.CREATION;

// ============================================
// Greeting Display Component
// ============================================

/**
 * Formats time based on selected format (12h or 24h)
 */
function formatTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');
  
  if (timeFormat === CONFIG.TIME_FORMATS.TWELVE_HOUR) {
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const hoursStr = String(hours12).padStart(2, '0');
    return `${hoursStr}:${minutesStr}:${secondsStr} ${period}`;
  } else {
    const hoursStr = String(hours).padStart(2, '0');
    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  }
}

/**
 * Formats date in international format (ISO-like readable)
 */
function formatDate(date) {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Returns appropriate greeting based on hour
 */
function getGreeting(hour) {
  if (hour >= 5 && hour <= 11) return 'Good Morning';
  if (hour >= 12 && hour <= 15) return 'Good Afternoon';
  if (hour >= 16 && hour <= 18) return 'Good Evening';
  return 'Good Night';
}

/**
 * Updates all greeting display elements
 */
function updateGreetingDisplay() {
  const now = new Date();
  const timeDisplay = document.getElementById('time-display');
  const dateDisplay = document.getElementById('date-display');
  const greetingText = document.getElementById('greeting-text');
  
  if (timeDisplay) timeDisplay.textContent = formatTime(now);
  if (dateDisplay) dateDisplay.textContent = formatDate(now);
  if (greetingText) greetingText.textContent = getGreeting(now.getHours());
}

/**
 * Toggles between 12h and 24h time format
 */
function toggleTimeFormat() {
  timeFormat = timeFormat === CONFIG.TIME_FORMATS.TWELVE_HOUR 
    ? CONFIG.TIME_FORMATS.TWENTY_FOUR_HOUR 
    : CONFIG.TIME_FORMATS.TWELVE_HOUR;
  
  saveToLocalStorage(CONFIG.STORAGE_KEYS.TIME_FORMAT, timeFormat);
  updateGreetingDisplay();
}

/**
 * Initializes greeting component
 */
function initGreeting() {
  // Load saved time format preference
  timeFormat = getFromLocalStorage(CONFIG.STORAGE_KEYS.TIME_FORMAT, CONFIG.TIME_FORMATS.TWENTY_FOUR_HOUR);
  
  // Initial update
  updateGreetingDisplay();
  
  // Update every second
  setInterval(updateGreetingDisplay, 1000);
  
  // Setup time format toggle button
  const timeDisplay = document.getElementById('time-display');
  if (timeDisplay) {
    timeDisplay.style.cursor = 'pointer';
    timeDisplay.title = 'Click to toggle 12h/24h format';
    timeDisplay.addEventListener('click', toggleTimeFormat);
  }
}

// ============================================
// Theme Switching
// ============================================

/**
 * Applies theme to document
 */
function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  currentTheme = theme;
}

/**
 * Toggles between light and dark theme
 */
function toggleTheme() {
  const newTheme = currentTheme === CONFIG.THEMES.LIGHT 
    ? CONFIG.THEMES.DARK 
    : CONFIG.THEMES.LIGHT;
  
  applyTheme(newTheme);
  saveToLocalStorage(CONFIG.STORAGE_KEYS.THEME, newTheme);
}

/**
 * Initializes theme
 */
function initTheme() {
  const savedTheme = getFromLocalStorage(CONFIG.STORAGE_KEYS.THEME, CONFIG.THEMES.LIGHT);
  applyTheme(savedTheme);
}

// ============================================
// Local Storage Utility Functions
// ============================================

/**
 * Checks if Local Storage is available in the browser
 * @returns {boolean} True if Local Storage is available, false otherwise
 */
function isLocalStorageAvailable() {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn('Local Storage is not available. Data will not persist across sessions.');
    return false;
  }
}

/**
 * Safely retrieves and parses data from Local Storage
 * @param {string} key - The Local Storage key
 * @param {*} defaultValue - Default value to return if key doesn't exist or parsing fails
 * @returns {*} Parsed data or default value
 */
function getFromLocalStorage(key, defaultValue = null) {
  if (!isLocalStorageAvailable()) {
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Failed to parse Local Storage data for key "${key}". Returning default value.`, e);
    return defaultValue;
  }
}

/**
 * Safely saves data to Local Storage with error handling
 * @param {string} key - The Local Storage key
 * @param {*} value - The value to store (will be JSON stringified)
 * @returns {boolean} True if successful, false otherwise
 */
function saveToLocalStorage(key, value) {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('Storage limit reached. Please delete some items.');
      alert('Storage limit reached. Please delete some items to free up space.');
    } else {
      console.error(`Failed to save data to Local Storage for key "${key}".`, e);
    }
    return false;
  }
}

/**
 * Removes an item from Local Storage
 * @param {string} key - The Local Storage key to remove
 * @returns {boolean} True if successful, false otherwise
 */
function removeFromLocalStorage(key) {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error(`Failed to remove data from Local Storage for key "${key}".`, e);
    return false;
  }
}

// ============================================
// Focus Timer Component
// ============================================

const timerState = {
  remainingSeconds: CONFIG.TIMER_DEFAULT_SECONDS,
  isRunning: false,
  intervalId: null
};

/**
 * Formats seconds to MM:SS
 */
function formatTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Updates timer display
 */
function updateTimerDisplay() {
  const display = document.getElementById('timer-display');
  if (display) {
    display.textContent = formatTimerDisplay(timerState.remainingSeconds);
  }
}

/**
 * Timer tick - decrements by 1 second
 */
function tick() {
  if (timerState.remainingSeconds > 0) {
    timerState.remainingSeconds--;
    updateTimerDisplay();
    
    if (timerState.remainingSeconds === 0) {
      stopTimer();
    }
  }
}

/**
 * Starts timer
 */
function startTimer() {
  if (!timerState.isRunning) {
    timerState.isRunning = true;
    timerState.intervalId = setInterval(tick, 1000);
  }
}

/**
 * Stops timer
 */
function stopTimer() {
  if (timerState.isRunning) {
    timerState.isRunning = false;
    if (timerState.intervalId) {
      clearInterval(timerState.intervalId);
      timerState.intervalId = null;
    }
  }
}

/**
 * Resets timer to default
 */
function resetTimer() {
  stopTimer();
  timerState.remainingSeconds = CONFIG.TIMER_DEFAULT_SECONDS;
  updateTimerDisplay();
}

/**
 * Sets custom timer duration
 */
function setCustomTimerDuration() {
  const minutes = prompt('Enter timer duration in minutes (1-120):', 
    Math.floor(timerState.remainingSeconds / 60));
  
  if (minutes === null) return;
  
  const parsedMinutes = parseInt(minutes, 10);
  
  if (isNaN(parsedMinutes) || parsedMinutes < 1 || parsedMinutes > 120) {
    alert('Please enter a valid duration between 1 and 120 minutes.');
    return;
  }
  
  const seconds = parsedMinutes * 60;
  CONFIG.TIMER_DEFAULT_SECONDS = seconds;
  timerState.remainingSeconds = seconds;
  
  saveToLocalStorage(CONFIG.STORAGE_KEYS.TIMER_DURATION, seconds);
  updateTimerDisplay();
}

/**
 * Initializes timer component
 */
function initTimer() {
  // Load saved timer duration
  const savedDuration = getFromLocalStorage(CONFIG.STORAGE_KEYS.TIMER_DURATION, 1500);
  CONFIG.TIMER_DEFAULT_SECONDS = savedDuration;
  timerState.remainingSeconds = savedDuration;
  
  updateTimerDisplay();
  
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const resetBtn = document.getElementById('reset-btn');
  const timerDisplay = document.getElementById('timer-display');
  
  if (startBtn) startBtn.addEventListener('click', startTimer);
  if (stopBtn) stopBtn.addEventListener('click', stopTimer);
  if (resetBtn) resetBtn.addEventListener('click', resetTimer);
  
  // Double-click timer display to set custom duration
  if (timerDisplay) {
    timerDisplay.style.cursor = 'pointer';
    timerDisplay.title = 'Double-click to set custom duration';
    timerDisplay.addEventListener('dblclick', setCustomTimerDuration);
  }
}

// ============================================
// Task Manager Component
// ============================================

/**
 * Task state - array of task objects
 */
let tasks = [];

/**
 * Generates unique ID using timestamp and random string
 */
function generateTaskId() {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Loads tasks from Local Storage
 */
function loadTasks() {
  const loaded = getFromLocalStorage(CONFIG.STORAGE_KEYS.TASKS, []);
  
  if (!Array.isArray(loaded)) {
    console.warn('Invalid tasks data. Initializing empty array.');
    return [];
  }
  
  return loaded.filter(task => {
    const isValid = task && 
                    typeof task === 'object' && 
                    task.id && 
                    typeof task.text === 'string' && 
                    typeof task.completed === 'boolean';
    
    if (!isValid) {
      console.warn('Invalid task found, skipping:', task);
    }
    return isValid;
  });
}

/**
 * Saves tasks to Local Storage
 */
function saveTasks() {
  return saveToLocalStorage(CONFIG.STORAGE_KEYS.TASKS, tasks);
}

/**
 * Adds new task
 */
function addTask(text) {
  const trimmedText = text.trim();
  if (!trimmedText) return null;
  
  const newTask = {
    id: generateTaskId(),
    text: trimmedText,
    completed: false,
    createdAt: Date.now()
  };
  
  tasks.push(newTask);
  saveTasks();
  return newTask;
}

/**
 * Edits existing task
 */
function editTask(id, newText) {
  const trimmedText = newText.trim();
  if (!trimmedText) return false;
  
  const task = tasks.find(t => t.id === id);
  if (!task) return false;
  
  task.text = trimmedText;
  saveTasks();
  return true;
}

/**
 * Deletes task
 */
function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  tasks.splice(index, 1);
  saveTasks();
  return true;
}

/**
 * Toggles task completion
 */
function toggleTaskComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return false;
  
  task.completed = !task.completed;
  saveTasks();
  return true;
}

// ============================================
// Application Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initGreeting();
  initTimer();
  initTasks();
  initQuickLinks();
});

/**
 * Creates DOM element for a task
 */
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.dataset.id = task.id;
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => {
    toggleTaskComplete(task.id);
    renderTasks();
  });
  
  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';
  textSpan.textContent = task.text;
  if (task.completed) textSpan.classList.add('completed');
  
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'edit-btn';
  editBtn.addEventListener('click', () => {
    const newText = prompt('Edit task:', task.text);
    if (newText !== null && editTask(task.id, newText)) {
      renderTasks();
    }
  });
  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', () => {
    if (confirm('Delete this task?')) {
      deleteTask(task.id);
      renderTasks();
    }
  });
  
  li.append(checkbox, textSpan, editBtn, deleteBtn);
  return li;
}

/**
 * Renders all tasks to DOM
 */
function renderTasks() {
  const taskList = document.getElementById('task-list');
  if (!taskList) return;
  
  // Sort tasks based on current sort order
  const sortedTasks = getSortedTasks();
  
  taskList.innerHTML = '';
  sortedTasks.forEach(task => {
    taskList.appendChild(createTaskElement(task));
  });
}

/**
 * Gets sorted tasks based on current sort order
 */
function getSortedTasks() {
  const tasksCopy = [...tasks];
  
  switch (taskSortOrder) {
    case CONFIG.SORT_OPTIONS.COMPLETED:
      return tasksCopy.sort((a, b) => {
        if (a.completed === b.completed) return a.createdAt - b.createdAt;
        return a.completed ? 1 : -1;
      });
    
    case CONFIG.SORT_OPTIONS.ALPHABETICAL:
      return tasksCopy.sort((a, b) => a.text.localeCompare(b.text));
    
    case CONFIG.SORT_OPTIONS.CREATION:
    default:
      return tasksCopy.sort((a, b) => a.createdAt - b.createdAt);
  }
}

/**
 * Changes task sort order
 */
function changeTaskSort(sortOption) {
  taskSortOrder = sortOption;
  saveToLocalStorage(CONFIG.STORAGE_KEYS.TASK_SORT, sortOption);
  renderTasks();
  
  // Update active sort button
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.querySelector(`[data-sort="${sortOption}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

/**
 * Initializes task manager
 */
function initTasks() {
  tasks = loadTasks();
  
  // Load saved sort order
  taskSortOrder = getFromLocalStorage(CONFIG.STORAGE_KEYS.TASK_SORT, CONFIG.SORT_OPTIONS.CREATION);
  
  renderTasks();
  
  const taskInput = document.getElementById('task-input');
  const addBtn = document.getElementById('add-task-btn');
  
  const handleAddTask = () => {
    if (taskInput && taskInput.value.trim()) {
      addTask(taskInput.value);
      taskInput.value = '';
      renderTasks();
    }
  };
  
  if (addBtn) addBtn.addEventListener('click', handleAddTask);
  if (taskInput) {
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAddTask();
    });
  }
  
  // Setup sort buttons
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      changeTaskSort(btn.dataset.sort);
    });
  });
  
  // Set initial active sort button
  const activeBtn = document.querySelector(`[data-sort="${taskSortOrder}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

// ============================================
// Quick Links Component
// ============================================

let quickLinks = [];

/**
 * Generates unique ID for quick link
 */
function generateLinkId() {
  return `link_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Loads quick links from Local Storage
 */
function loadQuickLinks() {
  const loaded = getFromLocalStorage(CONFIG.STORAGE_KEYS.QUICK_LINKS, []);
  
  if (!Array.isArray(loaded)) {
    console.warn('Invalid quick links data. Initializing empty array.');
    return [];
  }
  
  return loaded.filter(link => {
    const isValid = link && 
                    typeof link === 'object' && 
                    link.id && 
                    typeof link.name === 'string' && 
                    typeof link.url === 'string';
    
    if (!isValid) {
      console.warn('Invalid link found, skipping:', link);
    }
    return isValid;
  });
}

/**
 * Saves quick links to Local Storage
 */
function saveQuickLinks() {
  return saveToLocalStorage(CONFIG.STORAGE_KEYS.QUICK_LINKS, quickLinks);
}

/**
 * Validates URL has protocol
 */
function validateUrl(url) {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Normalizes URL by adding https:// if missing
 */
function normalizeUrl(url) {
  return validateUrl(url) ? url : `https://${url}`;
}

/**
 * Adds new quick link
 */
function addQuickLink(name, url) {
  const trimmedName = name.trim();
  const trimmedUrl = url.trim();
  
  if (!trimmedName || !trimmedUrl) return null;
  
  const newLink = {
    id: generateLinkId(),
    name: trimmedName,
    url: normalizeUrl(trimmedUrl)
  };
  
  quickLinks.push(newLink);
  saveQuickLinks();
  return newLink;
}

/**
 * Deletes quick link
 */
function deleteQuickLink(id) {
  const index = quickLinks.findIndex(l => l.id === id);
  if (index === -1) return false;
  
  quickLinks.splice(index, 1);
  saveQuickLinks();
  return true;
}

/**
 * Creates DOM element for a quick link
 */
function createLinkElement(link) {
  const btn = document.createElement('button');
  btn.className = 'link-btn';
  btn.textContent = link.name;
  btn.addEventListener('click', () => {
    window.open(link.url, '_blank');
  });
  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '×';
  deleteBtn.className = 'link-delete-btn';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm(`Delete link "${link.name}"?`)) {
      deleteQuickLink(link.id);
      renderQuickLinks();
    }
  });
  
  const container = document.createElement('div');
  container.className = 'link-item';
  container.append(btn, deleteBtn);
  return container;
}

/**
 * Renders all quick links to DOM
 */
function renderQuickLinks() {
  const linksContainer = document.getElementById('links-container');
  if (!linksContainer) return;
  
  linksContainer.innerHTML = '';
  quickLinks.forEach(link => {
    linksContainer.appendChild(createLinkElement(link));
  });
}

/**
 * Initializes quick links manager
 */
function initQuickLinks() {
  quickLinks = loadQuickLinks();
  renderQuickLinks();
  
  const nameInput = document.getElementById('link-name-input');
  const urlInput = document.getElementById('link-url-input');
  const addBtn = document.getElementById('add-link-btn');
  
  const handleAddLink = () => {
    if (nameInput && urlInput && nameInput.value.trim() && urlInput.value.trim()) {
      addQuickLink(nameInput.value, urlInput.value);
      nameInput.value = '';
      urlInput.value = '';
      renderQuickLinks();
    }
  };
  
  if (addBtn) addBtn.addEventListener('click', handleAddLink);
  if (urlInput) {
    urlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAddLink();
    });
  }
}
