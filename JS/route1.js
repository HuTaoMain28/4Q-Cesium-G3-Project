//Array containing data for each boss
const bossData = [
  { name: "Solmara, the Brineborn Tyrant", description: "A fearsome dragon emerges from the shadows!", image: "Images/solmara.png", maxHP: 25, currentHP: 25, playerHP: 20 },
  { name: "Litharos, the Azure Titan", description: "A dark sorcerer blocks your path!", image: "Images/litharos.png", maxHP: 30, currentHP: 30, playerHP: 20 },
  { name: "Pyrrhok, the Ember", description: "A mighty ogre challenges you!", image: "Images/pyrrhok.png", maxHP: 35, currentHP: 35, playerHP: 20 },
  { name: "Noctivoros, the Eclipse Devourer", description: "The Dark Lord awaits you in his castle!", image: "Images/noctivoros.png", maxHP: 40, currentHP: 40, playerHP: 20 },
];

let score = 0; //Player's current score

//Initialize the game
function init() {
  //Retrieve and display the high score from localStorage
  const highScore = localStorage.getItem("hiscore") || "0";
  localStorage.setItem("hiscore", highScore);
  document.getElementById("highScore").textContent = highScore;
  document.getElementById("score").textContent = score;

  //Generate story and fight sections for each boss
  const content = document.getElementById("content");
  bossData.forEach((boss, index) => {
  createStorySection(content, boss, index);
  createFightSection(content, boss, index);
  });

  //Display the player's username if available
  const username = localStorage.getItem("username");
  if (username) {
  document.getElementById("playerName").textContent = "Good luck " + username;
  }
}

//Create a story section for a boss
function createStorySection(content, boss, index) {
  const story = document.createElement("div");
  story.id = `story${index}`;
  story.className = `section${index === 0 ? " active" : ""}`; //Make the first section visible
  story.innerHTML = `
  <h2>Chapter ${index + 1}</h2>
  <p>${boss.description}</p>
  <button onclick="startFight(${index})">Engage in Battle</button>
  `;
  content.appendChild(story);
}

//Create a fight section for a boss
function createFightSection(content, boss, index) {
  const fight = document.createElement("div");
  fight.id = `fight${index}`;
  fight.className = "section"; //Initially hidden
  fight.innerHTML = `
  <h2>${boss.name}</h2>
  <img src="${boss.image}" alt="${boss.name}">
  <p>Knight's HP: <span id="player${index}">${boss.playerHP}</span></p>
  <p>${boss.name.split(" ")[0]}'s HP: <span id="boss${index}">${boss.maxHP}</span></p>
  <button onclick="attack(${index})" id="fightBtn${index}">Attack</button>
  <button onclick="heal(${index})" id="healBtn${index}">Use Potion</button>
  <button onclick="restart(${index})">Retreat</button>
  `;
  content.appendChild(fight);
}

//Start the fight for a specific boss
function startFight(index) {
  toggleVisibility(`story${index}`, false); //Hide the story section
  toggleVisibility(`fight${index}`, true); //Show the fight section
}

//Handle the attack action
function attack(index) {
  const boss = bossData[index];
  const playerSpan = document.getElementById(`player${index}`);
  const bossSpan = document.getElementById(`boss${index}`);

  //Calculate damage dealt by the player and the boss
  const bossHit = getRandom(1, 10);
  const playerHit = getRandom(1, 3);

  //Update HP values
  boss.currentHP = Math.max(0, boss.currentHP - bossHit);
  boss.playerHP = Math.max(0, boss.playerHP - playerHit);

  //Update the UI
  playerSpan.textContent = boss.playerHP;
  bossSpan.textContent = boss.currentHP;

  //Check for victory or defeat
  if (boss.playerHP === 0) {
  disableButtons(index); //Disable buttons if the player is defeated
  alert("You have fallen!");
  } else if (boss.currentHP === 0) {
  handleVictory(index); //Handle victory if the boss is defeated
  }
}

//Handle the heal action
function heal(index) {
  const boss = bossData[index];
  if (boss.playerHP > 0) {
  // Heal the player by a random amount
  boss.playerHP = Math.min(20, boss.playerHP + getRandom(1, 5));
  document.getElementById(`player${index}`).textContent = boss.playerHP;
  } else {
  alert("You are already defeated!");
  }
}

//Restart the fight for a specific boss
function restart(index) {
  const boss = bossData[index];
  boss.playerHP = 20; //Reset player's HPa
  boss.currentHP = boss.maxHP; //Reset boss's HP
  document.getElementById(`player${index}`).textContent = 20;
  document.getElementById(`boss${index}`).textContent = boss.maxHP;
  enableButtons(index); //Re-enable buttons
}

//Handle victory after defeating a boss
function handleVictory(index) {
  disableButtons(index); //Disable buttons
  alert("You defeated the enemy!");
  score++; //Increment the score
  document.getElementById("score").textContent = score;

  //Update high score if necessary
  const highScore = parseInt(localStorage.getItem("hiscore"));
  if (score > highScore) {
  localStorage.setItem("hiscore", score.toString());
  document.getElementById("highScore").textContent = score;
  }

  //Show the next story section or the victory screen
  toggleVisibility(`fight${index}`, false);
  if (index + 1 < bossData.length) {
  toggleVisibility(`story${index + 1}`, true);
  } else {
  toggleVisibility("victory", true);
  }
}

//Toggle the visibility of a section
function toggleVisibility(id, isVisible) {
  const element = document.getElementById(id);
  element.className = `section${isVisible ? " active" : ""}`;
}

//Disable fight and heal buttons
function disableButtons(index) {
  document.getElementById(`fightBtn${index}`).disabled = true;
  document.getElementById(`healBtn${index}`).disabled = true;
}

//Enable fight and heal buttons
function enableButtons(index) {
  document.getElementById(`fightBtn${index}`).disabled = false;
  document.getElementById(`healBtn${index}`).disabled = false;
}

//Generate a random number between min and max (inclusive)
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Navigate back to the home page
function goHome() {
  window.location.href = "index.html";
}

//Start the game
init();