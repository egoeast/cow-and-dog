"use strict";

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get getCoord() {
        return [this.x, this.y];
    }

    get getX() {
        return this.x;
    }

    get getY() {
        return this.y;
    }

    set setX(x) {
        this.x = x;
    }

    set setY(y) {
        this.y = y;
    }

    set setCoord(newValue) {
        [this.x, this.y] = newValue;
    }

}

class Vector extends Point {

    vectorLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    prepareDirection(l) {
        let ln = this.vectorLength();
        this.x = (this.x / ln) * l;
        this.y = (this.y / ln) * l;
        return true;
    }

    normalize() {
        if (this.x === 0 && this.y === 0) {
            this.x = 0;
            this.y = 0;
        } else {
            let ln = Math.sqrt(this.x * this.x + this.y * this.y);
            this.x = (this.x / ln);
            this.y = (this.y / ln);
        }
        return true;

    }

    multiplicate(value) {
        this.x = this.x * value;
        this.y = this.y * value;
    }

    addVector(vector) {
        this.x += vector.getX;
        this.y += vector.getY;
    }
}

class BaseObject {

    constructor(container, id, point, width, height) {
        this.container = container;
        this.width = width;
        this.id = id;
        this.height = height;
        this.location = point;
        this.center = new Point(point.getX + width / 2, point.getY + height / 2);
    }

    draw() {
        this.element = document.createElement('div');
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.container.appendChild(this.element);
        this.element.className = 'obj';
        this.element.id = this.id;
        this.setPosition();
    }

    setPosition() {
        this.center = new Point(this.location.getX + this.width / 2, this.location.getY + this.height / 2)
        this.element.style.top = this.location.getY + 'px';
        this.element.style.left = this.location.getX + 'px';
    }

    get getX() {
        return this.location.getX;
    }

    get getY() {
        return this.location.getY;
    }

    set setX(x) {
        this.location.setY(x);
    }

    set setY(y) {
        this.location.setY(y);
    }

    set setLocation(point) {

    }

}

class Wall extends BaseObject {
    constructor(element, id, point, width, height) {
        super(element, id, point, width, height);

    }

    draw() {
        super.draw();
        this.element.style.background = 'black';
    }
}


class Stall extends BaseObject {
    constructor(element, id, point, width, height) {
        super(element, id, point, width, height);
    }

    draw() {
        super.draw();
        this.element.style.background = 'grey';
    }
}

class MovableObject extends BaseObject {

    constructor(element, id, point, width, height) {
        super(element, id, point, width, height);
        this.moving = false;
        this.speed = 9;
        this.vector = new Vector(0, 0)
        this.route = [];
    }

    moveToPoint () {
        if (this.moving) {
            this.makeVectorToDestination();
            let vector = this.vector;
            this.location.setCoord = [this.getX + vector.getX, this.getY + vector.getY];
            this.center.setCoord = [this.getX + this.width / 2, this.getY + this.height / 2];

            if (this.getX < 0) this.location.x = 0;
            if (this.getY < 0) this.location.y = 0;
            if (this.getX > this.container.clientWidth - this.width / 2) this.location.x = this.container.clientWidth - this.width / 2;
            if (this.getY > this.container.clientHeight - this.height / 2) this.location.y = this.container.clientHeight - this.height / 2;

            this.element.style.top = (this.getY) + 'px';
            this.element.style.left = (this.getX) + 'px';
        }

    }

    move() {
        if (this.moving) {
            let vector = this.vector;
            this.location.setCoord = [this.getX + vector.getX, this.getY + vector.getY];
            this.center.setCoord = [this.getX + this.width / 2, this.getY + this.height / 2];

            if (this.getX < 0) this.location.x = 0;
            if (this.getY < 0) this.location.y = 0;
            if (this.getX > this.container.clientWidth - this.width / 2) this.location.x = this.container.clientWidth - this.width / 2;
            if (this.getY > this.container.clientHeight - this.height / 2) this.location.y = this.container.clientHeight - this.height / 2;

            this.element.style.top = (this.getY) + 'px';
            this.element.style.left = (this.getX) + 'px';
        }
    }

