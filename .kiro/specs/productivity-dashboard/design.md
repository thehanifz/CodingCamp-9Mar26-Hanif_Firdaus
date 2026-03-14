# Design Document: Productivity Dashboard

## Overview

The Productivity Dashboard is a client-side web application that provides essential productivity tools in a single, unified interface. The application consists of four core components: a greeting display with real-time clock, a focus timer for time management, a to-do list for task tracking, and a quick links manager for website bookmarks.

The architecture follows a simple, vanilla JavaScript approach with no external dependencies. All application state is managed in-memory and persisted to the browser's Local Storage API. The design prioritizes simplicity, maintainability, and instant responsiveness while ensuring data persistence across browser sessions.

Key design principles:
- Single-page application with no page reloads
- Event-driven architecture for UI updates
- Synchronous Local Storage operations for immediate persistence
- Modular component structure within a single JavaScript file
- Separation of concerns: HTML for structure, CSS for presentation, JavaScript for behavior

## Architecture

### System Architecture

The application follows a client-side MVC-inspired pattern:

```
┌─────────────────────────────────────────────────┐
│                  Browser                         │
│  ┌───────────────────────────────────────────┐  │
│  │           index.html (View)               │  │
│  │  ┌─────────────┐  ┌──────────────────┐   │  │
│  │  │  Greeting   │  │   Focus Timer    │   │  │
│  │  │  Display    │  │                  │   │  │
│  │  └─────────────┘  └──────────────────┘   │  │
│  │  ┌─────────────┐  ┌──────────────────┐   │  │
│  │  │  To-Do List │  │   Quick Links    │   │  │
│  │  │             │  │                  │   │  │
│  │  └─────────────┘  └──────────────────┘   │  │
│  └───────────────────────────────────────────┘  │
│                      ↕                           │
│  ┌───────────────────────────────────────────┐  │
│  │      script.js (Controller + Model)       │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Event Handlers & UI Controllers    │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  State Management & Business Logic  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Local Storage Interface            │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
│                      ↕                           │
│  ┌───────────────────────────────────────────┐  │
│  │         Local Storage API                 │  │
│  │  ┌─────────────┐  ┌──────────────────┐   │  │
│  │  │   tasks     │  │   quickLinks     │   │  │
│  │  └─────────────┘  └──────────────────┘   │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Component Architecture

The application is organized into four independent components:

1. **Greeting Display Component**
   - Manages time/date display and greeting message
   - Updates every second via setInterval
   - No persistence required (computed from current time)

2. **Focus Timer Component**
   - Manages countdown timer state (running, paused, stopped)
   - Updates display every second when active
   - State: remaining time, timer status
   - No persistence (resets on page load)

3. **Task Manager Component**
   - CRUD operations for tasks
   - Persists to Local Storage on every change
   - State: array of task objects
   - Renders task list dynamically

4. **Quick Links Component**
   - CRUD operations for links
   - Persists to Local Storage on every change
   - State: array of link objects
   - Renders link buttons dynamically

### Data Flow

```
User Action → Event Handler → Update In-Memory State → 
  Update Local Storage → Update DOM
```

For time-based components (greeting, timer):
```
setInterval → Calculate New Value → Update DOM
```

## Components and Interfaces

### 1. Greeting Display Component

**Responsibilities:**
- Display current time in 12-hour format
- Display current date with day of week
- Display time-appropriate greeting
- Update display every second

**Interface:**
```javascript
// Initialization
function initGreeting()

// Update functions
function updateTime()
function updateDate()
function updateGreeting()

// Helper functions
function formatTime(date) // Returns "HH:MM:SS AM/PM"
function formatDate(date) // Returns "Day, Month Date"
function getGreeting(hour) // Returns greeting based on hour
```

**DOM Elements:**
- `#time-display` - Shows formatted time
- `#date-display` - Shows formatted date
- `#greeting-text` - Shows greeting message

### 2. Focus Timer Component

**Responsibilities:**
- Manage timer countdown
- Handle start/stop/reset controls
- Display time in MM:SS format
- Stop at zero

**Interface:**
```javascript
// State
let timerState = {
  remainingSeconds: 1500, // 25 minutes default
  isRunning: false,
  intervalId: null
}

// Initialization
function initTimer()

// Control functions
function startTimer()
function stopTimer()
function resetTimer()

// Update functions
function updateTimerDisplay()
function tick() // Decrements timer by 1 second

// Helper functions
function formatTimerDisplay(seconds) // Returns "MM:SS"
```

**DOM Elements:**
- `#timer-display` - Shows MM:SS countdown
- `#start-btn` - Start button
- `#stop-btn` - Stop button
- `#reset-btn` - Reset button

### 3. Task Manager Component

**Responsibilities:**
- Create, read, update, delete tasks
- Persist tasks to Local Storage
- Render task list
- Handle task completion toggling

