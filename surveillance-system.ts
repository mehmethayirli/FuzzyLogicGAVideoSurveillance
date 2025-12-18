type Camera = { x: number; y: number; range: number };
type Target = { x: number; y: number; movement: number };

const GRID_SIZE = 10;
const POPULATION_SIZE = 20;
const GENERATIONS = 50;
const MUTATION_RATE = 0.1;

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function fuzzyAlarm(movement: number, dist: number, hour: number): number {
  const movementLevel = movement < 3 ? 0.2 : movement < 7 ? 0.6 : 1.0;
  const distLevel = dist > 4 ? 0.1 : dist > 2 ? 0.5 : 1.0;
  const timeLevel = (hour >= 22 || hour <= 6) ? 1.0 : 0.3;
  
  return (movementLevel * 0.4 + distLevel * 0.4 + timeLevel * 0.2);
}

function fitness(cameras: Camera[], targets: Target[]): number {
  let score = 0;
  
  for (const target of targets) {
    let bestCoverage = 0;
    
    for (const camera of cameras) {
      const dist = distance(camera.x, camera.y, target.x, target.y);
      if (dist <= camera.range) {
        const coverage = 1 - (dist / camera.range);
        bestCoverage = Math.max(bestCoverage, coverage);
      }
    }
    
    score += bestCoverage * target.movement;
  }
  
  return score;
}

function createRandomCameras(count: number): Camera[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * GRID_SIZE,
    y: Math.random() * GRID_SIZE,
    range: 3 + Math.random() * 2
  }));
}

function crossover(parent1: Camera[], parent2: Camera[]): Camera[] {
  const child: Camera[] = [];
  for (let i = 0; i < parent1.length; i++) {
    child.push(Math.random() > 0.5 ? { ...parent1[i] } : { ...parent2[i] });
  }
  return child;
}

function mutate(cameras: Camera[]): Camera[] {
  return cameras.map(cam => {
    if (Math.random() < MUTATION_RATE) {
      return {
        x: Math.max(0, Math.min(GRID_SIZE, cam.x + (Math.random() - 0.5) * 2)),
        y: Math.max(0, Math.min(GRID_SIZE, cam.y + (Math.random() - 0.5) * 2)),
        range: Math.max(2, Math.min(5, cam.range + (Math.random() - 0.5)))
      };
    }
    return cam;
  });
}

function geneticAlgorithm(targets: Target[], cameraCount: number): Camera[] {
  let population = Array.from({ length: POPULATION_SIZE }, () => 
    createRandomCameras(cameraCount)
  );
  
  for (let gen = 0; gen < GENERATIONS; gen++) {
    const scores = population.map(individual => ({
      individual,
      score: fitness(individual, targets)
    }));
    
    scores.sort((a, b) => b.score - a.score);
    
    if (gen % 10 === 0) {
      console.log(`Nesil ${gen}: En iyi skor = ${scores[0].score.toFixed(2)}`);
    }
    
    const newPopulation: Camera[][] = [scores[0].individual, scores[1].individual];
    
    while (newPopulation.length < POPULATION_SIZE) {
      const parent1 = scores[Math.floor(Math.random() * 10)].individual;
      const parent2 = scores[Math.floor(Math.random() * 10)].individual;
      const child = mutate(crossover(parent1, parent2));
      newPopulation.push(child);
    }
    
    population = newPopulation;
  }
  
  const finalScores = population.map(ind => ({ ind, score: fitness(ind, targets) }));
  finalScores.sort((a, b) => b.score - a.score);
  
  return finalScores[0].ind;
}

console.log("=== VİDEO GÖZETİM SİSTEMİ ===\n");

const targets: Target[] = [
  { x: 2, y: 3, movement: 8 },
  { x: 7, y: 7, movement: 5 },
  { x: 5, y: 2, movement: 9 },
  { x: 8, y: 4, movement: 3 }
];

console.log("Hedefler:", targets);
console.log("\n--- GENETİK ALGORİTMA ÇALIŞIYOR ---\n");

const bestCameras = geneticAlgorithm(targets, 3);

console.log("\n--- OPTİMAL KAMERA POZİSYONLARI ---");
bestCameras.forEach((cam, i) => {
  console.log(`Kamera ${i + 1}: (${cam.x.toFixed(1)}, ${cam.y.toFixed(1)}), Menzil: ${cam.range.toFixed(1)}`);
});

console.log("\n--- BULANIK MANTIK ALARM SİSTEMİ ---");
const currentHour = 23;

targets.forEach((target, i) => {
  const nearestCam = bestCameras.reduce((nearest, cam) => {
    const d = distance(cam.x, cam.y, target.x, target.y);
    return d < nearest.dist ? { cam, dist: d } : nearest;
  }, { cam: bestCameras[0], dist: Infinity });
  
  const alarmLevel = fuzzyAlarm(target.movement, nearestCam.dist, currentHour);
  const status = alarmLevel > 0.6 ? "🚨 ALARM" : alarmLevel > 0.3 ? "⚠️  DİKKAT" : "✅ NORMAL";
  
  console.log(`Hedef ${i + 1}: Hareket=${target.movement}, Mesafe=${nearestCam.dist.toFixed(1)} → ${status} (${(alarmLevel * 100).toFixed(0)}%)`);
});

function drawGrid(cameras: Camera[], targets: Target[]): void {
  console.log("\n--- GÖRSELLEŞTİRME ---\n");

  for (let y = GRID_SIZE; y >= 0; y--) {
    let line = y.toString().padStart(2) + " │";

    for (let x = 0; x <= GRID_SIZE; x++) {
      let char = " · ";

      for (const target of targets) {
        if (Math.abs(target.x - x) < 0.5 && Math.abs(target.y - y) < 0.5) {
          const idx = targets.indexOf(target) + 1;
          char = ` ${idx} `;
        }
      }

      for (const camera of cameras) {
        if (Math.abs(camera.x - x) < 0.5 && Math.abs(camera.y - y) < 0.5) {
          const idx = cameras.indexOf(camera) + 1;
          char = ` K${idx}`;
        }
      }

      for (const camera of cameras) {
        const dist = distance(camera.x, camera.y, x, y);
        if (dist <= camera.range && dist > 0.5 && char === " · ") {
          char = " ○ ";
        }
      }

      line += char;
    }

    console.log(line);
  }

  console.log("   └" + "───".repeat(GRID_SIZE + 1));
  console.log("    " + Array.from({ length: GRID_SIZE + 1 }, (_, i) => i.toString().padStart(3)).join(""));

  console.log("\nLegend:");
  console.log("  K1, K2, K3 = Kameralar");
  console.log("  1, 2, 3, 4 = Hedefler");
  console.log("  ○ = Kamera menzili");
  console.log("  · = Boş alan");
}

drawGrid(bestCameras, targets);

console.log("\n✅ Sistem çalıştı!");

