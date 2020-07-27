// <- ************************************************************************************************** ->
      //////////////////////////////////////////////////////////////////////////////////////////////////
      // DOM ELEMENTS                       
      //////////////////////////////////////////////////////////////////////////////////////////////////
// <- ************************************************************************************************** ->


// control buttons

const start_game = document.querySelector('#start_game');

const fight_button = document.querySelector('#start_fight');

const rest_button = document.querySelector('#retreat');

const reset_button = document.querySelector('#reset');

// status & activity log

const activity_log = document.querySelector('#activity_log_inner');

const game_status_wrap = document.querySelector('#game_status_wrap');

const game_status = document.querySelector('#game_status');

// player stats

const player_name = document.querySelector('#player_stats_name');

const player_health = document.querySelector('#player_stats_health');

const player_power = document.querySelector('#player_stats_power');

const player_accuracy = document.querySelector('#player_stats_accuracy');

// enemy stats

const enemy_name = document.querySelector('#enemy_stats_name');

const enemy_health = document.querySelector('#enemy_stats_health');

const enemy_power = document.querySelector('#enemy_stats_power');

const enemy_accuracy = document.querySelector('#enemy_stats_accuracy');


// <- ************************************************************************************************** ->
      //////////////////////////////////////////////////////////////////////////////////////////////////
      // UTILITY FUNCTIONS                       
      //////////////////////////////////////////////////////////////////////////////////////////////////
// <- ************************************************************************************************** ->


// random value between range, fixed to 1 decimal
// need to wrap in a parseFloat because toFixed converts to string

const randomize = (min, max) => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

// random value between range that preserves whole numbers

const randomizeWhole = (min, max) => {
    return Math.floor(randomize(min, max));
}

// alien name bank to pull from

const nameBank = ['Khoqnaid', 'Truulka', 'Scriqrox', 'Xoskul', 'Qemnu', 'Gonkrans', 'Edos', 'Uxids', 'Cratteix',
                 'Zamhal', 'Icats', 'Chozor', 'Criqrax', 'Vegnez', 'Yaakkod', 'Naxons', 'Ochox', 'Tarkex',
                'Entek', 'Tavox', 'Aabrax', 'Gannz', 'Korlox', 'Beebox', 'Lungzor', 'Rotanx'];

// create a new entry in the activity log

const createActivity = (message) => {
    const activity = document.createElement('p');
    activity.classList.add('activity');
    activity.innerHTML = message;
    activity_log.appendChild(activity);
}

// create screen shake fx

const screenShake = () => {
    game_status_wrap.classList.add('shake');
    setTimeout(() => {
        game_status_wrap.classList.remove('shake');
    }, 1000) // after 3s, remove class so it can be applied again
}


// <- ************************************************************************************************** ->
      //////////////////////////////////////////////////////////////////////////////////////////////////
      // GAME OBJECTS                      
      //////////////////////////////////////////////////////////////////////////////////////////////////
// <- ************************************************************************************************** ->


////////////////////////////
// GAME OBJECT

class Game {
    constructor() {
        this.status = ``;
    }
    updateStatus(status) {
        this.status = status;
        game_status.innerHTML = this.status;
    }
}

const newGame = new Game();


////////////////////////////
// PLAYER CLASS

class Player {
    constructor(name) {
        this.name = name;
        this.hull = 15;
        this.firePower = 5;
        this.accuracy = 0.7;
    }
    fight(target) {
        if (Math.random() < this.accuracy) {
            target.hull -= this.firePower;
            createActivity(`Direct hit! <span class="text-hero">${this.name}</span>'s attack did <span class="text-damage">${this.firePower}</span> 
            damage to <span class="text-alien">${target.name}</span>!`);
        } else {
            createActivity(`<span class="text-hero">${this.name}</span> just missed his target!`);
        }
    }
    updateStats() {
        player_name.innerHTML = this.name;
        player_health.innerHTML = this.hull.toFixed(1);
        player_power.innerHTML = this.firePower;
        player_accuracy.innerHTML = this.accuracy;
    }
}

const Hero = new Player('Player One');


////////////////////////////
// ALIEN CLASS

class Alien {
    constructor(name, hull, firePower, accuracy) {
        this.name = name;
        this.hull = hull;
        this.firePower = firePower;
        this.accuracy = accuracy;
    }
    fight(target) {
        if (Math.random() < this.accuracy) {
            target.hull -= this.firePower;
            createActivity(`Direct hit! <span class="text-alien">${this.name}</span>'s attack did <span class="text-damage">${this.firePower}</span> 
            damage to <span class="text-hero">${target.name}</span>!`);
        } else {
            createActivity(`<span class="text-alien">${this.name}</span> just missed his target!`);
        }
    }
    updateStats() {
        enemy_name.innerHTML = this.name;
        enemy_health.innerHTML = this.hull.toFixed(1);
        enemy_power.innerHTML = this.firePower;
        enemy_accuracy.innerHTML = this.accuracy;
    }
}

