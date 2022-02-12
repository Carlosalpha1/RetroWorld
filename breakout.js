// -- Breakout Game
// -- Carlos Caminero

const BRICKS_ROWS = 10;
const BRICKS_COLS = 9;
const BRICK_COLORS = ["green", "yellow", "red"];

const canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 600;

const ctx = canvas.getContext("2d");

class Racket
{
    static WIDTH = 100;
    static HEIGHT = 20;

    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        ctx.beginPath();
            ctx.rect(this.x, this.y, Racket.WIDTH, Racket.HEIGHT);
            ctx.fillStyle = 'red';
            ctx.lineWidth = 4;
            ctx.fill();
            ctx.stroke();
        ctx.closePath();
    }
};

class Brick
{
    static WIDTH = 50;
    static HEIGHT = 20;

    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.width = Brick.WIDTH;
        this.heigth = Brick.HEIGHT;
        this.color = color;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        ctx.beginPath();
            ctx.rect(this.x, this.y, Brick.WIDTH, Brick.HEIGHT);
            ctx.fillStyle = this.color;
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();
        ctx.closePath();
    }
};

class Ball
{
    static RADIUS = 10;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = Ball.RADIUS;
        this.vx = 1;
        this.vy = 1;
        console.log(this.x, this.y)
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
    }

    draw() {
        ctx.beginPath();
            ctx.arc(this.x, this.y, Ball.RADIUS, 0, 2*Math.PI);
            //ctx.strokeStyle = 'blue';
            ctx.lineWidth = 3;
            ctx.fillStyle = 'orange';
            ctx.fill();            
            ctx.stroke();
        ctx.closePath();
    }
}


function collide(brick, ball) {
    let xmin = brick.x;
    let ymin = brick.y;
    let xmax = brick.x + brick.width;
    let ymax = brick.y + brick.height;
    if ((ball.x + ball.r) > xmin ||
        (ball.x - ball.r) < xmax ||
        (ball.y + ball.r) > ymin ||
        (ball.y - ball.r) < ymax) {
        return true;
    }
    return false;
}


function init_objects() {
    // -- Init Racket Entity
    racket = new Racket();
    let init_x = canvas.width/2 - Racket.WIDTH/2;
    let init_y = canvas.height - (Racket.HEIGHT+30);
    racket.moveTo(init_x, init_y);

    // -- Init Brick Entities
    bricks = []
    let color_index = 0;
    for (let i = 0; i < BRICKS_ROWS; i++) {
        for (let j = 0; j < BRICKS_COLS; j++) {
            bricks.push(new Brick(
                20+j*Brick.WIDTH,
                20+i*Brick.HEIGHT,
                BRICK_COLORS[color_index]));
        }
        console.log(BRICK_COLORS[color_index])
        console.log(color_index)
        color_index = (color_index + 1) % BRICK_COLORS.length;
    }

    // -- Init Ball
    ball = new Ball(canvas.width/2, racket.y - 150)
}


function logic_game()
{
    if ((ball.x < (0+ball.r)) || (ball.x > (canvas.width - ball.r))) {
        ball.vx = -ball.vx;
    }
    if ((ball.y < (0+ball.r)) || (ball.y > (canvas.height - ball.r))) {
        ball.vy = -ball.vy;
    }

    // -- collision
    for (let i = 0; i < bricks.length; i++) {
        let xmin = bricks[i].x;
        let ymin = bricks[i].y;
        let xmax = bricks[i].x + bricks[i].width;
        let ymax = bricks[i].y + bricks[i].height;
        let collision = false;

        if (collision) {
            bricks.splice(i, 1);
        }
    }
    ball.update();
}


function clear_display()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function update_display()
{
    racket.draw();
    for (brick of bricks) {
        brick.draw();
    }
    ball.draw();
}


// -- Main
init_objects();
function update()
{
    logic_game();
    clear_display();
    update_display();
    requestAnimationFrame(update);
}

update();