    makeDirectionToPoint(x, y) {
        let v = new Vector(x - this.center.x, y - this.center.y);
        let tempV = Object.assign(new Vector(0, 0), v);
        v.normalize();
        v.multiplicate(this.speed);

        if (tempV.vectorLength() < v.vectorLength()) {
            this.vector = tempV;
        } else {
            this.vector = v;
        }
        return false;
    }

    addPointToRoute(point) {
        this.route.push(point)
    }

    makeVectorToDestination() {
        let v = new Vector(this.route[0].x - this.center.x, this.route[0].y - this.center.y);
        let tempV = Object.assign(new Vector(0, 0), v);
        v.normalize();
        v.multiplicate(this.speed);

        if (tempV.vectorLength() <= v.vectorLength()) {
            this.vector = tempV;
            this.moving = false;
            this.route.shift();
        } else {
            this.vector = v;
        }
        return false;
    }

    setDestinationPoint(point) {
        this.destinationPoint = point;
    }

    moveTo(x, y) {
        this.location.setCoord = [x, y];
        this.element.style.top = (this.getY) + 'px';
        this.element.style.left = (this.getX) + 'px';
        this.setPosition();
    }

    isCollideWith(object) {

        let distanceX = this.calculateDistanceToPoint(object.center.x, this.center.y);
        let distanceY = this.calculateDistanceToPoint(this.center.x, object.center.y);

        let directionX = 0;
        if (this.vector.x > 0) {
            directionX = 1
        } else {
            directionX = -1
        }
        let directionY = 0;
        if (this.vector.y > 0) {
            directionY = 1
        } else {
            directionY = -1
        }
        let collideX;
        let collideY;
        //Определяем с какой стороны от обекта находится наш обЪект
        if (this.center.x < object.center.x) {
            collideX = distanceX - this.vector.x;
        } else {
            collideX = distanceX + this.vector.x;
        }
        if (this.center.y < object.center.y) {
            collideY = distanceY - this.vector.y;
        } else {
            collideY = distanceY + this.vector.y;
        }


        if ((collideX < object.width / 2 + this.width / 2) && (collideY < object.height / 2 + this.height / 2)) {

            if ((this.width / 2 + object.width / 2) - collideX > ((this.height / 2 + object.height / 2) - collideY)) {
                this.vector.y = directionY * (distanceY - (this.height / 2 + object.height / 2));

            } else {
                this.vector.x = directionX * (distanceX - (this.width / 2 + object.width / 2));
            }
            return true;
        }

        return false;
    }

    get getV() {
        return this.vector;
    }
}

const IS_OPENED = 'open';
const IS_CLOSED = 'close';

class Gates extends MovableObject {

    constructor(element, id, point, width, height) {
        super(element, id, point, width, height);
        this.isOpened = true;
        this.openTimer = 0;
        this.maxTimer = 10;
        this.destinationPoint = null;
    }


    draw() {
        super.draw();
        this.element.style.background = 'black';
    }

    prepare() {
        this.openTimer = 0;
        if (this.isOpened) {
            this.route.push( new Point(this.center.x, this.center.y + this.height) );
            this.isOpened = false;
        } else {
            this.route.push( new Point(this.center.x, this.center.y - this.height) );
            this.isOpened = true;
        }
        this.moving = true;

    }

    doThing() {
        this.moveToPoint();
    }

    getDirection() {

    }

    up() {

    }

}

const COW_EAT = 'eat';
const COW_RUN = 'run';
const COW_MOOS = 'moos';
const COW_SLEEP = 'sleep';
const COW_SCAT = 'scat';
const COW_SKIP = 'skip';
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';

const STATES = [
    COW_SCAT,
    COW_MOOS,
    COW_EAT,
    COW_SKIP,
];

class Cow extends MovableObject {

    constructor(element, id, point, width, height) {
        super(element, id, point, width, height);
        this.sleepTimer = 0;
        this.eatTimer = 0;
        this.currentState = getRandomInt(0, STATES.length);
        this.respawnPoint = Object.assign({}, point);
        this.imageDirection = DIRECTION_RIGHT;
    }

