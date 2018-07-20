import {Point} from './Helpers';
export class BaseObject {

    constructor(container, id, point, width, height) {
        this.container = container;
        this.width = width;
        this.id = id;
        this.height = height;
        this.location = point;
        let coords = this.container.getBoundingClientRect();
        this.location.x -= coords.x;
        this.center = new Point(point.getX + width / 2, point.getY + height / 2);
    }

    draw() {
        this.element = document.createElement('div');
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.container.appendChild(this.element);
        this.element.className = 'obj';
        this.element.id = this.id;
        this.setPosition();
    }

    setPosition() {
        this.center = new Point(this.location.getX + this.width / 2, this.location.getY + this.height / 2)
        this.element.style.top = this.location.getY + 'px';
        this.element.style.left = this.location.getX + 'px';
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

}