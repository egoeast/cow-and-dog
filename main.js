"use strict";

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
    prepareDirection(l) {
        let ln = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x = (this.x / ln) * l;
        this.y = (this.y / ln) * l;
        return true;
    }

    normalize() {
        let ln = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x = (this.x / ln);
        this.y = (this.y / ln);
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

        this.height = height;
        this.location = point;

        let center = new Point(point.getX + width / 2, point.getY + height / 2)
        this.center = center;

        this.element = document.createElement('div');
        this.element.style.width = width + 'px';
        this.element.style.height = height + 'px';
        container.appendChild(this.element);
        this.element.className = 'obj';
        this.element.id = id;
        this.setPorition();
    }

    setPorition() {
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
        this.element.style.background = 'black';
    }
}


class Stall extends BaseObject {
    constructor(element, id, point, width, height) {
        super(element, id, point, width, height);
        this.element.style.background = 'grey';
    }
}

class MovableObject extends BaseObject {

    constructor(element, id, point, width, height) {
        super(element, id, point, width, height);
        this.moving = false;
        this.speed = 6;
        this.vector = new Vector(0, 0)
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

    moveTo(x, y) {
        this.location.setCoord = [x, y];
        this.element.style.top = (this.getY) + 'px';
        this.element.style.left = (this.getX) + 'px';
        this.setPorition();
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


const COW_EAT = 'eat';
const COW_RUN = 'run';
const COW_MOOS = 'moos';
const COW_SLEEP = 'sleep';
const COW_SCAT = 'scat';
const COW_SKIP = 'skip';

var states = [
    COW_SLEEP,
    COW_MOOS,
    COW_EAT,
    COW_SCAT,
    COW_SKIP
]

class Cow extends MovableObject {

    constructor(element, id, point, width, height) {
        super(element, id, point, width, height);
        this.sleepCounter = 0;
        this.respawnPoint = Object.assign({}, point);

        let div = document.createElement('div');
        this.element.appendChild(div);
        this.element.id = id;
        let img = document.createElement('img');
        this.element.children[0].appendChild(img);
        this.setState(COW_MOOS);
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
                    this.element.children[0].children[0].setAttribute('src', 'i/mm_cow_eat.gif');
                    this.moving = false;
                    break;
                }
                case COW_RUN : {
                    this.element.children[0].children[0].setAttribute('src', 'i/mm_cow_run.gif');
                    this.moving = true;
                    break;
                }
                case COW_MOOS : {
                    this.element.children[0].children[0].setAttribute('src', 'i/mm_cow_moos.gif');
                    this.moving = false;
                    break;
                }
                case COW_SLEEP : {
                    this.element.children[0].children[0].setAttribute('src', 'i/mm_cow_sleep.gif');
                    this.moving = false;
                    break;
                }
                case COW_SCAT : {
                    this.element.children[0].children[0].setAttribute('src', 'i/mm_cow_scat.gif');
                    this.moving = false;
                    break;
                }
                case COW_SKIP : {
                    this.element.children[0].children[0].setAttribute('src', 'i/mm_cow_skipping.gif');
                    this.moving = false;
                    break;
                }
                default : {
                    break;
                }
            }
        }
    }

    calculateDistanceToPoint(x, y) {
        return Math.sqrt(Math.pow(this.center.x - x, 2) + Math.pow(this.center.y - y, 2));
    }

