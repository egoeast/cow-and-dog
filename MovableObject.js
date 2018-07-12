import {BaseObject} from "./BaseObject";
import {Vector} from "./Helpers";

export const STAND = 'stand';
export const ARRIVED = 'arrived';
export const ON_ROUTE = 'on route';

export class MovableObject extends BaseObject {

    constructor(element, id, point, width, height) {
        super(element, id, point, width, height);
        this.moving = false;
        this.speed = 9;
        this.vector = new Vector(0, 0)
        this.route = [];
        this.movingStatus = STAND;
    }

    moveToPoint() {
        if (this.moving) {
            this.makeVectorToDestination();
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

    move() {
        if (this.moving) {

            if (this.route.length !== 0) {
                //let v  = new Vector()
            }
            let vector = this.vector;
            this.location.setCoord = [this.getX + vector.getX, this.getY + vector.getY];
            this.center.setCoord = [this.getX + this.width / 2, this.getY + this.height / 2];

            if (this.getX < 0) this.location.x = 0;
            if (this.getY < 0) this.location.y = 0;
            if (this.getX > this.container.clientWidth - this.width) this.location.x = this.container.clientWidth - this.width;
            if (this.getY > this.container.clientHeight - this.height) this.location.y = this.container.clientHeight - this.height;

            this.element.style.top = (this.getY) + 'px';
            this.element.style.left = (this.getX) + 'px';
        }
    }

    makeDirectionToPoint(x, y) {
        let v = new Vector(x - this.center.x, y - this.center.y);
        let tempV = Object.assign(new Vector(0, 0), v);
        v.normalize();
        v.multiplicate(this.speed);

        if (tempV.vectorLength() < v.vectorLength()) {
            this.vector = tempV;
        } else {
            this.vector = v;
        }
        return false;
    }

    addPointToRoute(point) {
        this.route.push(point)
    }

    makeVectorToDestination() {
        if (this.route.length !==0){
        let v = new Vector(this.route[0].x - this.center.x, this.route[0].y - this.center.y);
        let tempV = Object.assign(new Vector(0, 0), v);
        v.normalize();
        v.multiplicate(this.speed);

        if (tempV.vectorLength() <= v.vectorLength()) {
            this.vector = tempV;
            this.moving = false;
            this.route.shift();
            if (this.route.length === 0) {
                this.movingStatus = ARRIVED;
            }
        } else {
            this.vector = v;
        }
        }
        return false;
    }

    moveTo(x, y) {
        this.location.setCoord = [x, y];
        this.element.style.top = (this.getY) + 'px';
        this.element.style.left = (this.getX) + 'px';
        this.setPosition();
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

    addVector(vector) {
        this.vector.addVector(vector);
    }

    moveOnRoute() {
        this.movingStatus = ON_ROUTE;
    }

    isOnRoute() {
        return this.movingStatus === ON_ROUTE;
    }

    isArrived() {
        return this.movingStatus === ARRIVED;
    }

    stand() {
        this.movingStatus = STAND;
    }

}