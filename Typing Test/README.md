

# Typing Speed Test

A fast, responsive, and clean typing speed test built with **HTML**, **CSS**, and **JavaScript**. This tool allows users to test their typing speed, accuracy, and error count within a 60-second window using dynamically generated text based on selected difficulty levels.

## Features

* 60-Second Timer: Standard typing duration with real-time countdown.
* Difficulty Selector: Choose from Easy, Medium, or Hard text prompts.
* Live Feedback: Real-time WPM, accuracy, and error tracking.
* Dynamic UI: Text characters are color-coded as correct, incorrect, or current.
* Result Summary: Shows final WPM, accuracy, character count, and error count.
* Reset & Restart: Quickly restart the test with one click.
* Performance-Oriented Design: Fast rendering, zero libraries, just pure JS.

## How It Works

* **Text Generation**: Based on the selected difficulty, a random sentence is chosen from a predefined pool.
* **Input Tracking**: As you type, each character is checked against the corresponding character in the prompt.
* **WPM Calculation**: Based on the total number of characters typed divided by 5, scaled to elapsed time.
* **Accuracy**: Calculated as the percentage of correct characters out of total characters typed.

## File Structure

```
typing-speed-test/
├── index.html         # Main HTML file
├── style.css          # Styling for layout and feedback visuals
└── script.js          # Core logic for the typing test
```

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/typing-speed-test.git
   cd typing-speed-test
   ```

2. Open `index.html` in your browser:

   ```
   open index.html
   ```

   Or simply double-click the file.

## Customization Ideas

* Add more diverse sentence banks
* Allow adjustable test duration (30s, 60s, 120s)
* Theme switcher (dark/light mode)
* Add user performance tracking with backend
* Implement leaderboard or multiplayer mode
* Support paragraph typing (multi-line text)

## Technologies Used

* HTML5
* CSS3 (Flexbox and Grid)
* JavaScript (Vanilla JS)
