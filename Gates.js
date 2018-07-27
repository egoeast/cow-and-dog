import {MovableObject} from "./MovableObject";
import {Point} from "./Helpers";

export class Gates extends MovableObject {

    constructor(element, id, point, width, height, canvas) {
        super(element, id, point, width, height, canvas);
        this.isOpened = false;
        this.openTimer = 0;
        this.maxTimer = 10;
        this.destinationPoint = null;
    }


    draw() {
        super.draw();
        this.element.style.background = 'black';
    }

    changeState() {
        this.openTimer = 0;
        if (this.isOpened) {
            this.route.push( new Point(this.center.x, this.center.y + this.height) );
        } else {
            this.route.push( new Point(this.center.x, this.center.y - this.height) );
        }
        this.isOpened = !this.isOpened;
        this.moving = true;

    }

    doThing() {
        this.moveToPoint();
    }
}
