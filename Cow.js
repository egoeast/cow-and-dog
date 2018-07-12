import {ARRIVED, MovableObject, ON_ROUTE} from "./MovableObject";
import {getRandomInt, Point, Vector} from "./Helpers";
import {
    STATES,
    COW_MOOS,
    COW_SCAT,
    COW_SKIP,
    COW_RUN,
    COW_SLEEP,
    COW_EAT,
    DIRECTION_RIGHT,
    DIRECTION_LEFT,
    EAT_TIME,
    SLEEP_TIME,
    STATE_TIME,
} from "./constants";


export class Cow extends MovableObject {

    constructor(element, id, point, width, height) {
        super(element, id, point, width, height);
        this.sleepTimer = 0;
        this.eatTimer = 0;
        this.currentState = getRandomInt(0, STATES.length);
        this.respawnPoint = Object.assign(new Point(0, 0), this.center);
        this.imageDirection = DIRECTION_RIGHT;
        this.speed = 4;
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

    setState(state) {

        if (this.state !== state) {
            this.state = state;
            switch (this.state) {
                case COW_EAT : {
                    this.setImage('i/mm_cow_eat.gif');
                    this.moving = false;
                    this.isAvailable = false;
                    this.sleepTimer = 0;
                    this.currentState = 2;
                    break;
                }
                case COW_RUN : {
                    this.setImage('i/mm_cow_run.gif');
                    this.moving = true;
                    this.isAvailable = true;
                    this.sleepTimer = 0;
                    this.eatTimer = 0;
                    break;
                }
                case COW_MOOS : {
                    this.setImage('i/mm_cow_moos.gif');
                    this.moving = false;
                    this.isAvailable = true;
                    this.eatTimer = 0;
                    this.sleepTimer = 0;
                    break;
                }
                case COW_SLEEP : {
                    this.setImage('i/mm_cow_sleep.gif');
                    this.moving = false;
                    this.isAvailable = false;
                    this.eatTimer = 0;
                    break;
                }
                case COW_SCAT : {
                    this.setImage('i/mm_cow_scat.gif');
                    this.moving = false;
                    this.isAvailable = true;
                    this.eatTimer = 0;
                    this.sleepTimer = 0;
                    break;
                }
                case COW_SKIP : {
                    this.setImage('i/mm_cow_skipping.gif');
                    this.moving = false;
                    this.isAvailable = true;
                    this.eatTimer = 0;
                    this.sleepTimer = 0;
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

    setCurrentState() {
        if (!this.isSleeping()){
            this.setState(STATES[this.currentState]);
        }
    }


    setImage(path) {
        this.element.children[0].setAttribute('src', path);
    }

    calculateDistanceToPoint(x, y) {
        return Math.sqrt(Math.pow(this.center.x - x, 2) + Math.pow(this.center.y - y, 2));
    }

    makeDirectionFromPoint(x, y) {
        if (this.moving) {
            let v = new Vector(this.center.x - x, this.center.y - y);
            v.normalize();
            v.multiplicate(this.speed);

            let angle = 0.5 * getRandomInt(-1, 1);
            this.vector.x = v.x * Math.cos(angle) - v.y * Math.sin(angle);
            this.vector.y = v.y * Math.cos(angle) + v.x * Math.sin(angle);

            //this.vector  = v;
            this.checkDirection();
        }
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

    inObject(object) {
        return ((this.location.x > object.location.x) &&
            (this.location.x + this.width < object.location.x + object.width) &&
            (this.location.y > object.location.y) &&
            (this.location.y + this.height < object.location.y + object.height)
        );

    }

    isSleeping() {
        return this.state === COW_SLEEP;
    }

    isEating() {
        return this.state === COW_EAT;
    }

    eat() {
        this.setState(COW_EAT);
    }

    sleep() {
        this.setState(COW_SLEEP);
    }

    run() {
        if (this.isAvailable) {
            this.setState(COW_RUN);
        }
    }

    scat() {
        if (!this.isSleeping()) {
            this.setState(COW_SCAT);
        }
    }

    moos() {
        if (this.isAvailable) {
            this.setState(COW_MOOS);
        }
    };

    manageStates(seconds) {
        if (!this.moving) {
            this.setCurrentState();
        }

        if (this.isSleeping()) {
            this.sleepTimer++;
        }

        if (this.isEating()) {
            this.eatTimer++;
        }

      /*  if (this.sleepTimer > SLEEP_TIME) {
            this.sleepTimer = 0;
            //this.respawn();
            //this.eat();
            this.setState(COW_RUN);
            this.moveOnRoute();
        }*/

        if (this.eatTimer > EAT_TIME) {
            this.scat();
        }

        if (seconds % STATE_TIME === 0 && this.isAvailable && !this.moving) {
            this.nextRandomState();
        }
    }

    doStaff() {
        if (this.movingStatus === ON_ROUTE) {
            this.moving = true;
           this.makeVectorToDestination();
        }
        this.move();

    }
}