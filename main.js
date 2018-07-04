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
        //let tmp = new Vector();
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
        /*  this.element = document.getElementById(element);
          let params = this.element.getBoundingClientRect();*/
        this.width = width;
        this.height = height;
        this.location = point;

        let center = new Point(point.getX + width / 2, point.getY + height / 2)
        this.center = center;

        this.element = document.createElement('div');
        container.appendChild(this.element);
        this.element.className = 'obj';
        this.element.id = id;
        this.setPorition();
    }

    setPorition() {
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

    /*  calculatePositionIn(event) {
          let x = event.clientX - this.x;
          let y = event.clientY - this.y;
          return [x, y];
      }
  */

}


class MovableObject extends BaseObject {

    constructor(element, id, point, width, height) {
        super(element, id, point, width, height);
        this.moving = false;
        this.speed = 6;
        this.vector = new Vector(0, 0)
    }

    move() {
        let vector = this.vector;
        this.location.setCoord = [this.getX + vector.getX, this.getY + vector.getY];
        this.center.setCoord = [this.getX + this.width / 2, this.getY + this.height / 2];
        if (this.getX < 0) this.location.x = 0;
        if (this.getY < 0) this.location.y = 0;
        this.element.style.top = (this.getY) + 'px';
        this.element.style.left = (this.getX) + 'px';
    }

    moveTo(x, y) {
        this.location.setCoord = [x, y];
        this.element.style.top = (this.getY) + 'px';
        this.element.style.left = (this.getX) + 'px';
    }

    isCollideWith(object) {
        /*if (this.calculateDistanceToPoint(object.getX, object.getY) < this.width) {
            return true;
        }*/
        //console.log((this.calculateDistanceToPoint(object.getX, this.center.y) ) );

        //console.log(this.calculateDistanceToPoint(this.center.x, object.center.y));
        let collideX = (this.calculateDistanceToPoint(object.center.x, this.center.y)) < (this.width/2 + object.width/2);
        let collideY = (this.calculateDistanceToPoint(this.center.x, object.center.y)) < (this.height/2 + object.height/2) ;

       // console.log(this.calculateDistanceToPoint(object.getX, this.center.y + this.vector.y));
        if (collideX && collideY) {
            //this.vector.x = (this.width/2 + object.width/2) - this.calculateDistanceToPoint(object.center.x, this.center.y);
            //this.vector.y = (this.height/2 + object.height/2) - (this.calculateDistanceToPoint(this.center.x, object.center.y)) ;
            if (Math.abs(this.vector.x) >= Math.abs(this.vector.y)) {
                this.vector.x = -(this.width/2 + object.width/2) + this.calculateDistanceToPoint(object.center.x, this.center.y);

            } else {
                this.vector.y = - (this.height/2 + object.height/2) + (this.calculateDistanceToPoint(this.center.x, object.center.y)) ;
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
        //this.boundingShpere = this.width / 2 + boundingSphere;
        //this.state = COW_EAT;

        let div = document.createElement('div');
        this.element.appendChild(div);
        this.element.id = id;
        let img = document.createElement('img');
        this.element.children[0].appendChild(img);
        this.setState(COW_EAT);
        this.element.style.padding = 0 + 'px';
    }

    get getSphere() {
        return this.boundingShpere;
    }

    setState(state) {
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

    drawShpere() {
        /*var cicle = document.getElementById('cow-cicle');
        cicle.setAttribute('cx', this.getX - 10);
        cicle.setAttribute('cy', this.getY - 10);
        cicle.setAttribute('r', this.getSphere);*/
    }

    animate() {

    }
}


window.onload = () => {
    var currentState = 0;
    function Timer () {
        var s = new Date().getTime();
        s = parseInt(s / 1000);

        var h = parseInt(s / 3600);
        s -= h * 3600;
        var m = parseInt(s / 60);
        s -= m * 60;
        //console.log(m + ':' + s);


        if (s%5 == 0) {
            currentState++;
            if (currentState >= 5) {
                currentState = 0;
            }
            cows.forEach(function (item, index) {
                item.setState(states[currentState]);
            })
        }

    }


    var fps = 1; // 50 кадров в секунду
    var timer = setInterval(function () {
        Timer();
    }, 1000 / fps);

    var content = document.getElementById('content');
    var point = new Point(300, 300)
    var cow = new Cow(content, 'cow', point, 100, 100);
    console.log(cow);
    cow.setPorition();
    var point = new Point(700, 300)
    //var cow2 = new Cow(content, 'cow1', point, 100, 100);
    var cows = [cow];

    var point = new Point(900, 300);
    var wall = new BaseObject(content, 'wall', point, 10, 200);

    var content = document.getElementById('content');
    var contX = document.getElementById('cont-x');
    var contY = document.getElementById('cont-y');
    //const cow = document.getElementById('cow');
    //var myType = document.getElementsByClassName('event-type');
    var shprere = document.getElementById('cow');
    var shprere2 = document.getElementById('cow1');
    //var cow = new Cow('cow-cicle', 80);
    //var rock = new BaseObject('rock');
    content.onmouseover = handlerOver;
    content.onmouseout = handlerOut;
    content.onmousemove = handlerMove;

    /*shprere2.onmouseover = handlerOver;
    shprere2.onmouseout = handlerOut;
    shprere2.onmousemove = handlerMove;
    */

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
            }

            if (item.calculateDistanceToPoint(event.clientX, event.clientY) <= 200 && !item.moving) {

                item.makeDirectionFromPoint(event.clientX, event.clientY);
                //console.log(vector);
                if (item.state !== COW_RUN)
                    item.setState(COW_RUN);

                item.moving = true;
                cows.forEach(function (item, index) {
                    if (currentCow !== item) {
                        if (currentCow.isCollideWith(item)) {
                            let v = currentCow.calculateVectorFromPoint(item.getX, item.getY);
                            currentCow.vector.addVector(v);
                        }
                    }
                })

                var fps = 50; // 50 кадров в секунду
                var timer = setInterval(function () {
                    if (item.calculateDistanceToPoint(event.clientX, event.clientY) >= 200) {
                        item.setState(COW_MOOS);
                    }


                    if (!item.moving) {
                        clearInterval(timer);
                    } else {
                        if (item.isCollideWith(wall)){
                            console.log("Collide!!!");
                            //item.setState(COW_SCAT);
                            //item.vector.y = 0;
                        }

                        //item.vector.prepareDirection(item.speed);
                        item.move();


                    }
                }, 1000 / fps);
            } else {
                //item.moving = false;
                //item.setState(COW_MOOS);
            }


            contX.innerText = item.vector.getX;
            contY.innerText = item.vector.getY;
            let vLength = document.getElementById('vector-length');
            vLength.innerText = Math.sqrt(item.vector.getY * item.vector.getY + item.vector.getX * item.vector.getX);
            let vectorLog = document.getElementById('lineAB');
            vectorLog.setAttribute('d', "M 200 200 l " + item.vector.getX *20 + " " + item.vector.getY*20);
        });
        /*
                 cows.forEach(function (item ,index){
                     if ((event.fromElement === item.element) || (event.fromElement === item.element.children[0]) || (event.fromElement === item.element.children[0].children[0])){
                         currentCow = item;


                         vector = currentCow.makeDirectionFromPoint(event.clientX, event.clientY);
                         currentCow.setState(COW_RUN);
                         currentCow.moving = true;

                         var fps = 20; // 50 кадров в секунду
                         var timer = setInterval(function () {
                             if (!currentCow.moving) {
                                 clearInterval(timer);
                             } else {

                                 let v = vector;
                                 let speed = 5;
                                 /!*if (cow.isCollideWith(rock)) {
                                 speed = 0;
                             }
                             v.prepareDirection(speed);
                             currentCow.move(v);

                         }
                     }, 1000 / fps);


                 contX.innerText = vector.getX;
                 contY.innerText = vector.getY;
                 let vLength = document.getElementById('vector-length');
                 vLength.innerText = Math.sqrt(vector.getY*vector.getY+ vector.getX*vector.getX);
                 let vectorLog = document.getElementById('lineAB');
                 vectorLog.setAttribute('d', "M 200 200 l " + vector.getX + " " + vector.getY);

             }
        });
        */


