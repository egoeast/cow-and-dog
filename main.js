"use strict";

import {Point, getRandomInt} from "./Helpers";
import {Wall} from "./Wall";
import {Stall} from "./Stall";
import {Cow} from "./Cow";
import {Dog} from "./Dog";
import {COW_RUN, SLEEP_TIME, DOG_DELAY_SIT, COWS_NUMBER} from "./constants";
import {Canvas} from "./Canvas";

const FPS = 60;
const DISTANTION_TO_DOG = 300;


let gates = [];
let walls = [];
let stalls = [];
let cows = [];
let objects = []
let score = 0;
let dog;


let content = document.getElementById('game-content');
let contentX;
let contentY;

let scrollHeight;
let contX = document.getElementById('cont-x');
let contY = document.getElementById('cont-y');

let height;
let width;
let wallHeight;
let gateHeight;

let canvas = new Canvas('game-content');


function makeCanvas() {

    scrollHeight = Math.max(
        /*document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight*/
        window.innerHeight , document.documentElement
    );

    content.style.height = scrollHeight - 100 + 'px';
    //content.style.width = document.body.clientWidth + 'px';

    contentX = content.clientWidth;
    contentY = content.clientHeight;
    height = contentY - 220;
    width = contentX - 600;
    wallHeight = (contentY - 240) / 3;
    gateHeight = 120;
}

function deleteObjectsFromCanvas(objects) {
    if (objects.length > 0) {
        objects.forEach((item) => {
            content.removeChild(item.element);
        })
    }
}

function drawObjects(objects) {
    objects.forEach((item) => {
        item.draw();
    });
}

function clearCanvas() {
    deleteObjectsFromCanvas(stalls);
    stalls = [];
    deleteObjectsFromCanvas(gates);
    gates = [];
    deleteObjectsFromCanvas(walls);
    walls = [];
    deleteObjectsFromCanvas(cows);
    cows = [];
}
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
        cow = new Cow(content, id, new Point(randX, randY), 100, 100, canvas);

        walls.forEach((wall) => {
            if (cow.isCollideWith(wall)) {
                flag = false;
            }
        });

        gates.forEach((gate) => {
            if (cow.isCollideWith(gate)) {
                flag = false;
            }
        });

        cows.forEach((item) => {
            if (cow.isCollideWith(item)) {
                flag = false;
            }
        });

        stalls.forEach((stall) => {
            if (cow.isCollideWith(stall)) {
                flag = false;
            }
        });
    }
    return cow;
}


function generateCowsAndStalls() {

    clearCanvas();

    let stall = new Stall(content, 'stall', new Point(0, 0), 120, contentY / 2, 'right', true, canvas);
    let stall2 = new Stall(content, 'stall-2', new Point(0, contentY / 2), 120, contentY / 2, 'right', false, canvas);
    let stall3 = new Stall(content, 'stall-3', new Point(contentX - 115, 0), 120, contentY / 2, 'left', false, canvas);
    let stall4 = new Stall(content, 'stall-4', new Point(contentX - 115, contentY / 2), 120, contentY / 2, 'left', true, canvas);

    stalls = [
        stall,
        stall2,
        stall3,
        stall4,
    ];

    stalls.forEach((stall) => {
        walls = walls.concat(stall.walls);
        gates = gates.concat(stall.gates);
    });

    stall2.openTimer = 12;
    stall4.openTimer = 7;

    for (let i = 0; i < COWS_NUMBER; i++) {
        let cow = generateCow('cow-' + i);
        cows.push(cow);
    }

    // Прорисовка всех объектов

    drawObjects(cows);
    drawObjects(walls);
    drawObjects(stalls);
    drawObjects(gates);

}

//window.addEventListener('click', someFunction,false);
//window.addEventListener('touchmove', someFunction,false);

function touchMoveFunction(event) {
    onMoveAction(event.touches[0].clientX, event.touches[0].clientY);
}

function mouseMoveFunction(event) {
    let offset = canvas.getOffset;
    let x = event.clientX- offset.x;
    let y = event.clientY- offset.y;
    onMoveAction(x, y);
}


if ('ontouchstart' in window) {
    /* browser with Touch Events support */
    window.addEventListener('touchmove', touchMoveFunction,false);
    //content.onmousemove = mouseMoveFunction;
} else {

    //window.addEventListener('onmousemove', mouseMoveFunction,false);
}