**Interface:**
```javascript
// State
let tasks = [] // Array of task objects

// Initialization
function initTasks()
function loadTasks() // Load from Local Storage

// CRUD operations
function addTask(text)
function editTask(id, newText)
function deleteTask(id)
function toggleTaskComplete(id)

// Persistence
function saveTasks() // Save to Local Storage

// Rendering
function renderTasks()
function createTaskElement(task) // Returns DOM element

// Helper functions
function generateTaskId() // Returns unique ID
```

**Data Structure:**
```javascript
{
  id: string,        // Unique identifier
  text: string,      // Task description
  completed: boolean, // Completion status
  createdAt: number  // Timestamp
}
```

**DOM Elements:**
- `#task-input` - Input field for new tasks
- `#add-task-btn` - Add task button
- `#task-list` - Container for task items
- `.task-item` - Individual task elements (dynamically created)

### 4. Quick Links Component

**Responsibilities:**
- Create, read, delete quick links
- Persist links to Local Storage
- Render link buttons
- Open links in new tabs
- Validate URLs

**Interface:**
```javascript
// State
let quickLinks = [] // Array of link objects

// Initialization
function initQuickLinks()
function loadQuickLinks() // Load from Local Storage

// CRUD operations
function addQuickLink(name, url)
function deleteQuickLink(id)

// Persistence
function saveQuickLinks() // Save to Local Storage

// Rendering
function renderQuickLinks()
function createLinkElement(link) // Returns DOM element

// Helper functions
function generateLinkId() // Returns unique ID
function validateUrl(url) // Returns boolean
function normalizeUrl(url) // Adds protocol if missing
```

**Data Structure:**
```javascript
{
  id: string,   // Unique identifier
  name: string, // Display name
  url: string   // Full URL with protocol
}
```

**DOM Elements:**
- `#link-name-input` - Input for link name
- `#link-url-input` - Input for link URL
- `#add-link-btn` - Add link button
- `#links-container` - Container for link buttons
- `.link-btn` - Individual link buttons (dynamically created)

### Application Initialization

