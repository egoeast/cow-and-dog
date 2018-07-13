import {DIRECTION_LEFT, DIRECTION_RIGHT, DOG_BARK, DOG_GET_BONE, DOG_RUN, DOG_SIT, STATES} from "./constants";
import {MovableObject} from "./MovableObject";
import {Vector} from "./Helpers";

export class Dog extends MovableObject{
    constructor(element, id, point, width, height) {
        super(element, id, point, width, height);
        console.log(this);
        this.element = element;
        this.setState(DOG_SIT);
        this.timer = 0;
        this.speed = 10;
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
            switch (this.state) {
                case DOG_BARK : {
                    this.setImage('i/mm_dog_barks.gif');
                    break;
                }
                case DOG_RUN : {
                    this.setImage('i/mm_dog_run.gif');
                    break;
                }
                case DOG_SIT : {
                    this.setImage('i/mm_dog_sit.gif');
                    break;
                }
                case DOG_GET_BONE : {
                    this.setImage('i/mm_dog_bone.gif');
                    break;
                }

            }
        }

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

    getBone() {
        this.setState(DOG_GET_BONE);
    }

    isGetBone() {
        return this.state === DOG_GET_BONE;
    }

    makeDirectionToPoint(x, y) {
        let v = new Vector(x - this.center.x, y - this.center.y);
        v.normalize();
        v.multiplicate(this.speed);
        this.vector = v;
        return false;
    }
    move() {
        this.checkDirection();
        super.move()
    }

    checkDirection() {

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