window.onload = () => {
    console.log(canvas.getOffset);
    content.onmousemove = mouseMoveFunction;
    makeCanvas();
    generateCowsAndStalls();
    let wall =  new Wall(canvas.element, 'wall-1-' + 1,new Point(1810, 1100), 40, 40, canvas);
    wall.draw();
    dog = new Dog(content, 'dog', new Point(200, 200), 100, 100, canvas);
    dog.draw();
    console.log(canvas.getMaxHeight);
    /********************************************
     * Таймер для управления состояниями объектов
     ********************************************/

    setInterval(() => {
        let s = new Date().getTime();
        s = parseInt(s / 1000);

        cows.forEach((cow) => {
            cow.manageStates(s);
            if (cow.sleepTimer > SLEEP_TIME) {
                cow.sleepTimer = 0;
                cow.setState(COW_RUN);
                cow.moveOnRoute();
                stalls.forEach((stall) => {
                    if (cow.inObject(stall)) {
                        stall.cows--;
                    }
                })
            }

        });

        stalls.forEach((stall) => {
            stall.manageStates();
        });

        dog.manageStates();

    }, 1000);

    /**
     *Таймер для прорисовки объектов
     */

    let running = true;

    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback, element) {
                return window.setTimeout(callback, 1000 / FPS);
            };
    })();

    function loop() {
        if (running) {

            cows.forEach((cow) => {

                if (cow.moving === true) {
                    walls.forEach((wall) => {
                        if (cow.collideCircleWithSquare(wall)) {
                            console.log("Collide!!!");
                        }
                    });
                    cows.forEach((item) => {
                        if (cow !== item) {
                            if (cow.collideCircleWithSquare(item)) {
                                let v = cow.calculateVectorFromPoint(item.getX, item.getY);
                                cow.addVector(v);
                            }
                        }
                    });
                    gates.forEach((gate) => {
                        if (cow.isCollideWith(gate)) {
                            console.log("Collide!!!");
                        }
                    });
                }




                let inStall = false;
                let currentStall;
                stalls.forEach((stall) => {
                    if (cow.inObject(stall)) {
                        inStall = true;
                        currentStall = stall;
                    }
                });

                if (inStall && !cow.isOnRoute() && !cow.isSleeping()) {
                    //cow.sleep();
                    if (currentStall.cows % 2 === 0) {
                        cow.addPointToRoute(new Point(currentStall.getX - 10, currentStall.getY - currentStall.halfHeight + 60));
                    } else {
                        cow.addPointToRoute(new Point(currentStall.getX - 10, currentStall.getY - 60 + currentStall.height));
                    }
                    cow.moveOnRoute();
                    cow.run();
                    cow.available = false;


                }

                cow.doStaff();

                if (cow.isArrived() && !cow.isSleeping() && inStall) {
                    score++;
                    dog.getBone();
                    document.getElementById('score').innerText = 'Total: ' + score;
                    //alert('+1 bone!');
                    cow.sleep();
                    currentStall.cows++;
                    cow.stand();
                    cow.route = cow.route.concat(currentStall.escapeRoute);
                    cow.addPointToRoute(cow.respawnPoint);
                }

                if (cow.isArrived() && !cow.isSleeping() && !inStall) {
                    cow.eat();
                    cow.stand();
                }

                if (cow.isSleeping() && inStall) {
                    if (!currentStall.isOpen && cow.sleepTimer > SLEEP_TIME - 2) {
                        cow.sleepTimer = SLEEP_TIME - 3;
                    }
                }

            });

            gates.forEach((gate) => {
                gate.doThing();
            });
            dog.makeVectorToDestination();

            cows.forEach((item) => {
                if (dog.isCollideRoundWith(item)) {
                }
            });

            gates.forEach((item) => {
                if (dog.collideCircleWithSquare(item)) {
                }
            });

            walls.forEach((item) => {
                if (dog.collideCircleWithSquare(item)) {
                }
            });

            dog.move();


            requestAnimationFrame(loop);
        }
    }

    requestAnimationFrame(loop);


    //---------------------------------------

    function handlerMove(event) {

        //onMoveAction(event)

    }
};

function onMoveAction(clientX, clientY) {
    dog.route = []
    dog.addPointToRoute(new Point(clientX, clientY));
    console.log(dog.route[0].x, dog.route[0].y);

    //dog.addPointToRoute(new Point(-110, 1000));
    dog.moving = true;
    dog.moveOnRoute();
    let dogBarks = false;

    cows.forEach((cow) => {

        if (cow.distanceTo(dog) <= DISTANTION_TO_DOG) {
            dogBarks = true;
            cow.runFrom(dog);
        } else {
            cow.setCurrentState();
        }

    });

    if (dogBarks && !dog.isGetBone() && !dog.isBark()) {
        dog.skip();
        dog.clearTimer();
    } else {
        if (!dog.isGetBone() && !dog.isBark()) {
            dog.run();
        }
        dog.clearTimer();

    }
}


function displayVector(cow) {
    contX.innerText = cow.vector.getX;
    contY.innerText = cow.vector.getY;
    let vLength = document.getElementById('vector-length');
    vLength.innerText = Math.sqrt(cow.vector.getY * cow.vector.getY + cow.vector.getX * cow.vector.getX);
    let vectorLog = document.getElementById('lineAB');
    vectorLog.setAttribute('d', "M 200 200 l " + cow.vector.getX * 20 + " " + cow.vector.getY * 20);
}

window.onclick = () => {
    cows.forEach((cow) => {
        if (cow.distanceTo(dog) <= DISTANTION_TO_DOG) {
            cow.scat();
            cow.boost();
            cow.runFrom(dog);
            dog.bark();
        }
    })
};

window.onresize = (event) => {
    clearCanvas();
    makeCanvas();
    generateCowsAndStalls();
};

