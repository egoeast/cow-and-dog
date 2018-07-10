import {DOG_BARK, DOG_RUN, DOG_SIT} from "./constants";

export class Dog {
    constructor(element) {
        this.element = element;
        this.setState(DOG_SIT);
        this.timer = 0;
    }

    setState(state) {
        if (this.state !== state) {
            this.state = state;
            this.element.className = state;
        }
    }

    incTimer() {
        this.timer++;
    }

    clearTimer()
    {
        this.timer = 0;
    }

    sit() {
        this.setState(DOG_SIT);
    }

    bark() {
        this.setState(DOG_BARK);
    }

    run() {
        this.setState(DOG_RUN);
    }

}
