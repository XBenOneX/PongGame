const FRAME_RATE = 60;

let ball = {
    posX: 385,
    posY: 185,
    velX: 0,
    velY: 0,
    vel: 200,
    acc: 40,
    elem: null,
};

let pad1 = {
    posX: 20,
    posY: 140,
    velY: 150,
    length: 120,
    lengthShortenFactor: 0,
    elem: null,
};

let pad2 = {
    posX: 760,
    posY: 140,
    velY: 150,
    length: 120,
    lengthShortenFactor: 0,
    elem: null,
};

let message = {
    elem: null,
};

let scores = {
    score1: 0,
    score2: 0,
    elem1: null,
    elem2: null,
    elemTotal: null,
};

let control = {
    p1Up: false,
    p1Down: false,
    p2Up: false,
    p2Down: false,
};

function applyPosition(data) {
    data.elem.style.left = data.posX + "px";
    data.elem.style.top = data.posY + "px";
}

function applyBallPhysics(ball, directionToTheLeft, angle) {
    let shootingAngle = (directionToTheLeft ? 135 : -45) + angle;
    ball.velX = ball.vel * Math.cos(degToRad(shootingAngle));
    ball.velY = ball.vel * Math.sin(degToRad(shootingAngle));
}

function applyScore(score) {
    score.elem1.innerHTML = score.score1;
    score.elem2.innerHTML = score.score2;
}

function degToRad(degree) {
    return degree / 180 * Math.PI;
}

function initializeGame() {
    pad1.elem = document.getElementById("pad1");
    pad2.elem = document.getElementById("pad2");
    ball.elem = document.getElementById("ball");
    message.elem = document.getElementById("message");
    scores.elem1 = document.getElementById("score1");
    scores.elem2 = document.getElementById("score2");
    scores.elemTotal = document.getElementById("total-score");

    pad1.elem.style.height = pad1.length + "px";
    pad2.elem.style.height = pad2.length + "px";

    applyPosition(pad1);
    applyPosition(pad2);
    applyPosition(ball);

    applyScore(scores);

    message.elem.innerHTML = "";

    document.onkeydown = (event) => {
        if (event.code == "KeyW") {
            control.p1Up = true;
        }
        if (event.code == "KeyS") {
            control.p1Down = true;
        }
        if (event.code == "ArrowUp") {
            control.p2Up = true;
        }
        if (event.code == "ArrowDown") {
            control.p2Down = true;
        }
        if (event.code == "KeyR") {
            location.reload();
        }
    };

    document.onkeyup = (event) => {
        if (event.code == "KeyW") {
            control.p1Up = false;
        }
        if (event.code == "KeyS") {
            control.p1Down = false;
        }
        if (event.code == "ArrowUp") {
            control.p2Up = false;
        }
        if (event.code == "ArrowDown") {
            control.p2Down = false;
        }
    };

    let throwCoinResult = Math.random();
    let directionToTheLeft = throwCoinResult < 0.5 ? true : false;
    let angle = Math.random() * 90;
    applyBallPhysics(ball, directionToTheLeft, angle);
}

function startGame() {
    let intervalTime = 1000 / FRAME_RATE;
    setInterval(() => {
        pad1.elem.style.height = pad1.length + "px";
        pad2.elem.style.height = pad2.length + "px";

        let ballVelXPerFrame = ball.velX / FRAME_RATE;
        let ballVelYPerFrame = ball.velY / FRAME_RATE;
        ball.posX += ballVelXPerFrame;
        ball.posY += ballVelYPerFrame;

        if (ball.posY < 0) {
            ball.posY = 0 - ball.posY;
            ball.velY = -ball.velY;
        }
        if (ball.posY > 370) {
            ball.posY = 370 - (ball.posY - 370);
            ball.velY = -ball.velY;
        }

        applyPosition(ball);

        let pad1VelYPerFrame = 0;
        if (control.p1Up) {
            pad1VelYPerFrame -= pad1.velY / FRAME_RATE;
        }
        if (control.p1Down) {
            pad1VelYPerFrame += pad1.velY / FRAME_RATE;
        }
        pad1.posY += pad1VelYPerFrame;

        if (pad1.posY < 0) {
            pad1.posY = 0;
        }
        if (pad1.posY > 400 - pad1.length) {
            pad1.posY = 400 - pad1.length;
        }

        applyPosition(pad1);

        let pad2VelYPerFrame = 0;
        if (control.p2Up) {
            pad2VelYPerFrame -= pad2.velY / FRAME_RATE;
        }
        if (control.p2Down) {
            pad2VelYPerFrame += pad2.velY / FRAME_RATE;
        }
        pad2.posY += pad2VelYPerFrame;

        if (pad2.posY < 0) {
            pad2.posY = 0;
        }
        if (pad2.posY > 400 - pad2.length) {
            pad2.posY = 400 - pad2.length;
        }

        applyPosition(pad2);

        if (ball.posX < pad1.posX + 20 && ball.posX > pad1.posX + 20 - 15) {
            if (ball.posY > pad1.posY - 15 && ball.posY < pad1.posY + pad1.length - 15) {
                let collisionPosition = ball.posY - pad1.posY + 15;
                let angleFactor = collisionPosition / pad1.length;
                let angle = angleFactor * 90;
                applyBallPhysics(ball, false, angle);

                ball.vel += ball.acc;
                pad2.length -= pad2.lengthShortenFactor;

                scores.score1++;
                applyScore(scores);
            }
        }
        if (ball.posX > pad2.posX - 30 && ball.posX < pad2.posX - 30 + 15) {
            if (ball.posY > pad2.posY - 15 && ball.posY < pad2.posY + pad2.length - 15) {
                let collisionPosition = ball.posY - pad2.posY + 15;
                let angleFactor = (pad2.length - collisionPosition) / pad2.length;
                let angle = angleFactor * 90;
                applyBallPhysics(ball, true, angle);

                ball.vel += ball.acc;
                pad1.length -= pad1.lengthShortenFactor;

                scores.score2++;
                applyScore(scores);
            }
        }

        if (ball.posX < 0 || ball.posX > 800 - 30) {
            let directionToTheLeft = ball.velX < 0 ? true : false;
            message.elem.innerHTML =
                (directionToTheLeft ? "Right" : "Left") +
                " side has won the game!<br />" +
                "Press R to start new game.";
            ball.velX = 0;
            ball.velY = 0;
            scores.elemTotal.innerHTML = "Total Score: " + (scores.score1 + scores.score2);
        }
    }, intervalTime);
}

function onLoad() {
    initializeGame();
    startGame();
}

document.addEventListener("DOMContentLoaded", onLoad);