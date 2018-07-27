import {Point} from "./Helpers";

export class Canvas {

    constructor(id) {
        this.element = document.getElementById(id);
    }

    get getOffset() {
        return new Point(this.element.offsetLeft, this.element.offsetTop);
    }

    get getOffsetX() {
        return this.element.offsetLeft;
    }
    get getOffsetY() {
        return this.element.offsetTop;
    }

    get getMaxWidth() {
        return this.element.clientWidth + this.getOffsetX;
    }

    get getMaxHeight() {
        return this.element.clientHeight + this.getOffsetY;
    }

    get getWidth() {
        return this.element.clientWidth;
    }

    get getHeight() {
        return this.element.clientHeight;
    }
}