    makeDirectionFromPoint(x, y) {
        let v = new Vector(this.center.x - x, this.center.y - y);
        v.normalize();
        v.multiplicate(this.speed);
        this.vector = v;
        return false;
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


window.onload = () => {
    var currentState = 0;

    function Timer() {
        var s = new Date().getTime();
        s = parseInt(s / 1000);

        var h = parseInt(s / 3600);
        s -= h * 3600;
        var m = parseInt(s / 60);
        s -= m * 60;
        //console.log(m + ':' + s);

        cows.forEach(function (item, index) {
            if (item.state === COW_SLEEP) {
                item.sleepCounter++;
            }
            if (item.sleepCounter > 15) {
                item.respawn();
                console.log(item.respawnPoint)
                item.setState(COW_MOOS);
                item.sleepCounter = 0;
            }

        });


        /*if (s%5 == 0) {
            currentState++;
            if (currentState >= 5) {
                currentState = 0;
            }
            cows.forEach(function (item, index) {
                item.setState(states[currentState]);
            })
        }*/

    }


    var fps = 1; // 50 кадров в секунду
    var timer = setInterval(function () {
        Timer();
    }, 1000 / fps);


    var content = document.getElementById('content');
    var point = new Point(1200, 25)
    var cow = new Cow(content, 'cow', point, 100, 100);
    console.log(cow);
    cow.setPorition();
    var point = new Point(800, 300)
    var cow2 = new Cow(content, 'cow1', point, 100, 100);
    var cow3 = new Cow(content, 'cow3', new Point(1300,300), 100, 100);
    var cows = [cow, cow2, cow3];

    var point = new Point(900, 300);
    var wall = new Wall(content, 'wall', point, 50, 150);
    var point = new Point(900, 0);
    var wall2 = new Wall(content, 'wall2', point, 50, 150);
    var point = new Point(0, 400);
    var wall3 = new Wall(content, 'wall3', point, 900, 50);

    var point = new Point(500, 100);
    var wall4 = new Wall(content, 'wall4', point, 10, 200);

    var wall5 = new Wall(content, 'wall5', new Point(750, 110), 10, 300);

    var wall6 = new Wall(content, 'wall6', new Point(0, 300), 330, 10);

    var wall7 = new Wall(content, 'wall7', new Point(630, 0), 10, 280);

    var walls = [wall, wall2, wall3, wall4, wall5, wall6, wall7];

    var point = new Point(0, 0);

    var stall = new Stall(content, 'stall', point, 500, 300)

    var content = document.getElementById('content');
    var contX = document.getElementById('cont-x');
    var contY = document.getElementById('cont-y');
    var shprere = document.getElementById('cow');
    var shprere2 = document.getElementById('cow1');
    //var cow = new Cow('cow-cicle', 80);
    //var rock = new BaseObject('rock');
    content.onmouseover = handlerOver;
    content.onmouseout = handlerOut;
    content.onmousemove = handlerMove;

    var score = 0;

    //---------------------------------------

    var fps = 25; // 50 кадров в секунду
    var timer = setInterval(function () {

        cows.forEach(function (item, index) {


            walls.forEach(function (wItem, index) {
                if (item.isCollideWith(wItem)) {

                    console.log("Collide!!!");
                    //item.setState(COW_SCAT);
                }
            })
            if (item.isCollideWith(wall)) {

                //item.setState(COW_SCAT);
            }

            //item.vector.prepareDirection(item.speed);
            if (item.inObject(stall) && item.state !== COW_SLEEP) {
                item.setState(COW_SLEEP);
                score++;
                document.getElementById('score').innerText = 'Total: ' + score;
            } else {
                item.move();
            }
        })


    }, 1000 / fps);

    //---------------------------------------


    var moving = false;


    var vector = new Vector();

    function handlerOut(event) {

        cows.forEach(function (item, index) {
            //item.setState(COW_EAT);
            if ((event.fromElement === item.element) || (event.fromElement === item.element.children[0]) || (event.fromElement === item.element.children[0].children[0])) {
                //item.moving = false;
                //item.setState(COW_EAT);
            }
        });
    }

    function handlerMove(event) {

        cows.forEach(function (item, index) {

            let currentCow = item;
            if (item.calculateDistanceToPoint(event.clientX, event.clientY) <= 200) {
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
                if (item.state !== COW_SLEEP) {
                    item.setState(COW_MOOS);
                }
            }

            if (item.calculateDistanceToPoint(event.clientX, event.clientY) <= 200 && !item.moving) {

                item.makeDirectionFromPoint(event.clientX, event.clientY);
                if ((item.state !== COW_RUN) && (item.state !== COW_EAT) && (item.state !== COW_SLEEP))
                    item.setState(COW_RUN);

                cows.forEach(function (item, index) {
                    if (currentCow !== item) {
                        if (currentCow.isCollideWith(item)) {
                            let v = currentCow.calculateVectorFromPoint(item.getX, item.getY);
                            currentCow.vector.addVector(v);
                        }
                    }
                })

                if (item.calculateDistanceToPoint(event.clientX, event.clientY) >= 200) {
                    // item.setState(COW_MOOS);
                }
            }


            contX.innerText = item.vector.getX;
            contY.innerText = item.vector.getY;
            let vLength = document.getElementById('vector-length');
            vLength.innerText = Math.sqrt(item.vector.getY * item.vector.getY + item.vector.getX * item.vector.getX);
            let vectorLog = document.getElementById('lineAB');
            vectorLog.setAttribute('d', "M 200 200 l " + item.vector.getX * 20 + " " + item.vector.getY * 20);
        });

    }

    function handlerOver(event) {

        return false;
    }
}