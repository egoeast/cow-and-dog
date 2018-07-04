export class BaseObject {

    constructor(container, id, point, width, height) {
        /*  this.element = document.getElementById(element);
          let params = this.element.getBoundingClientRect();*/
        this.width = width;
        this.height = height;
        this.location = point;

        let center = new Point(point.getX + width / 2, point.getY + height / 2)
        this.center = center;

        this.element = document.createElement('div');
        container.appendChild(this.element);
        this.element.className = 'obj';
        this.setPorition();
        /*this.element.style.width='200px';

        this.element.style.height='100px';

        this.element.style.background='gray';*/


    }

    setPorition() {
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

    /*  calculatePositionIn(event) {
          let x = event.clientX - this.x;
          let y = event.clientY - this.y;
          return [x, y];
      }
  */

}

