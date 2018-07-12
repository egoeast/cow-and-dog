import {BaseObject} from "./BaseObject";
import {Gates} from "./Gates";
import {Wall} from "./Wall";
import {DIRECTION_LEFT, DIRECTION_RIGHT} from "./constants";
import {Point} from "./Helpers";

export class Stall extends BaseObject {
    constructor(element, id, point, width, height, direction, isOpen) {
        super(element, id, point, width, height);
        this.direction = direction;
        let wallHeight = (this.height - 120) / 2;
        this.isOpen = false;
        this.openTimer = 0;
        this.maxTimer = 10;
        this.cows = 0;

        if (this.direction === DIRECTION_RIGHT) {
            let wall = new Wall(this.container, 'wall-1-' + id, this.location.addXYAndClone(this.width, 0), 5, wallHeight);
            let wall2 = new Wall(this.container, 'wall-2-' + id, this.location.addXYAndClone(this.width, wallHeight + 140), 5, wallHeight);
            this.walls = [wall, wall2];
            let gate = new Gates(this.container, 'gate-' + id , this.location.addXYAndClone(this.width-5, wallHeight ), 10, 140);
            this.gates = [gate];
            this.escapeRoute = [this.center.addXYAndClone(0,0), this.center.addXYAndClone(this.width,0)];
        } else {
            let wall = new Wall(this.container, 'wall-1-' + id, this.location.addXYAndClone(-5, 0), 5, wallHeight);
            let wall2 = new Wall(this.container, 'wall-2-' + id, this.location.addXYAndClone(-5, wallHeight + 140), 5, wallHeight);
            this.walls = [wall, wall2];
            let gate = new Gates(this.container, 'gate-' + id , this.location.addXYAndClone(-5, wallHeight ), 10, 140);
            this.gates = [gate];
            this.escapeRoute = [this.center.addXYAndClone(0,0), this.center.addXYAndClone(-this.width,0)];
        }
        if(isOpen) {
            this.changeState();
            console.log(this);
        }
    }

    draw() {
        super.draw();
        this.element.style.background = 'grey';
    }

    changeState() {
        this.isOpen = !this.isOpen;
        this.gates.forEach((gate) => {
            gate.changeState();
        })
        this.openTimer = 0;
    }

}
