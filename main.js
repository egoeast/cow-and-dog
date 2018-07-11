"use strict";

import {Point, getRandomInt} from "./Helpers";
import {Wall} from "./Wall";
import {Stall} from "./Stall";
import {Gates} from "./Gates";
import {Cow} from "./Cow";
import {Dog} from "./Dog";

const FPS = 25;
const DISTANTION_TO_DOG = 200;

let content = document.getElementById('content');

let dog = new Dog(content);

var scrollHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
);


content.style.height = scrollHeight - 50 +'px';
content.style.width = document.body.clientWidth+'px';

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

let height = contentY-220;
let width = contentX-600;
let wall = new Wall(content, 'wall', new Point(contentX /2 - width /2, contentY /2 - height /2 ), width, height);
var wallHeight = (contentY - 240) / 3;
let gateHeight = 120;
let wall8 = new Wall(content, 'wall-8', new Point(contentX - 120, 0), 5, wallHeight);
let wall9 = new Wall(content, 'wall-9', new Point(contentX - 120, wallHeight + gateHeight), 5, wallHeight);
let wall10 = new Wall(content, 'wall-10', new Point(contentX - 120, wallHeight * 2 + gateHeight * 2), 5, wallHeight);
let gate = new Gates(content, 'gate', new Point(contentX - 115, wallHeight - gateHeight), 10, gateHeight);
let gate2 = new Gates(content, 'gate-2', new Point(contentX - 115, wallHeight * 2), 10, gateHeight);

let wall2 = new Wall(content, 'wall-2', new Point(120, 0), 5, wallHeight);
let wall3 = new Wall(content, 'wall-3', new Point(120, wallHeight + gateHeight), 5, wallHeight);
let wall4 = new Wall(content, 'wall-4', new Point(120, wallHeight * 2 + gateHeight * 2), 5, wallHeight);
let gate3 = new Gates(content, 'gate-3', new Point(115, wallHeight - gateHeight), 10, gateHeight);
let gate4 = new Gates(content, 'gate-4', new Point(115, wallHeight * 2), 10, gateHeight);

gate.openTimer = 12;
gate3.openTimer = 7;

let stall = new Stall(content, 'stall', new Point(0, 0), 120, contentY);
let stall2 = new Stall(content, 'stall-2', new Point(contentX - 115, 0), 120, contentY);

let gates = [gate, gate2, gate3, gate4];
let walls = [
    wall,
    wall2,wall3, wall4,
    //wall, wall2, wall3, wall4, wall5, wall6, wall7,
    wall8, wall9, wall10];
let stalls = [
    stall,
    stall2];
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
    for (let i = 0; i < 10; i++) {
        let cow = generateCow('cow-' + i);
        cows.push(cow);
    }
/*
    let cow = new Cow(content, 'cow', new Point(300, 300), 100, 100);
    cows.push(cow);
*/


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
        });

        gates.forEach((gate) => {
            gate.openTimer++;
            if (gate.openTimer > gate.maxTimer) {
                gate.prepare();
            }
        });

        if (dog.timer > 3) {
            dog.sit();
        }
        dog.incTimer();

    }, 1000 );

    /**
     *Таймер для прорисовки объектов
     */

    setInterval(() => {

        cows.forEach((cow) => {
            //cow.doStaff();

            walls.forEach((wall) => {
                if (cow.isCollideWith(wall)) {
                    console.log("Collide!!!");
                }
            });

            cows.forEach((item) => {
                if (cow !== item) {
                    if (cow.isCollideWith(item)) {
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
            stalls.forEach((stall) => {
                if (cow.inObject(stall) ) {
                    inStall = true;
                }
            });

            if (inStall && cow.isAvailable) {
                cow.sleep();

                cow.available = false;
                score++;
                document.getElementById('score').innerText = 'Total: ' + score;
            }
            cow.doStaff();

        });

        gates.forEach((gate) => {
            gate.doThing();
        })


    }, 1000 / FPS);

    //---------------------------------------

    function handlerMove(event) {

        let dogBarks = false;

        cows.forEach((cow) => {

            if (cow.calculateDistanceToPoint(event.clientX, event.clientY) <= DISTANTION_TO_DOG) {
                dogBarks = true;
                cow.makeDirectionFromPoint(event.clientX, event.clientY);
                    cow.run();
                    //displayVector(cow);
            } else {
                    cow.setCurrentState();
            }

        });

        if (dogBarks) {
            dog.bark();
            dog.clearTimer();
        } else {
            dog.run();
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

content.onclick = () => {console.log(cows)};