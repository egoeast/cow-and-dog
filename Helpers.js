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

    addXY(x, y) {
        this.x += x;
        this.y += y;
    }

    minusXY(x, y) {
        this.x -= x;
        this.y -= y;
    }

    addPoint(point) {
        this.x += point.x;
        this.y += point.y;
    }

    addXYAndClone(x, y) {
        let temp = Object.assign(new Point(0, 0), this);
        temp.addXY(x, y);
        return temp;
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
            let ln = this.vectorLength();
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

    revert() {
        this.x = -this.x;
        this.y = -this.y;
    }
}


export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


