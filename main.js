"use strict";

import {Point, getRandomInt} from "./Helpers";
import {Wall} from "./Wall";
import {Stall} from "./Stall";
import {Cow} from "./Cow";
import {Dog} from "./Dog";
import {COW_RUN, SLEEP_TIME, DOG_DELAY_SIT} from "./constants";

const FPS = 60;
const DISTANTION_TO_DOG = 300;

let content = document.getElementById('content');
let dog = new Dog(content, 'dog', new Point(300, 0), 100, 100);
dog.draw();

var scrollHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
);


content.style.height = scrollHeight - 50 + 'px';
content.style.width = document.body.clientWidth + 'px';

let contX = document.getElementById('cont-x');
let contY = document.getElementById('cont-y');

let contentX = content.clientWidth;
let contentY = content.clientHeight;

/*
let wall = new Wall(content, 'wall', new Point(900, 300), 5, 150);
let wall2 = new Wall(content, 'wall-2', new Point(900, 0), 5, 150);
let wall3 = new Wall(content, 'wall-3', new Point(0, 400), 900, 5);
let wall4 = new Wall(content, 'wall-4', new Point(500, 100), 5, 200);
let wall5 = new Wall(content, 'wall-5', new Point(750, 110), 5, 300);
let wall6 = new Wall(content, 'wall-6', new Point(0, 300), 330, 5);
let wall7 = new Wall(content, 'wall-7', new Point(630, 0), 5, 280);
*/

let height = contentY - 220;
let width = contentX - 600;
let wall = new Wall(content, 'wall', new Point(contentX / 2 - width / 2 + 350, contentY / 2 - height / 2 + 200), 500, 500);
var wallHeight = (contentY - 240) / 3;
let gateHeight = 120;
let wall2 = new Wall(content, 'wall-2', new Point(350, 350), 50, 200);
//let wall9 = new Wall(content, 'wall-9', new Point(contentX - 120, wallHeight + gateHeight), 5, wallHeight);
//let wall10 = new Wall(content, 'wall-10', new Point(contentX - 120, wallHeight * 2 + gateHeight * 2), 5, wallHeight);
//let gate = new Gates(content, 'gate', new Point(contentX - 115, wallHeight - gateHeight), 10, gateHeight);
//let gate2 = new Gates(content, 'gate-2', new Point(contentX - 115, wallHeight * 2), 10, gateHeight);

//let wall2 = new Wall(content, 'wall-2', new Point(120, 0), 5, wallHeight);
//let wall3 = new Wall(content, 'wall-3', new Point(120, wallHeight + gateHeight), 5, wallHeight);
//let wall4 = new Wall(content, 'wall-4', new Point(120, wallHeight * 2 + gateHeight * 2), 5, wallHeight);
//let gate3 = new Gates(content, 'gate-3', new Point(115, wallHeight - gateHeight), 10, gateHeight);
//let gate4 = new Gates(content, 'gate-4', new Point(115, wallHeight * 2), 10, gateHeight);


let stall = new Stall(content, 'stall', new Point(0, 0), 120, contentY / 2, 'right', true);
let stall2 = new Stall(content, 'stall-2', new Point(0, contentY / 2), 120, contentY / 2, 'right', false);
let stall3 = new Stall(content, 'stall-3', new Point(contentX - 115, 0), 120, contentY / 2, 'left', false);
let stall4 = new Stall(content, 'stall-4', new Point(contentX - 115, contentY / 2), 120, contentY / 2, 'left', true);

stall2.openTimer = 12;
stall4.openTimer = 7;

let gates = [
    //gate, gate2, gate3, gate4
];
var walls = [
    wall,
    wall2
    //  wall2,wall3, wall4,
    //wall, wall2, wall3, wall4, wall5, wall6, wall7,
    // wall8, wall9, wall10
];
let stalls = [
    stall,
    stall2,
    stall3,
    stall4,
];
//walls = [stall.walls[0], stall.walls[1]];

stalls.forEach((stall) => {
    walls = walls.concat(stall.walls);
    gates = gates.concat(stall.gates);
});
let cows = [];

let score = 0;

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


window.onload = () => {


    content.onmousemove = handlerMove;
    for (let i = 0; i < 13; i++) {
        let cow = generateCow('cow-' + i);
        cows.push(cow);
    }
    /*let cow = new Cow(content, 'cow', new Point(600, 600), 100, 100);
    cows.push(cow);*/
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
            stall.openTimer++;
            if (stall.openTimer > stall.maxTimer) {
                stall.changeState();
            }
        });

        if (dog.isGetBone()) {
            if (dog.scoreTimer >= DOG_DELAY_SIT) {
                dog.run();
            }
            dog.scoreTimer++;
        }

        if (dog.isBark()) {
            if (dog.barkTimer >= 2) {
                dog.run();
            }
            dog.barkTimer++;
        }


        if (dog.timer >= DOG_DELAY_SIT) {
            dog.sit();
        }
        dog.incTimer();


    }, 1000);

    /**
     *Таймер для прорисовки объектов
     */



    var running = true;

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
            /*dog.makeDirectionToPoint();*/

            cows.forEach((cow) => {
                //cow.doStaff();

                walls.forEach((wall) => {
                    if (cow.isCollideWith(wall)) {
                        console.log("Collide!!!");
                    }
                });

                cows.forEach((item) => {
                    if (cow !== item) {
                        if (cow.circleInSquare(item)) {
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
                        cow.addPointToRoute(new Point(currentStall.location.x + 60, currentStall.location.y + 60));
                    } else {
                        cow.addPointToRoute(new Point(currentStall.location.x + 60, currentStall.location.y - 60 + currentStall.height));
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

            /* walls.forEach((item) => {
                 if (dog.isCollideWithWalls(item)) {
                     //alert(true)
                 }
             });*/

            gates.forEach((item) => {
                if (dog.circleInSquare(item)) {
                }
            });

            walls.forEach((item) => {
                if (dog.circleInSquare(item)) {
                    //alert('collide')
                    //console.log('collide');
                }
            });

            dog.move();


            requestAnimationFrame(loop);
        }
    }

    requestAnimationFrame(loop);


    //---------------------------------------

    function handlerMove(event) {
        dog.route = []
        dog.addPointToRoute(new Point(event.clientX, event.clientY));


        dog.moving = true;
        dog.moveOnRoute();
        let dogBarks = false;

        cows.forEach((cow) => {

            if (cow.distanceTo(dog) <= DISTANTION_TO_DOG) {
                dogBarks = true;
                cow.runFrom(dog);
                //displayVector(cow);
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
};

function displayVector(cow) {
    contX.innerText = cow.vector.getX;
    contY.innerText = cow.vector.getY;
    let vLength = document.getElementById('vector-length');
    vLength.innerText = Math.sqrt(cow.vector.getY * cow.vector.getY + cow.vector.getX * cow.vector.getX);
    let vectorLog = document.getElementById('lineAB');
    vectorLog.setAttribute('d', "M 200 200 l " + cow.vector.getX * 20 + " " + cow.vector.getY * 20);
}

content.onclick = () => {
    //console.log(cows)
    cows.forEach((cow) => {
        if (cow.distanceTo(dog) <= DISTANTION_TO_DOG) {
            cow.scat();
            cow.runFrom(dog);
            dog.bark();
            //displayVector(cow);
            console.log(cow)
        }
    })
};


/*
function moveCircle(e) {
    TweenLite.to(dog.element, 0.3, {
        css: {
            left: e.pageX,
            top: e.pageY
        }
    });
}

$(window).on('mousemove', moveCircle);
*/
