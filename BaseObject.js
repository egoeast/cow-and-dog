export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get getCoord() {
        return [this.x, this.y];
    }

    get getX() {
        return this.x;
    }

    get getY() {
        return this.y;
    }

    set setX(x) {
        this.x = x;
    }

    set setY(y) {
        this.y = y;
    }

    set setCoord(newValue) {
        [this.x, this.y] = newValue;
    }

}

export class Vector extends Point {

    vectorLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    prepareDirection(l) {
        let ln = this.vectorLength();
        this.x = (this.x / ln) * l;
        this.y = (this.y / ln) * l;
        return true;
    }

    normalize() {
        if (this.x === 0 && this.y === 0) {
            this.x = 0;
            this.y = 0;
        } else {
            let ln = Math.sqrt(this.x * this.x + this.y * this.y);
            this.x = (this.x / ln);
            this.y = (this.y / ln);
        }
        return true;

    }

    multiplicate(value) {
        this.x = this.x * value;
        this.y = this.y * value;
    }

    addVector(vector) {
        this.x += vector.getX;
        this.y += vector.getY;
    }
}

export class BaseObject {

    constructor(container, id, point, width, height) {
        this.container = container;
        this.width = width;
        this.id = id;
        this.height = height;
        this.location = point;
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

    set setLocation(point) {

    }

}