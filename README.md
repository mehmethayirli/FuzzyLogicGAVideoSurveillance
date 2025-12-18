# Video Surveillance System Optimization

Intelligent camera placement and alarm decision system using Genetic Algorithm and Fuzzy Logic.

## Overview

This project optimizes video surveillance systems by:
- **Genetic Algorithm (GA)**: Finding optimal camera positions to maximize area coverage
- **Fuzzy Logic**: Making intelligent alarm decisions based on movement, distance, and time

## Features

- **Automated Camera Placement**: GA evolves camera positions over 50 generations
- **Smart Alarm System**: Fuzzy logic evaluates threat levels using multiple parameters
- **Real-time Visualization**: ASCII grid display showing camera coverage
- **Performance Metrics**: Tracks optimization progress and coverage quality

## Quick Start

```bash
npm install
npm start
```

## How It Works

### Genetic Algorithm
1. Generates 20 random camera configurations
2. Evaluates each using fitness function (coverage × movement priority)
3. Selects best performers and creates new generation via crossover and mutation
4. Repeats for 50 generations, improving score by ~28%

### Fuzzy Logic
Evaluates three parameters:
- **Movement Level**: Low (0-3) / Medium (3-7) / High (7-10)
- **Distance**: Close (0-2) / Medium (2-4) / Far (4+)
- **Time**: Night (22:00-06:00) / Day (06:00-22:00)

**Decision Rule**: `Alarm = (movement × 0.4) + (distance × 0.4) + (time × 0.2)`

## Results

```
Generation 0:  Score = 17.43
Generation 30: Score = 22.39 (optimal found)
Improvement: 28%

Coverage: ~90% of surveillance area
All targets within camera range
```

## Technical Details

- **Language**: TypeScript
- **Runtime**: Node.js
- **Grid Size**: 10×10
- **Cameras**: 3 units with 4-5 range
- **Population**: 20 individuals
- **Generations**: 50
- **Mutation Rate**: 10%

## Code Structure

```typescript
fitness()           // Evaluates camera placement quality
fuzzyAlarm()        // Makes alarm decisions
geneticAlgorithm()  // Main GA optimization loop
drawGrid()          // Visualizes results
```

## Applications

- Shopping malls and airports
- Smart home security
- Traffic monitoring
- Industrial facility surveillance
- Border security with drones
