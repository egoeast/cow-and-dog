import {BaseObject} from "./BaseObject";
import {Gates} from "./Gates";
import {Wall} from "./Wall";
import {DIRECTION_LEFT, DIRECTION_RIGHT} from "./constants";
import {Point} from "./Helpers";

export class Stall extends BaseObject {
    constructor(element, id, point, width, height, direction, isOpen, canvas) {
        super(element, id, point, width, height,canvas);
        this.direction = direction;
        let wallHeight = (this.height - 140) / 2;
        this.isOpen = false;
        this.openTimer = 0;
        this.maxTimer = 10;
        this.cows = 0;


        if (this.direction === DIRECTION_RIGHT) {
            let wall = new Wall(this.container, 'wall-1-' + id, point.addXYAndClone(this.width, 0), 5, wallHeight, this.canvas);
            let wall2 = new Wall(this.container, 'wall-2-' + id, point.addXYAndClone(this.width, wallHeight + 140), 5, wallHeight, this.canvas);
            this.walls = [wall, wall2];
            let gate = new Gates(this.container, 'gate-' + id, point.addXYAndClone(this.width - 5, wallHeight), 10, 140, this.canvas);
            this.gates = [gate];
            this.escapeRoute = [this.center.addXYAndClone(0, 0), this.center.addXYAndClone(this.width, 0)];
        } else {
            let wall = new Wall(this.container, 'wall-1-' + id, point.addXYAndClone(-5, 0), 10, wallHeight, this.canvas);
            let wall2 = new Wall(this.container, 'wall-2-' + id, point.addXYAndClone(-5, wallHeight + 140), 5, wallHeight, this.canvas);
            this.walls = [wall, wall2];
            let gate = new Gates(this.container, 'gate-' + id, point.addXYAndClone(-5, wallHeight), 5, 140, this.canvas);
            this.gates = [gate];
            this.escapeRoute = [this.center.addXYAndClone(0, 0), this.center.addXYAndClone(-this.width, 0)];
        }
        if (isOpen) {
            this.changeState();
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
        });
        this.openTimer = 0;
    }

    manageStates() {
        this.openTimer++;
        if (this.openTimer > this.maxTimer) {
            this.changeState();
        }
    }

}
