let body = document.querySelector('body');
let startScreen = document.querySelector('#start-screen');
let startBeers = document.querySelector('#start-beers');

let backgroundMusic = new Audio();
backgroundMusic.src = 'pop-loop.mp3';
backgroundMusic.loop = true;

let gulpSound = new Audio();
gulpSound.src = 'gulp.mp3';

let shriekSound = new Audio();
shriekSound.src = 'scream.mp3';

let canvas = document.createElement('canvas');
canvas.width="800";
canvas.height="600";
canvas.style.border = '3px solid black';

let score = 0;

let intervalId = 0;

let bgImg = new Image();
bgImg.src = 'beer-bkg.jpg';

let playerImg = new Image();
playerImg.src = 'player.png';

let beerImg = new Image();
beerImg.src = 'beer.png';

let teaImg = new Image();
teaImg.src = 'tea.png';


let drinkChoice = [beerImg, teaImg];



let playerX = 350;
let isRightArrow = false;
let isLefttArrow = false;


startBeers.addEventListener('click', function(event){
    startGame();
})


function startGame() {
    body.removeChild(startScreen);
    body.appendChild(canvas);
    backgroundMusic.play();
    let drinks= [{x: 250, y: -150, drink: beerImg}]


let acceleration = 10;
let level = 1;




function draw(){
    ctx.drawImage(bgImg, 0, 0);

    if (score >= 5) {
        acceleration = 15;
        level = 2;
    }
    if (score >= 10) {
        acceleration = 20;
        level = 3;
    }
    if (score >= 15) {
        acceleration = 25;
        level = 4;
    }
    if (score >= 20) {
        acceleration = 30;
        level = 5;
    }

    for (let i=0; i < drinks.length; i++){
        ctx.drawImage(drinks[i].drink, drinks[i].x, drinks[i].y)
        drinks[i].y += acceleration;
        if (drinks[i].y >= 400 && drinks[i].y < 400+acceleration){
            let nextDrink = drinkChoice[Math.floor(Math.random()*2)];
            drinks.push({
                x: Math.floor(Math.random()*canvas.width),
                y: -100,
                drink: nextDrink
            })
        }

        if (drinks[i].y >= (canvas.height - 200) && drinks[i].y < (canvas.height - 200+acceleration) && drinks[i].x >= playerX && (drinks[i].x + drinks[i].drink.width) <= (playerX + playerImg.width)){
            if (drinks[i].drink === teaImg) {
                shriekSound.play();
                clearInterval(intervalId)
                endGame()
            }
            else {
                gulpSound.play();
                score++;
            }
        }
    }
    ctx.font = '20px Arial';
    ctx.fillText(`Beers: ${score}`, 10, 25);
    ctx.fillText (`Level: ${level}`, 10, 50);
    ctx.drawImage(playerImg, playerX, 400);
    playerMovement();

}

intervalId = setInterval(() => {
    requestAnimationFrame(draw)
}, 20);
}

let ctx = canvas.getContext('2d');






document.addEventListener('keydown', function(event){
    if (event.key === 'ArrowRight'){
        isRightArrow = true;
        isLefttArrow = false
    } 
    else if (event.key === 'ArrowLeft'){
        isLefttArrow= true; 
        isRightArrow = false;
    } 
})

document.addEventListener('keyup', function(event){
    isRightArrow = false;
    isLefttArrow = false;
})


function playerMovement(){
    if (isRightArrow && playerX < canvas.width - 200){
        playerX = playerX + 15
    }
    else if (isLefttArrow && playerX > -20){
        playerX = playerX - 15
    }
}





let highscore;


function endGame() {
    backgroundMusic.pause();
    let endScreen = document.createElement('div');

    if (localStorage.getItem('bestscore')) {
        highscore = localStorage.getItem('bestscore');
        if (score > highscore) {
            localStorage.setItem('bestscore', score);
            highscore = score;
            }
        }
        else {
            localStorage.setItem('bestscore', score);
            highscore = score;
        }

    let scoreText = `You caught ${score} beers.`
    if (score === 1) {
        scoreText = 'You caught 1 beer.';
    }
    let highscoreText = ` Your highscore is ${highscore}.`;
    endScreen.innerHTML = `<h1>Game Over</h1><img id="end-tea" src="endimg.png" alt="beers"><h2>${scoreText}${highscoreText}</h2><p>Do you want to try again?<br>Click on the tea.</p>`;
    body.removeChild(canvas);
    body.appendChild(endScreen);
    let endTea = document.querySelector('#end-tea');
    endTea.addEventListener('click', function(){
        window.location.reload(false);
    })

}

