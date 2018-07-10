import {BaseObject} from "./BaseObject";

export class Wall extends BaseObject {
    constructor(element, id, point, width, height) {
        super(element, id, point, width, height);

    }

    draw() {
        super.draw();
        this.element.style.background = 'black';
    }
}
