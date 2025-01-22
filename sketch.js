let video;
let handPose;
let hands = [];
let score = 0;
let treasures = [];
let bombs = [];
let gameOver = false;

function preload() {
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  if (gameOver) {
    resetGame(); // Reinicia el juego si está en estado "Game Over"
  }
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  handPose.detectStart(video, gotHands);

  // Genera tesoros y bombas
  for (let i = 0; i < 5; i++) {
    treasures.push(createTreasure());
    bombs.push(createBomb());
  }
}

function draw() {
  if (gameOver) {
    background(0);
    textSize(32);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("¡GAME OVER!", width / 2, height / 2);
    textSize(24);
    text("Haz clic para jugar de nuevo", width / 2, height / 2 + 40);
    return; // No actualiza nada más cuando está en "Game Over"
  }

  background(200);
  image(video, 0, 0, width, height);

  if (hands.length > 0) {
    let hand = hands[0];
    let index = hand.index_finger_tip;
    noStroke();
    fill(255, 255, 255);
    circle(index.x, index.y, 20);

    // Revisar si el dedo toca un tesoro
    for (let i = treasures.length - 1; i >= 0; i--) {
      let treasure = treasures[i];
      if (dist(index.x, index.y, treasure.x, treasure.y) < treasure.size / 2) {
        score++;
        treasures.splice(i, 1);
        treasures.push(createTreasure()); // Reemplaza el tesoro tocado
      }
    }

    // Revisar si el dedo toca una bomba
    for (let i = bombs.length - 1; i >= 0; i--) {
      let bomb = bombs[i];
      if (dist(index.x, index.y, bomb.x, bomb.y) < bomb.size / 2) {
        gameOver = true; // Termina el juego si toca una bomba
      }
    }
  }

  // Mostrar puntuación
  fill(0);
  textSize(24);
  text(`Puntos: ${score}`, 10, 30); // Coloca el texto en la parte superior izquierda

  // Actualizar y mostrar los tesoros
  for (let treasure of treasures) {
    treasure.y += treasure.speed;
    fill(115, 1855, 95);
    noStroke();
    ellipse(treasure.x, treasure.y, treasure.size);
    if (treasure.y > height) {
      treasure.y = random(-500, -50);
      treasure.x = random(width);
    }
  }

  // Actualizar y mostrar las bombas
  for (let bomb of bombs) {
    bomb.y += bomb.speed;
    fill(186, 45, 11);
    noStroke();
    ellipse(bomb.x, bomb.y, bomb.size);
    if (bomb.y > height) {
      bomb.y = random(-500, -50);
      bomb.x = random(width);
    }
  }
}

// Función para crear un tesoro
function createTreasure() {
  return {
    x: random(width),
    y: random(-500, -50), // Comienza fuera de la pantalla
    size: random(50, 60),
    speed: random(1, 4), // Velocidad reducida para que caiga más lentamente
  };
}

// Función para crear una bomba
function createBomb() {
  return {
    x: random(width),
    y: random(-500, -50), // Comienza fuera de la pantalla
    size: random(50, 70),
    speed: random(1, 7), // Velocidad reducida para que caiga más lentamente
  };
}

// Función para reiniciar el juego
function resetGame() {
  score = 0;
  gameOver = false;
  treasures = [];
  bombs = [];
  // Genera los objetos nuevamente
  for (let i = 0; i < 5; i++) {
    treasures.push(createTreasure());
    bombs.push(createBomb());
  }
}