    draw() {
        super.draw();
        this.element.id = this.id;
        let img = document.createElement('img');
        this.element.appendChild(img);
        this.setState(STATES[this.currentState]);
        this.element.style.padding = 0 + 'px';
        this.element.style.zIndex = 11;

    }

    respawn() {
        this.moveTo(this.respawnPoint.x, this.respawnPoint.y);
    }

    get getSphere() {
        return this.boundingShpere;
    }

    setState(state) {
        if (this.state !== state) {
            this.state = state;
            switch (this.state) {
                case COW_EAT : {
                    this.setImage('i/mm_cow_eat.gif');
                    this.moving = false;
                    this.isAvailable = false;
                    this.sleepTimer = 0;
                    break;
                }
                case COW_RUN : {
                    this.setImage('i/mm_cow_run.gif');
                    this.moving = true;
                    this.isAvailable = true;
                    break;
                }
                case COW_MOOS : {
                    this.setImage('i/mm_cow_moos.gif');
                    this.moving = false;
                    this.isAvailable = true;
                    this.eatTimer = 0;
                    break;
                }
                case COW_SLEEP : {
                    this.setImage('i/mm_cow_sleep.gif');
                    this.moving = false;
                    this.isAvailable = false;
                    break;
                }
                case COW_SCAT : {
                    this.setImage('i/mm_cow_scat.gif');
                    this.moving = false;
                    this.isAvailable = true;
                    break;
                }
                case COW_SKIP : {
                    this.setImage('i/mm_cow_skipping.gif');
                    this.moving = false;
                    this.isAvailable = true;
                    break;
                }
                default : {
                    break;
                }
            }
        }
    }


    nextRandomState() {
        this.currentState = getRandomInt(0, STATES.length);
        this.setState(STATES[this.currentState]);
    }

    nextState() {
        this.currentState++;
        if (this.currentState > STATES.length) {
            this.currentState = 0;
        }
        this.setState(STATES[this.currentState]);
    }


    setImage(path) {
        this.element.children[0].setAttribute('src', path);
    }

    calculateDistanceToPoint(x, y) {
        return Math.sqrt(Math.pow(this.center.x - x, 2) + Math.pow(this.center.y - y, 2));
    }

    makeDirectionFromPoint(x, y) {
        let v = new Vector(this.center.x - x, this.center.y - y);
        v.normalize();
        v.multiplicate(this.speed);

        let angle = 0.5 * getRandomInt(-1, 1);
        console.log(angle);
        this.vector.x = v.x * Math.cos(angle) - v.y * Math.sin(angle);
        this.vector.y = v.y * Math.cos(angle) + v.x * Math.sin(angle);

        //this.vector  = v;
        this.checkDirection();
        return false;
    }

    makeDirectionToPoint(x, y) {
        let v = new Vector(x - this.center.x, y - this.center.y);
        v.normalize();
        v.multiplicate(this.speed);
        this.vector = v;
        this.checkDirection();
        return false;
    }

    checkDirection() {
        if (this.isAvailable) {
            if (this.vector.getX < 0 && this.imageDirection !== DIRECTION_LEFT) {
                this.imageDirection = DIRECTION_LEFT;
                this.element.children[0].className = 'left';
            }
            if (this.vector.getX > 0 && this.imageDirection !== DIRECTION_RIGHT) {
                this.imageDirection = DIRECTION_RIGHT;
                this.element.children[0].className = '';
            }
        }
    }

    calculateVectorFromPoint(x, y) {
        let v = new Vector(this.center.x - x, this.center.y - y);
        v.normalize();
        v.multiplicate(this.speed);
        return v;
    }

    set setVector(vector) {
        this.vector = vector;
    }


    inObject(object) {
        return ((this.location.x > object.location.x) &&
            (this.location.x + this.width < object.location.x + object.width) &&
            (this.location.y > object.location.y) &&
            (this.location.y + this.height < object.location.y + object.height)
        );

    }
}

const DOG_SIT = 'dog-sit';
const DOG_RUN = 'dog-run';
const DOG_BARK = 'dog-bark';

