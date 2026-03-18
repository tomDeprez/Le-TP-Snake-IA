# TP Snake & Machine Learning avec Brain.js

## Introduction

Ce TP vous permettra de comprendre les bases du **Machine Learning** (apprentissage automatique) en créant une IA capable de jouer au jeu Snake. Vous utiliserez **Brain.js**, une bibliothèque JavaScript de réseaux de neurones, pour entraîner votre IA à partir des données de jeu.

**Pourquoi Machine Learning et pas Deep Learning?**
Le Machine Learning avec des réseaux de neurones simples est parfait pour débuter car:
- Les concepts sont plus faciles à comprendre
- L'entraînement est rapide
- On peut visualiser facilement ce qui se passe
- C'est suffisant pour des problèmes comme Snake

---

## Structure du Projet

```
Snake-IA/
├── index.html          # Page HTML du jeu
├── css/
│   └── main.css       # Styles du jeu
└── js/
    └── main.js        # Logique du jeu Snake
```

---

## Objectif 1: Faire Grandir le Snake

### Contexte

Actuellement, le snake mange des pommes mais ne grandit pas. Dans le fichier `js/main.js:115`, vous trouverez ce commentaire:

```javascript
// Here you would also add code to grow the snake
```

### Votre Mission

Implémentez la fonctionnalité qui permet au snake de grandir quand il mange une pomme.

### Conseils

