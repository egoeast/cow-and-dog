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

    constructor(container, id, point, width, height) {
      /*  this.element = document.getElementById(element);
        let params = this.element.getBoundingClientRect();*/
        this.width = width;
        this.height = height;
        this.location = point;

        let center = new Point(point.getX + width /2, point.getY + height /2)
        this.center = center;

        this.element = document.createElement('div');
        container.appendChild(this.element);
        this.element.className = 'obj';
        this.setPorition();
        /*this.element.style.width='200px';

        this.element.style.height='100px';

        this.element.style.background='gray';*/


    }
    setPorition() {
        this.element.style.top = this.location.getY + 'px';
        this.element.style.left = this.location.getX+ 'px';
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
    }

        move(vector) {
        this.location.setCoord = [this.getX + vector.getX, this.getY + vector.getY];
        this.center.setCoord = [this.getX+ this.width / 2, this.getY+ this.height / 2];
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

    isCollideWith(object) {
        if (this.calculateDistanceToPoint(object.getX, object.getY) < this.width ) {
            return true;
        }
    }
}


const COW_EATING = 'eat';
const COW_RUNNING = 'run';

class Cow extends MovableObject {

    constructor(element, id, point, width, height) {
        super(element, id, point, width, height);
        //this.boundingShpere = this.width / 2 + boundingSphere;
        //this.state = COW_EATING;

        let div = document.createElement('div');
        this.element.appendChild(div);
        this.element.id = id;
        let img = document.createElement('img');
        this.element.children[0].appendChild(img);
        this.setState(COW_EATING);
        this.element.style.padding = 50 +'px';
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

    calculateDistanceToPoint(x, y) {
        return Math.sqrt(Math.pow(this.center.x - x, 2) + Math.pow(this.center.y - y, 2));
    }

    calculateVectorToPoint(x, y) {
        return new Vector(this.center.x - x, this.center.y - y);
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

    var content = document.getElementById('content');
    var point = new Point(300, 300)
    var cow = new Cow(content,'cow', point, 200, 200);
    console.log(cow);
    cow.setPorition();
    var point = new Point(500, 500)
    var cow2 = new Cow(content,'cow1', point, 200, 200);

    var cows = [cow, cow2];

     var content = document.getElementById('content');
     var contX = document.getElementById('cont-x');
     var contY = document.getElementById('cont-y');
 //const cow = document.getElementById('cow');
     //var myType = document.getElementsByClassName('event-type');
     var shprere = document.getElementById('cow');
    var shprere2 = document.getElementById('cow1');
    //var cow = new Cow('cow-cicle', 80);
    //var rock = new BaseObject('rock');
     shprere.onmouseover = handlerOver;
     shprere.onmouseout = handlerOut;
     shprere.onmousemove = handlerMove;

    shprere2.onmouseover = handlerOver;
    shprere2.onmouseout = handlerOut;
    shprere2.onmousemove = handlerMove;


    var moving = false;




     var vector =new Vector();

     function handlerOut(event) {

         cows.forEach(function (item ,index){
             if ((event.fromElement === item.element) || (event.fromElement === item.element.children[0]) || (event.fromElement === item.element.children[0].children[0])){
                item.moving = false;
                item.setState(COW_EATING);
             }
         });
     }

     function handlerMove(event) {
         var currentCow;
         cows.forEach(function (item ,index){
             if ((event.fromElement === item.element) || (event.fromElement === item.element.children[0]) || (event.fromElement === item.element.children[0].children[0])){
                 currentCow = item;

                 vector = currentCow.calculateVectorToPoint(event.clientX, event.clientY);
                 contX.innerText = vector.getX;
                 contY.innerText = vector.getY;
                 let vLength = document.getElementById('vector-length');
                 vLength.innerText = Math.sqrt(vector.getY*vector.getY+ vector.getX*vector.getX);
                 let vectorLog = document.getElementById('lineAB');
                 vectorLog.setAttribute('d', "M 200 200 l " + vector.getX + " " + vector.getY);
             }
         });



     }

     function handlerOver(event) {
         var currentCow;
         cows.forEach(function (item ,index){
             if ((event.fromElement === item.element) || (event.fromElement === item.element.children[0]) || (event.fromElement === item.element.children[0].children[0])){
                 currentCow = item;


                 vector = currentCow.calculateVectorToPoint(event.clientX, event.clientY);
                 currentCow.setState(COW_RUNNING);
                 currentCow.moving = true;

                 var fps = 20; // 50 кадров в секунду
                 var timer = setInterval(function () {
                     if (!currentCow.moving) {
                         clearInterval(timer);
                     } else {

                         let v = vector;
                         let speed = 5;
                         /*if (cow.isCollideWith(rock)) {
                            speed = 0;
                         }*/
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


         return false;
     }
}