        /*
        var currentCow;
                 cows.forEach(function (item ,index){
                     if ((event.fromElement === item.element) || (event.fromElement === item.element.children[0]) || (event.fromElement === item.element.children[0].children[0])){
                         currentCow = item;

                         vector = currentCow.makeDirectionFromPoint(event.clientX, event.clientY);
                         contX.innerText = vector.getX;
                         contY.innerText = vector.getY;
                         let vLength = document.getElementById('vector-length');
                         vLength.innerText = Math.sqrt(vector.getY*vector.getY+ vector.getX*vector.getX);
                         let vectorLog = document.getElementById('lineAB');
                         vectorLog.setAttribute('d', "M 200 200 l " + vector.getX + " " + vector.getY);
                     }
                 });




        */

    }

    function handlerOver(event) {
        /*var currentCow;
        cows.forEach(function (item ,index){
            if ((event.fromElement === item.element) || (event.fromElement === item.element.children[0]) || (event.fromElement === item.element.children[0].children[0])){
                currentCow = item;


                vector = currentCow.makeDirectionFromPoint(event.clientX, event.clientY);
                currentCow.setState(COW_RUN);
                currentCow.moving = true;

                var fps = 20; // 50 кадров в секунду
                var timer = setInterval(function () {
                    if (!currentCow.moving) {
                        clearInterval(timer);
                    } else {

                        let v = vector;
                        let speed = 5;
                        /!*if (cow.isCollideWith(rock)) {
                           speed = 0;
                        }*!/
                        v.prepareDirection(speed);
                        currentCow.move(v);

                    }
                }, 1000 / fps)


                contX.innerText = vector.getX;
                contY.innerText = vector.getY;
                let vLength = document.getElementById('vector-length');
                vLength.innerText = Math.sqrt(vector.getY*vector.getY+ vector.getX*vector.getX);
                let vectorLog = document.getElementById('lineAB');
                vectorLog.setAttribute('d', "M 200 200 l " + vector.getX + " " + vector.getY);

            }
        });

*/
        return false;
    }
}