**Main initialization flow:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
  initGreeting()
  initTimer()
  initTasks()
  initQuickLinks()
})
```

## Data Models

### Task Model

```javascript
{
  id: string,        // UUID or timestamp-based unique ID
  text: string,      // Task description (1-500 characters)
  completed: boolean, // Completion status
  createdAt: number  // Unix timestamp (milliseconds)
}
```

**Constraints:**
- `id`: Must be unique across all tasks
- `text`: Non-empty string, trimmed of whitespace
- `completed`: Boolean value (true/false)
- `createdAt`: Positive integer timestamp

**Local Storage Key:** `"tasks"`
**Storage Format:** JSON array of task objects

### Quick Link Model

```javascript
{
  id: string,   // UUID or timestamp-based unique ID
  name: string, // Display name (1-50 characters)
  url: string   // Full URL with protocol
}
```

**Constraints:**
- `id`: Must be unique across all links
- `name`: Non-empty string, trimmed of whitespace
- `url`: Valid URL with http:// or https:// protocol

**Local Storage Key:** `"quickLinks"`
**Storage Format:** JSON array of link objects

### Timer State Model

```javascript
{
  remainingSeconds: number, // Seconds remaining (0-7200)
  isRunning: boolean,       // Timer active status
  intervalId: number|null   // setInterval ID or null
}
```

**Note:** Timer state is not persisted to Local Storage. It resets to default (1500 seconds / 25 minutes) on page load.

### Local Storage Schema

**Key-Value Pairs:**
- `"tasks"`: JSON string of task array
- `"quickLinks"`: JSON string of link array
- `"theme"` (optional): String ("light" or "dark")
- `"timerDuration"` (optional): Number (seconds)

**Example Local Storage State:**
```javascript
{
  "tasks": '[{"id":"1","text":"Complete design doc","completed":false,"createdAt":1704067200000}]',
  "quickLinks": '[{"id":"1","name":"GitHub","url":"https://github.com"}]'
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies:
- Properties 1.3-1.6 (greeting for different time ranges) can be combined into a single comprehensive property about greeting correctness
- Properties 3.5 and 3.7 overlap - 3.7 is more comprehensive and subsumes 3.5
- Properties 8.1 and 8.2 are specific instances of the general round-trip property 8.5
- Timer properties 2.2 and 2.3 can be combined into a property about state preservation

The following properties represent the minimal, non-redundant set that provides complete validation coverage:

### Property 1: Time Format Validity

*For any* Date object, the formatted time string should match the 12-hour format pattern "HH:MM:SS AM/PM" where HH is 01-12, MM and SS are 00-59, and the period is either AM or PM.

**Validates: Requirements 1.1**

### Property 2: Date Format Completeness

*For any* Date object, the formatted date string should contain the day of week, month name, and day of month.

**Validates: Requirements 1.2**

### Property 3: Greeting Correctness

*For any* hour value (0-23), the greeting function should return:
- "Good Morning" for hours 5-11
- "Good Afternoon" for hours 12-16
- "Good Evening" for hours 17-20
- "Good Night" for hours 21-23 and 0-4

**Validates: Requirements 1.3, 1.4, 1.5, 1.6**

### Property 4: Timer Format Validity

*For any* non-negative integer representing seconds, the timer display format should produce a string matching "MM:SS" where MM is 00-99 and SS is 00-59.

**Validates: Requirements 2.5**

### Property 5: Timer State Preservation

*For any* timer state with remaining time, starting then immediately stopping the timer should preserve the remaining time value.

**Validates: Requirements 2.2, 2.3**

### Property 6: Task Creation Persistence

*For any* non-empty task text, creating a task should result in the task list length increasing by one and the new task appearing in Local Storage.

**Validates: Requirements 3.1, 3.5**

### Property 7: Task Editing Preservation

*For any* existing task and any new non-empty text, editing the task should preserve the task's id and createdAt timestamp while updating only the text field.

**Validates: Requirements 3.2**

### Property 8: Task Deletion Completeness

*For any* task list and any task id in that list, deleting the task should result in a task list that does not contain that id and has length decreased by one.

**Validates: Requirements 3.4**

### Property 9: Task State Synchronization

*For any* task operation (create, edit, delete, toggle complete), the task list in Local Storage should be identical to the in-memory task list after the operation completes.

**Validates: Requirements 3.7**

### Property 10: Quick Link Creation Persistence

*For any* valid link name and URL with protocol, creating a quick link should result in the link collection length increasing by one and the new link appearing in Local Storage.

**Validates: Requirements 4.1, 4.3**

### Property 11: Quick Link Deletion Completeness

*For any* link collection and any link id in that collection, deleting the link should result in a collection that does not contain that id and has length decreased by one.

**Validates: Requirements 4.5**

### Property 12: URL Protocol Validation

*For any* URL string, the validation function should return true only if the URL starts with "http://" or "https://", and false otherwise.

**Validates: Requirements 4.6**

### Property 13: Task Persistence Round-Trip

*For any* valid task array, serializing to JSON, storing in Local Storage, retrieving from Local Storage, and parsing should produce an equivalent task array with identical ids, text, completed status, and createdAt timestamps.

**Validates: Requirements 8.1, 8.5**

### Property 14: Quick Link Persistence Round-Trip

*For any* valid quick link array, serializing to JSON, storing in Local Storage, retrieving from Local Storage, and parsing should produce an equivalent link array with identical ids, names, and URLs.

**Validates: Requirements 8.2, 8.5**

### Property 15: Task ID Uniqueness

*For any* sequence of task creation operations, all generated task IDs should be unique (no duplicates in the task list).

**Validates: Requirements 3.1** (implicit requirement for data integrity)

### Property 16: Link ID Uniqueness

*For any* sequence of quick link creation operations, all generated link IDs should be unique (no duplicates in the link collection).

**Validates: Requirements 4.1** (implicit requirement for data integrity)

## Error Handling

### Local Storage Errors

**Quota Exceeded:**
- Catch `QuotaExceededError` when writing to Local Storage
- Display user-friendly error message: "Storage limit reached. Please delete some items."
- Prevent the operation from completing
- Log error to console for debugging

**Corrupted Data:**
- Wrap all `JSON.parse()` calls in try-catch blocks
- On parse error, log warning to console
- Initialize with empty array for that data type
- Continue application execution normally

**Storage Unavailable:**
- Check for Local Storage availability on initialization
- If unavailable (private browsing, disabled), show warning message
- Allow application to function with in-memory state only
- Warn user that data will not persist

### Input Validation Errors

**Empty Task Text:**
- Trim whitespace from input
- If resulting string is empty, prevent task creation
- Optionally show validation message: "Task cannot be empty"
- Keep focus on input field

**Invalid URL:**
- Validate URL format before creating quick link
- If missing protocol, attempt to prepend "https://"
- If still invalid, show error: "Please enter a valid URL"
- Keep focus on URL input field

**Malformed Data:**
- Validate data structure when loading from Local Storage
- Check for required fields (id, text/name, etc.)
- Filter out invalid entries
- Log warnings for malformed data

### Timer Edge Cases

**Timer at Zero:**
- When timer reaches 0, stop the countdown
- Clear the interval to prevent negative values
- Keep display at "00:00"
- Optionally trigger completion notification

**Rapid Button Clicks:**
- Disable buttons during state transitions
- Prevent multiple simultaneous intervals
- Clear existing interval before starting new one

### DOM Manipulation Errors

**Missing Elements:**
- Check for element existence before manipulation
- Log error if required element not found
- Fail gracefully without crashing application

**Event Handler Errors:**
- Wrap event handlers in try-catch
- Log errors to console
- Prevent error propagation that could break other components

## Testing Strategy

### Overview

The testing strategy employs a dual approach combining unit tests for specific examples and edge cases with property-based tests for universal correctness guarantees. This ensures both concrete behavior validation and comprehensive input coverage.

### Property-Based Testing

**Framework:** fast-check (JavaScript property-based testing library)

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with feature name and property reference
- Tag format: `// Feature: productivity-dashboard, Property N: [property text]`

**Property Test Coverage:**

1. **Time and Date Formatting (Properties 1-3)**
   - Generate random Date objects
   - Verify format patterns and greeting logic
   - Test boundary hours (0, 4, 5, 11, 12, 16, 17, 20, 21, 23)

2. **Timer Functionality (Properties 4-5)**
   - Generate random second values (0-7200)
   - Verify format correctness
   - Test state preservation across start/stop cycles

3. **Task Management (Properties 6-9, 13, 15)**
   - Generate random task arrays with varying sizes
   - Generate random task text (1-500 characters)
   - Test CRUD operations maintain invariants
   - Verify round-trip serialization
   - Verify ID uniqueness across operations

4. **Quick Links Management (Properties 10-12, 14, 16)**
   - Generate random link collections
   - Generate random URLs with/without protocols
   - Test CRUD operations maintain invariants
   - Verify round-trip serialization
   - Verify ID uniqueness across operations

**Example Property Test Structure:**
```javascript
// Feature: productivity-dashboard, Property 13: Task Persistence Round-Trip
fc.assert(
  fc.property(
    fc.array(taskArbitrary), // Generate random task arrays
    (tasks) => {
      const serialized = JSON.stringify(tasks);
      localStorage.setItem('tasks', serialized);
      const retrieved = localStorage.getItem('tasks');
      const deserialized = JSON.parse(retrieved);
      return deepEqual(tasks, deserialized);
    }
  ),
  { numRuns: 100 }
);
```

### Unit Testing

**Framework:** Jest or Mocha (standard JavaScript testing frameworks)

**Unit Test Coverage:**

1. **Specific Examples:**
   - Timer initializes to 25 minutes (1500 seconds)
   - Reset button returns timer to 25 minutes
   - Empty task text is rejected
   - URL without protocol gets "https://" prepended

2. **Edge Cases:**
   - Timer at zero stops counting
   - Corrupted Local Storage data initializes empty arrays
   - Storage quota exceeded shows error message
   - Task list with 100 items renders correctly
   - Link collection with 50 items renders correctly

3. **Integration Points:**
   - DOM event handlers trigger correct functions
   - Local Storage operations complete before UI updates
   - Multiple components don't interfere with each other

4. **Error Conditions:**
   - JSON.parse() with invalid data throws and recovers
   - Missing DOM elements log errors gracefully
   - Rapid button clicks don't create race conditions

**Example Unit Test:**
```javascript
describe('Timer Initialization', () => {
  test('should initialize to 25 minutes', () => {
    initTimer();
    expect(timerState.remainingSeconds).toBe(1500);
    expect(timerState.isRunning).toBe(false);
  });
});
```

### Testing Balance

- Property tests handle comprehensive input coverage (100+ random inputs per property)
- Unit tests focus on specific examples, edge cases, and integration points
- Avoid writing excessive unit tests for cases covered by properties
- Use unit tests for concrete scenarios that demonstrate correct behavior
- Use property tests for universal rules that must hold for all inputs

### Manual Testing Checklist

Since this is a UI-heavy application, manual testing is essential:

1. **Cross-Browser Testing:**
   - Test in Chrome, Firefox, Edge, Safari
   - Verify Local Storage works in all browsers
   - Check visual consistency across browsers

2. **User Interaction Flow:**
   - Complete full workflow: add tasks, start timer, add links
   - Verify all buttons respond correctly
   - Check visual feedback on hover/click

3. **Data Persistence:**
   - Add data, close browser, reopen
   - Verify all data restored correctly
   - Test with browser in private/incognito mode

4. **Visual Design:**
   - Verify layout on different screen sizes
   - Check color contrast and readability
   - Ensure visual hierarchy is clear

5. **Performance:**
   - Test with 100 tasks and 50 links
   - Verify no noticeable lag
   - Check timer updates smoothly

### Test Execution

**Automated Tests:**
```bash
# Run all tests
npm test

# Run property tests only
npm test -- --grep "Property"

# Run unit tests only
npm test -- --grep "Unit"

# Run with coverage
npm test -- --coverage
```

**Note:** Since the requirement specifies no test setup is required for the MVP, the testing strategy above is provided as guidance for future development and quality assurance. The application should be manually tested during development to ensure correctness.

