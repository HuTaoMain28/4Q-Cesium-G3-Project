//Boss data containing details about each boss
    const bossData = [
            { name: "Solmara, the Brineborn Tyrant", description: "A dragon of the deep seas rises, its scales glistening with salt and fury.", image: "Images/solmara.png", maxHP: 25, actions: ["Unleashes a tidal wave!", "Strikes with its razor-sharp tail!"] },
            { name: "Litharos, the Azure Titan", description: "A towering sorcerer cloaked in azure flames blocks your path.", image: "Images/litharos.png", maxHP: 30, actions: ["Casts a storm of arcane energy!", "Summons a vortex of wind and lightning!"] },
            { name: "Pyrrhok, the Ember Warden", description: "A hulking ogre wreathed in embers stands before you, its eyes burning with rage.", image: "Images/pyrrhok.png", maxHP: 35, actions: ["Hurls a molten boulder!", "Slams the ground, sending fiery shockwaves!"] },
            { name: "Noctivoros, the Eclipse Devourer", description: "A shadowy figure emerges, its presence consuming all light around it.", image: "Images/noctivoros.png", maxHP: 40, actions: ["Casts a shroud of darkness!", "Unleashes a barrage of shadow bolts!"] },
           ];

       //Game state variables
       let score = 0, potions = 1, guaranteedCrit = false;

       //Initialize the game
       function init() {
        //Retrieve and display high score from local storage
        const highScore = localStorage.getItem("hiscore") || "0";
        localStorage.setItem("hiscore", highScore);
        updateUI("highScore", highScore);
        updateUI("score", score);
        updateUI("potions", potions);

        //Display player name
        document.getElementById("playerName").textContent = "Good luck " + (localStorage.getItem("username") || "Adventurer");

        //Create sections for each boss
        bossData.forEach((boss, index) => {
        createSection("story", index, `<h2>Chapter ${index + 1}</h2><p>${boss.description}</p><button onclick="startFight(${index})">Engage in Battle</button>`);
        createSection("fight", index, `
         <h2>${boss.name}</h2>
         <img src="${boss.image}" alt="${boss.name}">
         <p>Knight's HP: <span id="player${index}">20</span></p>
         <p>${boss.name.split(" ")[0]}'s HP: <span id="boss${index}">${boss.maxHP}</span></p>
         <button onclick="attack(${index})" id="fightBtn${index}">Attack</button>
         <button onclick="heal(${index})" id="healBtn${index}">Use Potion</button>
         <button onclick="restart(${index})">Retreat</button>
        `);
        createSection("merchant", index, `
         <h2>Merchant</h2>
         <p>You take a deep rest and restore all your health...The merchant for your hard work:</p>
         <button onclick="buyPotion(${index})">Buy Potion (1)</button>
         <button onclick="buyCrit(${index})">Buy Guaranteed Crit (1)</button>
         <button onclick="nextChapter(${index})">Continue</button>
        `);
        });
       }

       //Create a section
       function createSection(type, index, content) {
        const section = document.createElement("div");
        section.id = `${type}${index}`;
        section.className = `section${type === "story" && index === 0 ? " active" : ""}`;
        section.innerHTML = content;
        document.getElementById("content").appendChild(section);
       }

       //Start a fight with a boss
       function startFight(index) {
        toggleVisibility(`story${index}`, false);
        toggleVisibility(`fight${index}`, true);
       }

       //Handle attack logic
       function attack(index) {
        const boss = bossData[index];
        const bossHit = guaranteedCrit ? 15 : getRandom(1, 15); //Guaranteed critical
        const playerHit = getRandom(1, 3); //Random damage to player

        //Update HP for both player and boss
        updateHP(index, "boss", boss.maxHP, bossHit);
        updateHP(index, "player", 20, playerHit);

        //Display boss action
        alert(`${boss.name}: ${boss.actions[getRandom(0, boss.actions.length - 1)]}`);

        //Check if player or boss is defeated
        if (getHP(index, "player") === 0) {
        disableButtons(index);
        alert("You have fallen!");
        } else if (getHP(index, "boss") === 0) {
        handleVictory(index);
        }

        //Reset guaranteed critical hit
        guaranteedCrit = false;
       }

       //Heal the player using a potion
       function heal(index) {
        if (potions > 0) {
        updateHP(index, "player", 20, -getRandom(1, 5)); //Heal random amount
        updateUI("potions", --potions); //Decrease potion count
        } else {
        alert("No potions left!");
        }
       }

       // Restart the fight
       function restart(index) {
        resetHP(index, "player", 20); // Reset player HP
        resetHP(index, "boss", bossData[index].maxHP); // Reset boss HP
        enableButtons(index); // Enable fight buttons
       }

       //Handle victory logic
       function handleVictory(index) {
        disableButtons(index); //Disable fight buttons
        alert("You defeated the enemy!");
        updateUI("score", ++score); //Increase score

        //Update high score if necessary
        if (score > parseInt(localStorage.getItem("hiscore"))) {
        localStorage.setItem("hiscore", score);
        updateUI("highScore", score);
        }

        //Show next section (merchant or victory screen)
        toggleVisibility(`fight${index}`, false);
        toggleVisibility(index + 1 < bossData.length ? `merchant${index}` : "victory", true);
       }

       //Buy a potion from the merchant
       function buyPotion(index) {
        updateUI("potions", ++potions); //Increase potion count
        nextChapter(index); //Proceed to next chapter
       }

       //Buy a guaranteed critical hit
       function buyCrit(index) {
        guaranteedCrit = true; //Enable guaranteed critical hit
        nextChapter(index); //Proceed to next chapter
       }

       //Proceed to the next chapter
       function nextChapter(index) {
        toggleVisibility(`merchant${index}`, false);
        toggleVisibility(`story${index + 1}`, true);
       }

       //Toggle visibility of a section
       function toggleVisibility(id, isVisible) {
        document.getElementById(id).className = `section${isVisible ? " active" : ""}`;
       }

       //Update HP for a player or boss
       function updateHP(index, type, max, damage) {
        const span = document.getElementById(`${type}${index}`);
        span.textContent = Math.max(0, Math.min(max, parseInt(span.textContent) - damage));
       }

       //Reset HP for a player or boss
       function resetHP(index, type, value) {
        document.getElementById(`${type}${index}`).textContent = value;
       }

       //Get current HP of a player or boss
       function getHP(index, type) {
        return parseInt(document.getElementById(`${type}${index}`).textContent);
       }

       //Disable fight buttons
       function disableButtons(index) {
        toggleButtons(index, true);
       }

       //Enable fight buttons
       function enableButtons(index) {
        toggleButtons(index, false);
       }

       //Toggle fight buttons' state
       function toggleButtons(index, state) {
        document.getElementById(`fightBtn${index}`).disabled = state;
        document.getElementById(`healBtn${index}`).disabled = state;
       }

       //Update UI element with a new value
       function updateUI(id, value) {
        document.getElementById(id).textContent = value;
       }

       //Generate a random number between min and max
       function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
       }

       //Navigate back to the home page
       function goHome() {
        window.location.href = "index.html";
       }

       //Start the game
       init();