class Dog {
    constructor(element) {
        this.element = element;
        this.setState(DOG_SIT);
        this.timer = 0;
    }

    setState(state) {
        if (this.state !== state) {
            this.state = state;
            this.element.className = state;
        }
    }

    incTimer() {
        this.timer++;
    }

    setToZeroTimer()
    {
        this.timer = 0;
    }

}



var content = document.getElementById('content');
var dog = new Dog(content);

var contX = document.getElementById('cont-x');
var contY = document.getElementById('cont-y');

var contentX = content.clientWidth;
var contentY = content.clientHeight;

var wall = new Wall(content, 'wall', new Point(900, 300), 5, 150);
var wall2 = new Wall(content, 'wall2', new Point(900, 0), 5, 150);
var wall3 = new Wall(content, 'wall3', new Point(0, 400), 900, 5);
var wall4 = new Wall(content, 'wall4', new Point(500, 100), 5, 200);
var wall5 = new Wall(content, 'wall5', new Point(750, 110), 5, 300);
var wall6 = new Wall(content, 'wall6', new Point(0, 300), 330, 5);
var wall7 = new Wall(content, 'wall7', new Point(630, 0), 5, 280);
var wallHeight = (contentY - 240) / 3;
var gateHeight = 120;
var wall8 = new Wall(content, 'wall8', new Point(contentX - 120, 0), 5, wallHeight);
var wall9 = new Wall(content, 'wall9', new Point(contentX - 120, wallHeight + gateHeight), 5, wallHeight);
var wall10 = new Wall(content, 'wall10', new Point(contentX - 120, wallHeight * 2 + gateHeight * 2), 5, wallHeight);
var gate = new Gates(content, 'gate', new Point(contentX - 125, wallHeight - gateHeight), 10, gateHeight);
var gate2 = new Gates(content, 'gate2', new Point(contentX - 125, wallHeight*2 ), 10, gateHeight);
//gate.openTimer = 10;

var stall = new Stall(content, 'stall', new Point(0, 0), 500, 300);
var stall2 = new Stall(content, 'stall2', new Point(contentX - 115, 0), 120, contentY);

var gates = [gate, gate2];
var walls = [wall, wall2, wall3, wall4, wall5, wall6, wall7, wall8, wall9, wall10];
var stalls = [stall, stall2];
var cows = [];

var score = 0;

/**
 * Генерация коровы в рандомном месте
 * @param id
 * @returns {*}
 */
function generateCow(id) {
    let maxX = content.clientWidth - 50;
    let maxY = content.clientHeight - 50;
    let flag = false;
    let cow;
    while (!flag) {
        flag = true;
        let randX = getRandomInt(0, maxX);
        let randY = getRandomInt(0, maxY);
        cow = new Cow(content, id, new Point(randX, randY), 100, 100);

        walls.forEach((item) => {
            if (cow.isCollideWith(item)) {
                flag = false;
            }
        });

        gates.forEach((item) => {
            if (cow.isCollideWith(item)) {
                flag = false;
            }
        });


        cows.forEach((item) => {
            if (cow.isCollideWith(item)) {
                flag = false;
            }
        });

        stalls.forEach((item) => {
            if (cow.isCollideWith(item)) {
                flag = false;
            }

        });
    }
    return cow;
}


