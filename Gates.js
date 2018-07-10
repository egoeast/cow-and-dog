import {MovableObject} from "./MovableObject";
import {Point} from "./Helpers";

export class Gates extends MovableObject {

    constructor(element, id, point, width, height) {
        super(element, id, point, width, height);
        this.isOpened = true;
        this.openTimer = 0;
        this.maxTimer = 10;
        this.destinationPoint = null;
    }


    draw() {
        super.draw();
        this.element.style.background = 'black';
    }

    prepare() {
        this.openTimer = 0;
        if (this.isOpened) {
            this.route.push( new Point(this.center.x, this.center.y + this.height) );
            this.isOpened = false;
        } else {
            this.route.push( new Point(this.center.x, this.center.y - this.height) );
            this.isOpened = true;
        }
        this.moving = true;

    }

    doThing() {
        this.moveToPoint();
    }
}
