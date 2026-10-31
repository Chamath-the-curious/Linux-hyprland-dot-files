# YouTube Play Next Button Chrome Extension

A simple Chrome extension that makes YouTube's hidden "Next" button visible on single videos with keyboard shortcut support.

## Features

- 👁️ **Shows Hidden Button**: Makes YouTube's native "Next" button visible when it's hidden
- 🎨 **Native Design**: Uses YouTube's original button design and functionality
- 🔄 **Smart Detection**: Automatically shows/hides based on YouTube's button state
- 📱 **Seamless Integration**: Works perfectly with YouTube's existing interface
- ⌨️ **Native Shortcuts**: YouTube's built-in `Shift + N` shortcut works on all videos

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will be installed and ready to use

## Usage

- Navigate to any YouTube video page
- The extension automatically makes YouTube's "Next" button visible when it's hidden
- Click the button to play the next video, or use YouTube's native `Shift + N` shortcut

## How It Works

The extension employs a multi-layered resilience strategy:
1. **SVG Path Fingerprinting**: Identifies the "Next" button by its unique icon geometry, making it immune to CSS class name changes.
2. **Native API Interaction**: Injects a script to interface directly with YouTube's `movie_player.nextVideo()` API, bypassing the DOM entirely if needed.
3. **SPA Lifecycle Management**: Uses `MutationObserver` to track YouTube's dynamic page transitions without requiring full reloads.
4. **Visibility Overrides**: Forcefully restores hidden native elements by monitoring and overriding `display` state changes.

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main script that shows hidden buttons and handles interactions
- `icon*.png` - Extension icons (16x16, 48x48, 128x128)

## Browser Compatibility

- Chrome (Manifest V3)
- Other Chromium-based browsers (Edge, Brave, etc.)

## Notes

- The extension only works on YouTube video pages (`/watch` and `/embed/`)
- It automatically detects page changes in YouTube's single-page application
- The button visibility is managed automatically based on YouTube's state
- When YouTube shows its own next button (in playlists), the extension does nothing
