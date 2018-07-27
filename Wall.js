import {BaseObject} from "./BaseObject";

export class Wall extends BaseObject {
    constructor(element, id, point, width, height, canvas) {
        super(element, id, point, width, height, canvas);

    }

    draw() {
        super.draw();
        this.element.style.background = 'black';
    }
}
