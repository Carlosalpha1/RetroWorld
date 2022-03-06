// -- Breakout Game
// -- Carlos Caminero

const BRICKS_ROWS = 10;
const BRICKS_COLS = 9;
const BRICK_COLORS = ["green", "yellow", "red"];

// -- HTML objects
const canvas = document.getElementById("canvas");
const button_left = document.getElementById("buttonA");
const button_right = document.getElementById("buttonD");
const bricks_cont = document.getElementById("bricks_cont");
const title_bricks_cont = document.getElementById("title_bricks_cont");


// -- Canvas settings
canvas.width = 500;
canvas.height = 600;
const ctx = canvas.getContext("2d");


// -- Racket --> Player Class
class Racket
{
    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 20;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = 'red';
            ctx.lineWidth = 4;
            ctx.fill();
            ctx.stroke();
        ctx.closePath();
    }
};


// -- Brick --> Objective Class
class Brick
{
    static WIDTH = 50;
    static HEIGHT = 20;

    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.width = Brick.WIDTH;
        this.height = Brick.HEIGHT;
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


// -- Ball --> Player Object Class
class Ball
{
    static RADIUS = 10;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = Ball.RADIUS;
        this.vx = 2;
        this.vy = 2;
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
            ctx.lineWidth = 3;
            ctx.fillStyle = 'orange';
            ctx.fill();            
            ctx.stroke();
        ctx.closePath();
    }
}


function is_point_into_region(x, y, region)
{
    if ((x > region.x && x < (region.x + region.width)) &&
        (y > region.y && y < (region.y + region.height))) {
        return true;
    }
    return false;
}


function collision_ball_with_cube(ball, cube)
{
    let i;

    for (i = (ball.x-ball.r+1); i < (ball.x+ball.r-1); i++) {
        // ball down square side
        if (is_point_into_region(i, ball.y+ball.r, cube)) {
            return 1;
        }
        // ball up square side
        if (is_point_into_region(i, ball.y-ball.r, cube)) {
            return 2;
        }
    }
    for (i = (ball.y-ball.r+1); i < (ball.y+ball.r-1); i++) {
        // ball right square side
        if (is_point_into_region(ball.x+ball.r, i, cube)) {
            return 3;
        }
        // ball left square side
        if (is_point_into_region(ball.x-ball.r, i, cube)) {
            return 4;
        }
    }
    return -1;
}


function collision_racket_with_ball(racket, ball)
{
    return collision_ball_with_cube(ball, racket);
}


function collision_brick_with_ball(brick, ball)
{
    return collision_ball_with_cube(ball, brick);
}


function set_ball_direction_due_to_collision(ball, type_collision)
{
    if (type_collision == 1 || type_collision == 2) {
        ball.vy = -ball.vy;
    }
    else if (type_collision == 3 || type_collision == 4) {
        ball.vx = -ball.vx;
    }
}


function init_objects()
{
    // -- Init Racket Entity
    racket = new Racket();
    let init_x = canvas.width/2 - racket.width/2;
    let init_y = canvas.height - (racket.height+30);
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
        color_index = (color_index + 1) % BRICK_COLORS.length;
    }

    // -- Init Ball
    ball = new Ball(canvas.width/2, racket.y - 150)
}


let key_pressed = "";

function logic_game()
{
    // -- Collision Ball with Canvas
    if ((ball.x < (0+ball.r)) || (ball.x > (canvas.width - ball.r))) {
        ball.vx = -ball.vx;
    }
    if ((ball.y < (0+ball.r)) || (ball.y > (canvas.height - ball.r))) {
        ball.vy = -ball.vy;
    }

    // -- Collision Ball with the Bricks
    let collision = 0;
    for (let i = 0; i < bricks.length; i++) {
        collision = collision_brick_with_ball(bricks[i], ball);
        if (collision > 0) {
            set_ball_direction_due_to_collision(ball, collision);
            bricks.splice(i, 1);
        }
    }

    // -- Collision Ball with the Racket
    collision = collision_racket_with_ball(racket, ball)
    if (collision > 0) {
        set_ball_direction_due_to_collision(ball, collision);
    }

    // -- Movement Racket. Defining Limits with Canvas
    if (key_pressed == 'a') {
        if (racket.x > 0) {
            racket.moveTo(racket.x-4, racket.y);
        }
    }
    if (key_pressed == 'd') {
        if (racket.x < (canvas.width - racket.width)) {
            racket.moveTo(racket.x+4, racket.y);
        }
    }

    // Update ball position
    ball.update();

    if (bricks.length > 0) {
        bricks_cont.innerHTML = bricks.length;
    }
    else {
        title_bricks_cont.innerHTML = "WELL DONE!!";
        title_bricks_cont.style.color = 'red';
    }
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


// ----- Events
window.onkeydown = (e) => {
    key_pressed = e.key;
}

window.onkeyup = (e) => {
    key_pressed = "";
}

button_left.onmousedown = () => {
    key_pressed = "a";
}

button_left.onmouseup = () => {
    key_pressed = "";
}

button_left.ontouchstart = () => {
    key_pressed = "a";
}

button_left.ontouchend = () => {
    key_pressed = "";
}

button_right.onmousedown = () => {
    key_pressed = "d";
}

button_right.onmouseup = () => {
    key_pressed = "";
}

button_right.ontouchstart = () => {
    key_pressed = "d";
}

button_right.ontouchend = () => {
    key_pressed = "";
}


// -- Main Program
init_objects();
function update()
{
    logic_game();
    clear_display();
    update_display();
    requestAnimationFrame(update);
}

update();