window.onload = () => {

    var content = document.getElementById('content');
    content.onmouseover = handlerOver;
    content.onmouseout = handlerOut;
    content.onmousemove = handlerMove;


    for (let i = 0; i < 20; i++) {
        let cow = generateCow('cow-' + i);
        cows.push(cow);
    }

    /********************************************
     * Прорисовка всех объектов
     ********************************************/

    walls.forEach((wall) => {
        wall.draw();
    });

    stalls.forEach((stall) => {
        stall.draw();
    });

    gates.forEach((gate) => {
        gate.draw();
    });

    cows.forEach((cow) => {
        cow.draw();
    });
    //*******************************************

    var fps = 1;
    var timer = setInterval(() => {
        Timer();
    }, 1000 / fps);



//------------------------------------------------
    function Timer() {
        var s = new Date().getTime();
        s = parseInt(s / 1000);

        cows.forEach(function (item, index) {
            if (item.state === COW_SLEEP) {
                item.sleepTimer++;
            }

            if (item.state === COW_EAT) {
                item.eatTimer++;
            }
            if (item.sleepTimer > 15) {
                item.respawn();
                item.setState(COW_EAT);
            }

            if (item.eatTimer > 5) {
                item.setState(COW_SCAT);
            }

        });



            gates.forEach((gate) => {
                gate.openTimer ++;
                if (gate.openTimer > gate.maxTimer) {
                    gate.prepare();
                    console.log(gates);

                }
            });


        if (s % 5 == 0) {
            cows.forEach(function (item, index) {
                if (item.isAvailable && !item.moving) {
                    item.nextRandomState();
                }
            })
        }

        if (dog.timer > 3) {
            dog.setState(DOG_SIT)
        }
        dog.incTimer();

    }

    //---------------------------------------

    var fps = 25; // 50 кадров в секунду
    var timer = setInterval(function () {

        cows.forEach(function (item, index) {

            walls.forEach(function (wItem, index) {
                if (item.isCollideWith(wItem)) {
                    console.log("Collide!!!");
                }
            });

            gates.forEach(function (gItem, index) {
                if (item.isCollideWith(gItem)) {
                    console.log("Collide!!!");
                }
            });

            let inStall = false;
            stalls.forEach((stall) => {
                if (item.inObject(stall) && item.state !== COW_SLEEP) {
                    inStall = true;
                }
            })

            if (inStall) {
                item.setState(COW_SLEEP);
/*
                item.setDestinationPoint(new Point(100, 100));
                item.makeDirectionToPoint(1950,55);
                item.setState(COW_RUN);
               item.move();
*/
                score++;
                document.getElementById('score').innerText = 'Total: ' + score;
            } else {
                item.move();
            }
        })
        gates.forEach((gate) => {
            gate.doThing();
        })


    }, 1000 / fps);

    //---------------------------------------

    function handlerOut(event) {


    }

    function handlerMove(event) {

        let dogBarks = false;

        cows.forEach(function (item, index) {

            let currentCow = item;
            if (item.calculateDistanceToPoint(event.clientX, event.clientY) <= 200) {
                dogBarks =true;
                item.makeDirectionFromPoint(event.clientX, event.clientY);
                cows.forEach(function (item, index) {
                    if (currentCow !== item) {
                        if (currentCow.isCollideWith(item)) {
                            let v = currentCow.calculateVectorFromPoint(item.getX, item.getY);
                            currentCow.vector.addVector(v);
                        }
                    }
                })
            } else {
                if (item.isAvailable) {
                    item.setState(COW_MOOS);
                }
            }

            if (item.calculateDistanceToPoint(event.clientX, event.clientY) <= 200 && !item.moving) {

                item.makeDirectionFromPoint(event.clientX, event.clientY);
                if (item.isAvailable)
                    item.setState(COW_RUN);

               /* cows.forEach(function (item, index) {
                    if (currentCow !== item) {
                        if (currentCow.isCollideWith(item)) {
                            let v = currentCow.calculateVectorFromPoint(item.getX, item.getY);
                            currentCow.vector.addVector(v);
                        }
                    }
                })*/
            }


            contX.innerText = item.vector.getX;
            contY.innerText = item.vector.getY;
            let vLength = document.getElementById('vector-length');
            vLength.innerText = Math.sqrt(item.vector.getY * item.vector.getY + item.vector.getX * item.vector.getX);
            let vectorLog = document.getElementById('lineAB');
            vectorLog.setAttribute('d', "M 200 200 l " + item.vector.getX * 20 + " " + item.vector.getY * 20);
        });

        if (dogBarks) {
            dog.setState(DOG_BARK);
            dog.setToZeroTimer();
        } else {
            dog.setToZeroTimer();
            dog.setState(DOG_RUN);
        }


    }

    function handlerOver(event) {

        return false;
    }
}