1. **Analysez le code actuel:**
   - Comment le snake est-il représenté? (un seul élément DOM pour l'instant)
   - Comment détecte-t-on qu'une pomme est mangée? (fonction `checkEatApple()`)
   - Comment le snake se déplace-t-il? (fonction `moveSnake()`)

2. **Réfléchissez à votre approche:**
   - Comment représenter un snake avec plusieurs segments?
   - Comment faire suivre chaque segment au précédent?
   - Où stocker la position de chaque segment?

3. **Testez votre code:**
   - Le snake grandit-il correctement?
   - Les segments suivent-ils bien le mouvement?
   - Y a-t-il des bugs visuels?

### Pourquoi cet objectif est important?

Comprendre ce code simple est essentiel pour la suite du TP. Vous devez être à l'aise avec:
- La manipulation du DOM
- La gestion des positions
- La logique du jeu

---

## Objectif 2: Machine Learning avec Brain.js

### Installation

Ajoutez Brain.js à votre projet en incluant cette ligne dans `index.html` avant votre script `main.js`:

```html
<script src="https://cdn.jsdelivr.net/npm/brain.js@2.0.0-beta.2"></script>
```

---

## Cours Complet: Machine Learning pour Snake

### Étape 1: Comprendre les Réseaux de Neurones

Un **réseau de neurones** est un système qui apprend à partir d'exemples, comme le cerveau humain.

#### Concepts Clés

1. **Entrées (Inputs):** Les données que vous donnez au réseau
2. **Sorties (Outputs):** La décision que le réseau prend
3. **Entraînement:** Le processus où le réseau apprend à partir d'exemples

#### Pour notre Snake:
- **Entrées:** Matrice représentant toute la carte du jeu
- **Sorties:** Direction à prendre (left, right, up, down)
- **Entraînement:** Apprendre à partir de bonnes parties jouées

---

### Étape 2: Collecter les Données

#### Qu'est-ce qu'une donnée de jeu?

Chaque fois que le snake prend une décision, on doit capturer:
- **L'état du jeu** (la carte complète du terrain)
- **L'action prise** (la direction choisie)

#### Représentation Matricielle (Approche Recommandée)

Au lieu de donner juste les positions X/Y, on représente **toute la carte** comme une grille:
- **0** = case vide
- **0.5** = snake
- **1** = pomme

**Pourquoi c'est mieux?**
- Le réseau "voit" tout le terrain d'un coup
- Plus facile à gérer quand le snake a plusieurs segments
- Représentation naturelle et visuelle
- Fonctionne quelle que soit la taille du terrain

#### Structure d'une Donnée

```javascript
{
    input: {
        // Matrice 8x8 aplatie (64 valeurs)
        // Le terrain 400x400px avec des cases de 50px = 8x8 cases
        cell_0_0: 0,      // Case [0,0] = vide
        cell_0_1: 0,      // Case [0,1] = vide
        cell_0_2: 0.5,    // Case [0,2] = snake
        // ... (64 valeurs au total)
        cell_7_7: 0       // Case [7,7] = vide
    },
    output: {
        left: 0,          // Aller à gauche
        right: 1,         // Aller à droite
        up: 0,            // Aller en haut
        down: 0           // Aller en bas
    }
}
```

#### Exemple Visuel

Imaginons cette situation:
```
[0  ][0  ][0  ][0  ][1  ][0  ][0  ][0  ]  <- Pomme en [0,4]
[0  ][0  ][0  ][0  ][0  ][0  ][0  ][0  ]
[0.5][0.5][0.5][0  ][0  ][0  ][0  ][0  ]  <- Snake sur 3 cases
[0  ][0  ][0  ][0  ][0  ][0  ][0  ][0  ]
[0  ][0  ][0  ][0  ][0  ][0  ][0  ][0  ]
[0  ][0  ][0  ][0  ][0  ][0  ][0  ][0  ]
[0  ][0  ][0  ][0  ][0  ][0  ][0  ][0  ]
[0  ][0  ][0  ][0  ][0  ][0  ][0  ][0  ]
```

#### Implémentation: Fonction de Collecte

```javascript
// Tableau pour stocker toutes les données
let trainingData = [];

// Configuration de la grille
const GRID_SIZE = 8; // Terrain 400px / 50px par case = 8x8

/**
 * Collecte une donnée de jeu
 * À appeler à chaque mouvement du snake
 */
function collectData(direction) {
    // Créer l'objet de données
    const data = {
        input: getGameStateMatrix(),
        output: getDirectionOutput(direction)
    };

    // Ajouter aux données d'entraînement
    trainingData.push(data);

    console.log('Donnée collectée:', trainingData.length);
}

/**
 * À ajouter dans la fonction moveSnake()
 * AVANT de bouger le snake
 */
function moveSnake(event) {
    // NOUVEAU: Collecter la donnée
    collectData(event);

    // Code existant...
    if (event == 'left') {
        snake.style.left = (parseInt(snake.style.left ? snake.style.left : 0) - snakeSize) + "px";
    }
    // ... reste du code
}
```

---

### Étape 3: Créer la Matrice du Jeu

#### Pourquoi une Matrice?

Une **matrice** représente la carte complète du jeu comme une grille 8x8:
- Les valeurs sont déjà normalisées (0, 0.5, ou 1)
- Le réseau "voit" tout l'environnement
- Plus facile à étendre (plusieurs segments de snake)

#### Fonction de Création de Matrice

```javascript
/**
 * Crée une matrice représentant l'état complet du jeu
 * @returns {Object} Matrice aplatie avec des clés cell_x_y
 */
function getGameStateMatrix() {
    // Créer une grille vide 8x8
    const matrix = {};

    // Initialiser toutes les cases à 0 (vide)
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            matrix[`cell_${row}_${col}`] = 0;
        }
    }

    // Placer le snake (0.5)
    const snakePositions = getSnakeGridPositions();
    snakePositions.forEach(pos => {
        if (pos.row >= 0 && pos.row < GRID_SIZE &&
            pos.col >= 0 && pos.col < GRID_SIZE) {
            matrix[`cell_${pos.row}_${pos.col}`] = 0.5;
        }
    });

    // Placer la pomme (1)
    const applePos = getAppleGridPosition();
    if (applePos) {
        matrix[`cell_${applePos.row}_${applePos.col}`] = 1;
    }

    return matrix;
}

/**
 * Convertit la position pixel du snake en position grille
 * @returns {Array} Tableau de positions {row, col}
 */
function getSnakeGridPositions() {
    const positions = [];

    // Position de la tête du snake
    const snakeRect = snake.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    const pixelX = snakeRect.left - containerRect.left;
    const pixelY = snakeRect.top - containerRect.top;

    const col = Math.floor(pixelX / snakeSize);
    const row = Math.floor(pixelY / snakeSize);

    positions.push({ row, col });

    // TODO: Ajouter les autres segments du snake ici
    // quand vous implémenterez la croissance (Objectif 1)

    return positions;
}

/**
 * Convertit la position pixel de la pomme en position grille
 * @returns {Object|null} Position {row, col} ou null
 */
function getAppleGridPosition() {
    const apple = document.querySelector('.apple');
    if (!apple) return null;

    const appleRect = apple.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    const pixelX = appleRect.left - containerRect.left;
    const pixelY = appleRect.top - containerRect.top;

    const col = Math.floor(pixelX / snakeSize);
    const row = Math.floor(pixelY / snakeSize);

    return { row, col };
}

/**
 * Convertit la direction en sortie normalisée (one-hot encoding)
 */
function getDirectionOutput(direction) {
    return {
        left: direction === 'left' ? 1 : 0,
        right: direction === 'right' ? 1 : 0,
        up: direction === 'up' ? 1 : 0,
        down: direction === 'down' ? 1 : 0
    };
}
```

#### Explication: One-Hot Encoding

Au lieu de dire "direction = 2", on utilise:
```javascript
// Direction RIGHT
{ left: 0, right: 1, up: 0, down: 0 }
```

C'est plus clair pour le réseau de neurones!

#### Visualiser la Matrice (Optionnel - Debug)

```javascript
/**
 * Affiche la matrice dans la console de façon visuelle
 */
function debugMatrix() {
    const matrix = getGameStateMatrix();
    let display = '\n';

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const value = matrix[`cell_${row}_${col}`];
            if (value === 0) display += '[   ]';
            else if (value === 0.5) display += '[S  ]'; // Snake
            else if (value === 1) display += '[A  ]';   // Apple
        }
        display += '\n';
    }

    console.log(display);
}
```

---

### Étape 4: Créer et Entraîner le Réseau

#### Créer le Réseau

```javascript
// Créer le réseau de neurones
let neuralNetwork = null;

function createNeuralNetwork() {
    neuralNetwork = new brain.NeuralNetwork({
        hiddenLayers: [32, 16],  // 2 couches cachées: 32 puis 16 neurones
        activation: 'sigmoid'     // Fonction d'activation
    });

    console.log('Réseau de neurones créé!');
}
```

#### Configuration Expliquée

- **Entrées:** 64 neurones (matrice 8x8)
- **hiddenLayers: [32, 16]** = 2 couches intermédiaires (32 neurones puis 16)
- **Sorties:** 4 neurones (left, right, up, down)
- **activation: 'sigmoid'** = Fonction qui transforme les valeurs (entre 0 et 1)

**Architecture complète:**
```
[64 inputs] → [32 neurones] → [16 neurones] → [4 outputs]
   Matrice        Couche 1       Couche 2      Directions
```

#### Fonction d'Entraînement

```javascript
/**
 * Entraîne le réseau de neurones avec les données collectées
 */
function trainNeuralNetwork() {
    if (trainingData.length < 10) {
        alert('Pas assez de données! Jouez au moins 10 coups.');
        return;
    }

    console.log('Début de l\'entraînement avec', trainingData.length, 'données...');

    // Entraîner le réseau
    const stats = neuralNetwork.train(trainingData, {
        iterations: 20000,        // Nombre d'itérations max
        log: true,                // Afficher les logs
        logPeriod: 1000,          // Afficher tous les 1000 itérations
        errorThresh: 0.005,       // Erreur cible (0.5%)
        learningRate: 0.3         // Vitesse d'apprentissage
    });

    console.log('Entraînement terminé!', stats);
    alert('IA entraînée! Erreur finale: ' + stats.error);
}
```

#### Paramètres d'Entraînement

- **iterations:** Combien de fois le réseau "révise" les données
- **errorThresh:** L'erreur acceptable (plus petit = plus précis)
- **learningRate:** Vitesse d'apprentissage (0.1 = lent mais stable, 0.9 = rapide mais instable)

---

### Étape 5: Exploiter l'Apprentissage

#### Fonction de Prédiction

```javascript
/**
 * L'IA prédit la meilleure direction à prendre
 */
function predictDirection() {
    if (!neuralNetwork) {
        console.error('Le réseau n\'est pas créé!');
        return null;
    }

    // Récupérer l'état actuel du jeu
    const snakeRect = snake.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();
    const apple = document.querySelector('.apple');
    const appleRect = apple ? apple.getBoundingClientRect() : null;

    if (!appleRect) return null;

    // Obtenir l'état normalisé
    const input = getGameState(snakeRect, containerRect, appleRect);

    // Demander au réseau de prédire
    const output = neuralNetwork.run(input);

    console.log('Prédiction IA:', output);

    // Trouver la direction avec le score le plus élevé
    const directions = ['left', 'right', 'up', 'down'];
    let bestDirection = 'right';
    let bestScore = -1;

    directions.forEach(dir => {
        if (output[dir] > bestScore) {
            bestScore = output[dir];
            bestDirection = dir;
        }
    });

    return bestDirection;
}
```

#### Mode IA Activé

```javascript
// Variable pour activer/désactiver l'IA
let iaEnabled = false;

/**
 * Modifie la fonction loopGame() pour utiliser l'IA
 */
function loopGame() {
    // Si l'IA est activée, elle choisit la direction
    if (iaEnabled && neuralNetwork) {
        const aiDirection = predictDirection();
        if (aiDirection) {
            lastDirection = aiDirection;
        }
    }

    moveSnake(lastDirection);
    checkEatApple();
    if (collideWithWall()) {
        GameOver();
    }
}

/**
 * Active ou désactive l'IA
 */
function toggleIA() {
    iaEnabled = !iaEnabled;
    console.log('IA:', iaEnabled ? 'ACTIVÉE' : 'DÉSACTIVÉE');
}
```

---

### Étape 6: Interface Utilisateur

Ajoutez ces boutons dans `index.html`:

```html
<div id="controls">
    <h3>Contrôles Humain</h3>
    <button onclick="saveDirection('left')"><</button>
    <button onclick="saveDirection('right')">></button>
    <button onclick="saveDirection('up')">^</button>
    <button onclick="saveDirection('down')">v</button>

    <h3>Machine Learning</h3>
    <button onclick="createNeuralNetwork()">1. Créer le Réseau</button>
    <button onclick="trainNeuralNetwork()">2. Entraîner l'IA</button>
    <button onclick="toggleIA()">3. Activer/Désactiver IA</button>
    <button onclick="saveTrainingData()">Sauvegarder Données</button>
    <button onclick="loadTrainingData()">Charger Données</button>

    <p>Données collectées: <span id="data-count">0</span></p>
</div>
```

---

### Étape 7: Sauvegarder et Charger les Données

```javascript
/**
 * Sauvegarde les données d'entraînement
 */
function saveTrainingData() {
    const json = JSON.stringify(trainingData);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'snake-training-data.json';
    a.click();

    console.log('Données sauvegardées!');
}

/**
 * Charge les données d'entraînement
 */
function loadTrainingData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            trainingData = JSON.parse(event.target.result);
            updateDataCount();
            console.log('Données chargées:', trainingData.length);
            alert('Données chargées: ' + trainingData.length + ' exemples');
        };

        reader.readAsText(file);
    };

    input.click();
}

/**
 * Met à jour le compteur de données
 */
function updateDataCount() {
    const counter = document.getElementById('data-count');
    if (counter) {
        counter.textContent = trainingData.length;
    }
}

// Mettre à jour le compteur dans collectData()
function collectData(direction) {
    // ... code existant ...
    trainingData.push(data);
    updateDataCount(); // AJOUTER CETTE LIGNE
}
```

---

## Workflow Complet

### Phase 1: Collecte (Mode Humain)

1. Ouvrez le jeu dans votre navigateur
2. Cliquez sur "1. Créer le Réseau"
3. Jouez au Snake normalement (utilisez les flèches ou les boutons)
4. Le jeu collecte automatiquement vos mouvements
5. Jouez plusieurs parties (au moins 50-100 mouvements)
6. Cliquez sur "Sauvegarder Données"

### Phase 2: Entraînement

1. Cliquez sur "2. Entraîner l'IA"
2. Attendez que l'entraînement se termine (regardez la console)
3. L'IA apprend de vos mouvements!

### Phase 3: Test (Mode IA)

1. Cliquez sur "3. Activer/Désactiver IA"
2. L'IA joue maintenant automatiquement!
3. Observez ses performances

### Phase 4: Amélioration

1. Si l'IA joue mal, jouez encore en mode humain
2. Collectez plus de données (surtout dans les situations difficiles)
3. Réentraînez le réseau avec plus de données
4. Testez à nouveau

---

## Concepts Avancés à Explorer

### 1. Améliorer les Entrées

Ajoutez plus d'informations:
- Distance à la pomme (X et Y séparément)
- Direction vers la pomme (angle)
- Longueur du snake
- Score actuel

### 2. Récompenses (Reinforcement Learning - optionnel)

Au lieu de juste copier le joueur, donnez des "notes":
- +10 points pour manger une pomme
- -100 points pour mourir
- +1 point pour se rapprocher de la pomme

### 3. Architecture du Réseau

Testez différentes configurations:
```javascript
hiddenLayers: [8]          // Simple et rapide
hiddenLayers: [16, 16]     // Équilibré (recommandé)
hiddenLayers: [32, 32, 16] // Complexe (peut être trop)
```

---

## Débogage et Problèmes Courants

### L'IA ne bouge pas

- Vérifiez que le réseau est créé: `console.log(neuralNetwork)`
- Vérifiez que l'IA est activée: `console.log(iaEnabled)`
- Regardez les prédictions dans la console

### L'IA fait n'importe quoi

- Pas assez de données d'entraînement (collectez plus)
- Données de mauvaise qualité (jouez mieux!)
- Réseau pas assez entraîné (augmentez iterations)

### L'entraînement est lent

- Réduisez le nombre d'iterations
- Utilisez moins de données
- Simplifiez le réseau (moins de neurones)

### Erreur d'entraînement élevée

- Collectez plus de données variées
- Augmentez le nombre d'iterations
- Ajoutez des couches cachées

---

## Critères d'Évaluation

### Objectif 1 (40%)
- Le snake grandit correctement
- Code propre et commenté
- Gestion des bugs

### Objectif 2 (60%)
- Collecte de données fonctionnelle (10%)
- Normalisation correcte (15%)
- Entraînement du réseau (15%)
- Prédiction et mode IA (15%)
- Documentation et tests (5%)

---

## Ressources

### Documentation
- [Brain.js GitHub](https://github.com/BrainJS/brain.js)
- [Brain.js Docs](https://brain.js.org/)
- [Réseaux de Neurones (3Blue1Brown)](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi)

### Concepts
- **Réseau de Neurones:** Système qui apprend à partir d'exemples
- **Normalisation:** Convertir les données entre 0 et 1
- **One-Hot Encoding:** Représenter des catégories en binaire
- **Epoch/Iteration:** Une passe complète sur toutes les données
- **Learning Rate:** Vitesse d'apprentissage du réseau

---

## Bonus: Visualisation de l'Apprentissage

```javascript
function visualizeNetwork() {
    const diagram = brain.utilities.toSVG(neuralNetwork, {
        width: 800,
        height: 600
    });

    const blob = new Blob([diagram], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    window.open(url);
}
```

---

## Conclusion

Ce TP vous a appris:
- La manipulation du DOM et la logique de jeu
- Les bases du Machine Learning
- La collecte et normalisation de données
- L'entraînement d'un réseau de neurones
- L'utilisation de Brain.js

**Machine Learning vs Deep Learning:**
Vous venez d'utiliser un réseau de neurones simple (Machine Learning). Le Deep Learning utilise des réseaux beaucoup plus profonds (dizaines/centaines de couches), nécessaires pour des tâches complexes comme la reconnaissance d'images ou la traduction. Pour Snake, un réseau simple suffit largement!

Bon courage!
#   L e - T P - S n a k e - I A  
 