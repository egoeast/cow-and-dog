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
        let ln = Math.sqrt(this.x* this.x+ this.y*this.y);
        this.x = (this.x/ln)*l;
        this.y = (this.y/ln)*l;
        return true;
    }
}


class BaseObject {

    constructor(element) {
        this.element = document.getElementById(element);
        let params = this.element.getBoundingClientRect();
        this.width = params.width;
        this.height = params.height;
        this.location = new Point(params.x, params.y)
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
    calculateDistanceToPoint(x, y) {
        return Math.sqrt(Math.pow(this.getX - x, 2) + Math.pow(this.getY - y, 2));
    }

    calculateVectorToPoint(x, y) {
        return new Vector(this.getX - x, this.getY - y);
    }
}

class MovableObject extends BaseObject {

    move(vector) {
        this.location.setCoord = [this.getX + vector.getX, this.getY + vector.getY];
        if (this.getX < 0) this.location.x = 0;
        if (this.getY < 0) this.location.y = 0;
        this.element.style.top = (this.getY ) + 'px';
        this.element.style.left = (this.getX ) + 'px';
    }

    moveTo(x, y) {
        this.location.setCoord = [x, y];
        this.element.style.top = (this.getY) + 'px';
        this.element.style.left = (this.getX) + 'px';
    }
}


const COW_EATING = 'eat';
const COW_RUNNING = 'run';

class Cow extends MovableObject {

    constructor(element, boundingSphere) {
        super(element);
        this.boundingShpere = this.width / 2 + boundingSphere;
        this.state = COW_EATING;
    }

    get getSphere() {
        return this.boundingShpere;
    }

    setState(state) {
        this.state = state;
        switch (this.state) {
            case COW_EATING : {
                this.element.children[0].children[0].setAttribute('src', 'i/mm_cow_eat.gif')
                break;
            }
            case COW_RUNNING : {
                this.element.children[0].children[0].setAttribute('src', 'i/mm_cow_run.gif');
                break;
            }
            default : {
                break;
            }
        }
    }

    /*
        run(x, y, vector) {
            let flag = false;
            let obj = this;
            var fps = 50; // 50 кадров в секунду
            var timer = setInterval(function () {
                if (flag) {
                    clearInterval(timer);
                } else {
                    let randX = Math.floor(Math.random() * 20) - 10
                    let randY = Math.floor(Math.random() * 20) - 10
                    //cow.move((vector.getX + randX) / 5, (vector.getY + randY) / 5);
                    let v = new Vector(vector.getX - this.width, vector.getY - this.width,)
                    this.move(vector.prepareDirection());
                    flag = true;
                    /!*if (cow.calculateDistanceToPoint(x, y) > cow.getSphere) {
                        flag = true;
                    }*!/
                }
            }, 1000 / fps)
        }
    */

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

    var cow = new Cow('cow-cicle', 80);
    console.log(cow);
    cow.drawShpere();

    //cow.moveTo(50,50);


    var content = document.getElementById('content');
    var contX = document.getElementById('cont-x');
    var contY = document.getElementById('cont-y');
//const cow = document.getElementById('cow');
    //var myType = document.getElementsByClassName('event-type');
    var shprere = document.getElementById('cow-cicle');
    shprere.onmouseover = handler;
    shprere.onmousemove = handlerMove;
    //cow.element.onmouseover = cow.element.onmouseout = cow.element.onmousemove = cowHandler;
    shprere.onmouseout = shprereHandler;

    var vector =new Vector();
    /* function cowHandler(event) {

         contX.innerText = event.clientX;
         var type = event.type;
         while (type < 11) type += ' ';

         return false;
     }*/

    function handlerMove(event) {
        vector = cow.calculateVectorToPoint(event.clientX, event.clientY);
    }


    function shprereHandler(event) {
        cow.setState(COW_EATING);
    }

    function handler(event) {
        vector = cow.calculateVectorToPoint(event.clientX, event.clientY);
        //if (cow.calculateDistanceToPoint(event.clientX, event.clientY) <= cow.getSphere) {
            cow.setState(COW_RUNNING);


                let v = vector;
                v.prepareDirection(50);
                if (cow.state != COW_RUNNING)
                    cow.setState(COW_RUNNING);
                $( "#cow-cicle" ).animate({
                    left: "+=" + v.getX,
                    top: "+=" + v.getY
                }, 300, function() {
                    // Animation complete.
                   // cow.setState(COW_EATING);
                });
         /*       let flag = false;
            var fps = 50; // 50 кадров в секунду
            var timer = setInterval(function () {
                if (flag) {
                    clearInterval(timer);
                } else {
                    //let randX = Math.floor(Math.random() * 20) - 10
                    //let randY = Math.floor(Math.random() * 20) - 10
                    //cow.move((vector.getX + randX) / 5, (vector.getY + randY) / 5);
                    //let v = new Vector(vector.getX - cow.width, vector.getY - cow.width,)
                    let v = vector;
                    v.prepareDirection();
                    console.log(v);
                    cow.move(v);
                    //cow.drawShpere();
                    //flag = true;
                     if (cow.calculateDistanceToPoint(event.clientX, event.clientY) > cow.getSphere) {
                          flag = true;

                     }
                }
            }, 1000 / fps)
*/
        //}

        contX.innerText = vector.getX;
        contY.innerText = vector.getY;
        let vLength = document.getElementById('vector-length');
        vLength.innerText = Math.sqrt(vector.getY*vector.getY+ vector.getX*vector.getX);
        let vectorLog = document.getElementById('lineAB');
        vectorLog.setAttribute('d', "M 200 200 l " + vector.getX + " " + vector.getY);

        return false;
    }
}