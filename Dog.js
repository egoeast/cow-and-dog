import {DOG_BARK, DOG_RUN, DOG_SIT, STATES} from "./constants";
import {MovableObject} from "./MovableObject";
import {Vector} from "./Helpers";

export class Dog extends MovableObject{
    constructor(element, id, point, width, height) {
        super(element, id, point, width, height)
        console.log(this);
        this.element = element;
        this.setState(DOG_SIT);
        this.timer = 0;
    }

    draw() {
        super.draw();
        //this.element.id = this.id;
        let img = document.createElement('img');
        this.element.appendChild(img);
        this.run();
        this.element.style.position = 'absolute';
        this.element.style.padding = 0 + 'px';
        this.element.style.zIndex = 1000;
    }

    setState(state) {
        if (this.state !== state) {
            this.state = state;
            this.element.className = state;
        }
        this.setImage('i/dog_step-5-run.svg')
    }

    setImage(path) {
        this.element.children[0].setAttribute('src', path);
    }

    incTimer() {
        this.timer++;
    }

    clearTimer()
    {
        this.timer = 0;
    }

    sit() {
        this.setState(DOG_SIT);
    }

    bark() {
        this.setState(DOG_BARK);
    }

    run() {

        this.setState(DOG_RUN);
    }

    makeDirectionToPoint(x, y) {
        let v = new Vector(x - this.center.x, y - this.center.y);
        v.normalize();
        v.multiplicate(this.speed);
        this.vector = v;
        return false;
    }

}
