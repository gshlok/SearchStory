# The Samurai's Quest - Search Algorithm Visualizer

An immersive, interactive visualization of both binary and linear search algorithms presented as a samurai-themed educational experience. Follow the warrior's journey as he searches through ancient scrolls using the sacred search techniques.

![Search Algorithm Visualization]

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Design Guidelines](#design-guidelines)
- [License](#license)

## Features

- 🎮 **Interactive Visualization**: Watch both binary and linear search algorithms in action with animated elements
- 🧘 **Samurai Theme**: Engaging narrative with sprite animations and immersive environment
- 🎵 **Atmospheric Soundtrack**: Background music to enhance the experience
- 🌧️ **Dynamic Weather Effects**: Rain effects that activate during the journey
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Dark Mode UI**: Beautiful dark-themed interface with gradient accents
- ⚡ **Real-time Animations**: Smooth transitions and visual feedback
- 🎯 **Educational Experience**: Learn search algorithms through storytelling
- 🔍 **Algorithm Comparison**: Dedicated technique page comparing binary and linear search
- 🎨 **Custom Scrollbars**: Beautifully styled scrollbars throughout the application

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS + Lucide Icons
- **State Management**: React Query (TanStack)
- **Routing**: Wouter
- **Build Tool**: Vite
- **Animations**: Framer Motion + CSS Animations
- **Asset Handling**: Vite asset imports

## Prerequisites

- Node.js (version 16 or higher)
- npm (version 8 or higher) or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/SearchStory.git
   ```

2. Navigate to the project directory:
   ```bash
   cd SearchStory
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
   or with yarn:
   ```bash
   yarn install
   ```

## Development

To start the development server:

```bash
npm run dev
```

This will start the frontend development server on `http://localhost:5173`.

You can also run specific parts of the development environment:

```bash
# Frontend only
npm run dev:client
```

## Building for Production

To create a production build:

```bash
npm run build
```

This will build the frontend using Vite and output everything to the `dist/` directory.

To run the production build locally:

```bash
npm run preview
```

## Project Structure

```
SearchStory/
├── client/                 # Frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main application component
│   │   └── main.tsx       # Entry point
│   └── index.html         # HTML template
├── attached_assets/       # Game assets and images
├── design_guidelines.md   # UI/UX design specifications
├── problem_statement.txt  # Algorithm problem description
└── ...
```

## How It Works

The application visualizes both binary and linear search algorithms through a samurai-themed narrative:

### Binary Search
1. **The Setup**: A samurai faces a line of wooden planks (array elements) arranged in increasing order
2. **The Quest**: The samurai seeks a specific plank height (target value)
3. **The Technique**: Instead of checking every plank, the samurai uses binary search:
   - Compare the target with the middle plank
   - Eliminate half of the remaining planks based on the comparison
   - Repeat until the target is found or determined to be absent
4. **Visual Feedback**: 
   - Sprite character moves to inspect planks
   - Eliminated planks fade out with visual effects
   - Success is celebrated with animations

### Linear Search
1. **The Setup**: A samurai faces a line of wooden planks (array elements) in any order
2. **The Quest**: The samurai seeks a specific plank height (target value)
3. **The Technique**: The samurai checks each plank one by one:
   - Compare the target with each plank sequentially
   - Continue until the target is found or all planks are checked
4. **Visual Feedback**: 
   - Sprite character moves to inspect planks
   - Non-matching planks are eliminated with visual effects
   - Success is celebrated with animations

### Technique Comparison
A dedicated page compares both algorithms:
- Time complexity analysis
- C++ implementation examples
- Visual side-by-side comparison

### Key Components

- **BinarySearchVisualizer**: Binary search visualization component
- **LinearSearchVisualizer**: Linear search visualization component
- **TechniquePage**: Algorithm comparison page
- **SpriteAnimation**: Animated samurai character with different states
- **ArrayElement**: Visual representation of array elements
- **RainEffect**: Atmospheric weather effects
- **WindBlownText**: Animated text effects

## Design Guidelines

The project follows specific design principles outlined in [design_guidelines.md](design_guidelines.md):

- **Color Palette**: Dark mode optimized with vibrant accent colors
- **Typography**: Modern, readable fonts with appropriate sizing
- **Layout**: Responsive grid system with consistent spacing
- **Animations**: Purposeful animations that enhance understanding
- **Accessibility**: Proper contrast ratios and focus indicators
- **Custom Scrollbars**: Consistently styled scrollbars across all scrollable elements

## Problem Statement

The application visualizes the solution to the following problem:

> A disciplined samurai stands before a line of n wooden planks, each having a distinct height. The planks are arranged in strictly increasing order — from the shortest to the tallest.
> 
> The samurai is looking for a specific plank of height x. However, he refuses to look at every plank one by one. Instead, he uses his sharp senses to find whether the plank exists.
> 
> Your task is simple: determine whether the plank of height x is present among the n planks.