////////////////////////////
// ALIEN FACTORY

class Mothership {
    constructor(fleetSize) {
        this.fleetSize = fleetSize;
        this.aliens = [];
    }
    generateAlien() {
        const newAlien = new Alien(nameBank[randomizeWhole(0, nameBank.length)], randomize(3,6), randomize(2,4), randomize(0.6, 0.8));
        this.aliens.push(newAlien);
    }
    generateFleet() {
        for (let i = 0; i < motherShip.fleetSize; i++) {
            this.generateAlien();
        }
    }
}

const motherShip = new Mothership(6);

motherShip.generateFleet();


// <- ************************************************************************************************** ->
      //////////////////////////////////////////////////////////////////////////////////////////////////
      // ACTION FUNCTIONS                       
      //////////////////////////////////////////////////////////////////////////////////////////////////
// <- ************************************************************************************************** ->


// function to run one fight 

const fightToDeath = (player, alien) => {
    alien.updateStats();
    while(player.hull > 0 && alien.hull > 0) {
        player.fight(alien);
        // check alien health each iteration to prevent mutual defeat
        if (player.hull > 0 && alien.hull > 0) {
            alien.fight(player);
        }
        player.updateStats();
    }
     if (player.hull > alien.hull) {
        createActivity(`--- <span class="text-hero">${player.name}</span> has defeated <span class="text-alien">${alien.name}</span> ---`);
    } else {
        createActivity(`--- <span class="text-alien">${alien.name}</span> has defeated <span class="text-hero">${player.name}</span>! ---`);
    }
}

// higher order fight function to control battle

const runBattle = (player, motherShip) => {
    console.log(motherShip.aliens);
    if (player.hull > 0 && motherShip.aliens.length > 0) {
        createActivity(`<span class='text-enter'>${motherShip.aliens[0].name} approaches!</span>`);
        fightToDeath(player, motherShip.aliens[0]);
        motherShip.aliens.shift();
        if (motherShip.aliens.length === 0 && player.hull > 0) {
            newGame.updateStatus(`******** YOU HAVE DEFEATED THE WHOLE FLEET **********`);
        } else if (player.hull <= 0) {
            newGame.updateStatus(`<span class="text-hero">${player.name}</span> was defeated 
            after destroying <span class="text-damage">${motherShip.fleetSize - motherShip.aliens.length - 1}</span> enemies!`);
        } else {
            newGame.updateStatus(`<span class="text-damage">${motherShip.aliens.length}</span> enemy ships remain.`)
        }
    }
}

// function to retreat and rest for a turn

const retreat = () => {
    const healthBoost = randomize(2,4);
    Hero.hull += healthBoost;
    Hero.updateStats();
    motherShip.fleetSize += 1;
    motherShip.generateAlien();
    newGame.updateStatus(`<span class="text-hero">${Hero.name}</span> recovered ${healthBoost} health, but the <span class="text-alien">aliens</span> recruited a new ship while you rested.`);
    console.log(Hero, motherShip.aliens);
}

// function to reset game

const reset = () => {
    activity_log.innerHTML = '';
    Hero.hull = 15;
    Hero.updateStats();
    motherShip.fleetSize = 6;
    motherShip.aliens = [];
    motherShip.generateFleet();
    motherShip.aliens[0].updateStats();
}

// loader functions

const init = () => {
    newGame.updateStatus(`An <span class="text-alien">alien fleet</span> approaches. Hit start to meet them in battle.`);
    Hero.updateStats();
}

// <- ************************************************************************************************** ->
      //////////////////////////////////////////////////////////////////////////////////////////////////
      // DOM FUNCTIONS                       
      //////////////////////////////////////////////////////////////////////////////////////////////////
// <- ************************************************************************************************** ->


// disable fight, run, and reset until game has started

fight_button.disabled = true;
rest_button.disabled = true;
reset_button.disabled = true;

// run first match, and enable all other buttons after start

start_game.onclick = (e) => {
    runBattle(Hero, motherShip);
    screenShake();
    e.target.disabled = true;
    fight_button.disabled = false;
    rest_button.disabled = false;
    reset_button.disabled = false;
}

// proceed to next ship battle

fight_button.onclick = () => {
    runBattle(Hero, motherShip);
    screenShake();
}

// run away home

rest_button.onclick = (e) => {
    retreat();
    e.target.disabled = true;
}

// run reset and enable all buttons

reset_button.onclick = () => {
    reset();
    newGame.updateStatus('An <span class="text-alien">alien fleet</span> approaches. Hit start to meet them in battle.');
    start_game.disabled = false;
    fight_button.disabled = true;
    rest_button.disabled = true;
    reset_button.disabled = true;
}

// load initial state

init();