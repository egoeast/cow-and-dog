import {Point} from './Helpers';

export class BaseObject {

    constructor(container, id, point, width, height, canvas) {

        this.canvas = canvas;
        this.container = container;
        this.id = id;
        this.width = width;
        this.height = height;
        this.halfWidth = width / 2;
        this.halfHeight = height / 2;

        this.center = new Point(point.getX + this.halfWidth, point.getY + this.halfHeight);
        let coords = this.canvas.getOffset;
        this.location = point.addXYAndClone(coords.x, coords.y);
        console.log(point)
        console.log(this)
        //this.location.x += coords.x;
        //this.location.y += coords.y;

    }

    draw() {
        console.log(this);
        this.element = document.createElement('div');
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.container.appendChild(this.element);
        this.element.className = 'obj';
        this.element.id = this.id;
        this.checkPosition();
        this.setElementPosition();
    }

    checkPosition() {

        if (this.getX <= this.halfWidth) this.setX = this.halfWidth;
        if (this.getY <= this.halfHeight) this.setY = this.halfHeight;

        let maxX = this.canvas.getWidth - this.halfWidth;
        let maxY = this.canvas.getHeight - this.halfHeight;
        if (this.getX >= maxX) this.setX = maxX;
        if (this.getY >= maxY) this.setY = maxY;

    }

    setElementPosition() {
        let offset = this.canvas.getOffset;
        offset.addPoint(this.center);
        offset.minusXY(this.halfWidth, this.halfHeight);
        this.location = offset;

        this.element.style.top = this.locY + 'px';
        this.element.style.left = this.locX + 'px';
    }
    set setCenter(point) {
        this.center = point;
    }

    get getCenter() {
        return this.center;
    }

    get getX() {
        return this.center.getX;
    }

    get getY() {
        return this.center.getY;
    }

    set setX(x) {
        this.center.setX = x;
    }

    set setY(y) {
        this.center.setY = y;
    }

    get locX() {
        return this.location.getX;
    }

    get locY() {
        return this.location.getY;
    }

    set locX(x) {
        this.location.setY(x);
    }

    set locY(y) {
        this.location.setY(y);
    }

    set setLocation(loc) {
        this.location = loc;
    }


}