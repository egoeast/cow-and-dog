import {BaseObject} from "./BaseObject";
import {Point, Vector} from "./Helpers";

export const STAND = 'stand';
export const ARRIVED = 'arrived';
export const ON_ROUTE = 'on route';

export class MovableObject extends BaseObject {

    constructor(element, id, point, width, height,canvas) {
        super(element, id, point, width, height, canvas);
        this.moving = false;
        this.speed = 10;
        this.vector = new Vector(0, 0)
        this.route = [];
        this.movingStatus = STAND;
    }

    moveToPoint() {
        if (this.moving) {
            this.makeVectorToDestination();
            this.move();
        }

    }

    move() {
        if (this.moving) {

            if (this.route.length !== 0) {
                //let v  = new Vector()
            }
            let vector = this.vector;
            this.center.addXY(vector.getX, vector.getY);
            this.checkPosition();
            this.setElementPosition();
        }
    }

    calculateVectorToPoint(point) {
        let v = new Vector(point.x - this.center.x, point.y - this.center.y);
        return v;
    }

    makeDirectionToPoint(x, y) {
        let v = new Vector(x - this.center.x, y - this.center.y);
        let tempV = Object.assign(new Vector(0, 0), v);
        v.normalize();
        v.multiplicate(this.speed);

        if (tempV.vectorLength() < v.vectorLength()) {
            this.vector = tempV;
        } else {
            this.vector = v;
        }
        return false;
    }

    addPointToRoute(point) {
        this.route.push(point)
    }

    makeVectorToDestination() {
        if (this.route.length !== 0) {
            let v = new Vector(this.route[0].x - this.center.x, this.route[0].y - this.center.y);
            let tempV = Object.assign(new Vector(0, 0), v);
            v.normalize();
            if (this.calculateDistanceToPoint(this.route[0].x, this.route[0].y) > 600) {
                v.multiplicate(this.speed * 3);
            } else {
                if (this.calculateDistanceToPoint(this.route[0].x, this.route[0].y) > 300) {
                    v.multiplicate(this.speed * 2);
                } else {
                    v.multiplicate(this.speed);
                }
            }

            if (tempV.vectorLength() <= v.vectorLength()) {
                this.vector = tempV;
                this.moving = false;
                this.route.shift();
                if (this.route.length === 0) {
                    this.movingStatus = ARRIVED;
                }
            } else {
                this.vector = v;
            }
        }
        return false;
    }

    moveTo(x, y) {
        this.location.setCoord = [x, y];
        this.element.style.top = (this.getY) + 'px';
        this.element.style.left = (this.getX) + 'px';
        this.setPosition();
    }


    get getV() {
        return this.vector;
    }

    addVector(vector) {
        this.vector.addVector(vector);
    }

    moveOnRoute() {
        this.movingStatus = ON_ROUTE;
    }

    isOnRoute() {
        return this.movingStatus === ON_ROUTE;
    }

    isArrived() {
        return this.movingStatus === ARRIVED;
    }

    stand() {
        this.movingStatus = STAND;
    }

    calculateDistanceToPoint(x, y) {
        return Math.sqrt(Math.pow(this.center.x - x, 2) + Math.pow(this.center.y - y, 2));
    }

    distanceTo(object) {
        return this.calculateDistanceToPoint(object.center.x, object.center.y);
    }

    isCollideRoundWith(object) {

        let distance = this.calculateDistanceToPoint(object.center.x - this.vector.x, object.center.y - this.vector.y);
        let v = new Vector(0, 0);
        v = this.calculateVectorToPoint(object.center);
        v.normalize();
        v.multiplicate(distance - (object.width / 2 + this.width / 2));

        if (distance < object.width / 2 + this.width / 2) {
            this.vector.addVector(v);
            return true;
        }

        return false;

    }

    isCollideWith(object) {

        let distanceX = this.calculateDistanceToPoint(object.center.x, this.center.y);
        let distanceY = this.calculateDistanceToPoint(this.center.x, object.center.y);

        let directionX = 0;
        if (this.vector.x > 0) {
            directionX = 1
        } else {
            directionX = -1
        }
        let directionY = 0;
        if (this.vector.y > 0) {
            directionY = 1
        } else {
            directionY = -1
        }
        let collideX;
        let collideY;
        //Определяем с какой стороны от обекта находится наш обЪект
        if (this.center.x < object.center.x) {
            collideX = distanceX - this.vector.x;
        } else {
            collideX = distanceX + this.vector.x;
        }
        if (this.center.y < object.center.y) {
            collideY = distanceY - this.vector.y;
        } else {
            collideY = distanceY + this.vector.y;
        }

        if ((collideX < object.width / 2 + this.width / 2) && (collideY < object.height / 2 + this.height / 2)) {

            if ((this.width / 2 + object.width / 2) - collideX > ((this.height / 2 + object.height / 2) - collideY)) {
                this.vector.y = directionY * (distanceY - (this.height / 2 + object.height / 2));

            }
            if ((this.width / 2 + object.width / 2) - collideX < ((this.height / 2 + object.height / 2) - collideY)) {
                this.vector.x = directionX * (distanceX - (this.width / 2 + object.width / 2));
            }

            return true;
        }


        return false;
    }


    checkIfCollide(object) {

        let directionX = 0;
        if (this.vector.x > 0) {
            directionX = 1
        } else {
            directionX = -1
        }
        let directionY = 0;
        if (this.vector.y > 0) {
            directionY = 1
        } else {
            directionY = -1
        }

        let newCenter = Object.assign(new Point(0, 0), this.center);
        newCenter.x = this.center.x + this.vector.x;
        newCenter.y = this.center.y + this.vector.y;


        let circleX = newCenter.x - object.center.x;
        let circleY = newCenter.y - object.center.y;

        circleX = (circleX < 0) ? -circleX - object.width / 2 : circleX -
            object.width / 2;
        circleY = (circleY < 0) ? -circleY - object.height / 2 : circleY -
            object.height / 2;
        if (circleX <= 0 && circleY <= this.width / 2) {
            return true;
        } else {
            if (circleY <= 0 && circleX <= this.width / 2) {

                return true;


            } else {
                if ((circleX * circleX + circleY * circleY) <= this.width / 2 * this.width / 2) {

                    return true;

                }
            }
        }


    };

    isCollideWithWalls(object) {

        let directionX = 0;
        if (this.vector.x > 0) {
            directionX = 1
        } else {
            directionX = -1
        }
        let directionY = 0;
        if (this.vector.y > 0) {
            directionY = 1
        } else {
            directionY = -1
        }

        let newCenter = Object.assign(new Point(0, 0), this.center);
        newCenter.x = this.center.x + this.vector.x;
        newCenter.y = this.center.y + this.vector.y;


        let circleX = newCenter.x - object.center.x;
        let circleY = newCenter.y - object.center.y;

        circleX = (circleX < 0) ? -circleX - object.width / 2 : circleX -
            object.width / 2;
        circleY = (circleY < 0) ? -circleY - object.height / 2 : circleY -
            object.height / 2;
        if (circleX <= 0 && circleY <= this.width / 2) {
            this.vector.y = this.vector.y - directionY * (this.width / 2 - circleY);
            return true;
        } else {
            if (circleY <= 0 && circleX <= this.width / 2) {

                this.vector.x = this.vector.x - directionX * (this.width / 2 - circleX);
                //this.vector.x =  Math.round(this.vector.x * 100000000) / 100000000 ;

                return true;


            } else {
                if ((circleX * circleX + circleY * circleY) <= this.width / 2 * this.width / 2) {

                    this.vector.normalize();
                    this.vector.revert();
                    this.vector.multiplicate(0.5);
                    /* if ( circleX > circleY) {
                         this.vector.x = this.vector.x - directionX * ( Math.sqrt((this.width / 2) * (this.width / 2))- (Math.sqrt(circleY * circleY + circleX * circleX)));
                     //} else {
                         this.vector.y = this.vector.y - directionY * ( Math.sqrt((this.width / 2) * (this.width / 2))- (Math.sqrt(circleY * circleY + circleX * circleX)));
                     }*/
                    //this.vector.y = this.vector.y - directionY * (Math.abs(Math.sqrt(circleY*circleY + circleX*circleX) - Math.sqrt((this.width / 2) * (this.width / 2))));
                    //alert('circleY');

                    /* if (circleY <= this.width / 2) {
                         this.vector.y = this.vector.y - directionY * (Math.abs(circleY - this.width / 2));
                     } else
                         this.vector.x = this.vector.x - directionX * (Math.abs(circleX - this.width / 2));
 */
                    /*  if (circleX > circleY) {
                          this.vector.x = this.vector.x - directionX * (Math.abs(circleX - this.width / 2));
                      } else {
                          this.vector.y = this.vector.y - directionY * (Math.abs(circleY - this.width / 2));
                      } if (circleX === circleY) { alert(true)}
  */

                    //this.vector.x = this.vector.x - directionX * (Math.abs(circleX - this.width / 2));
                    //this.vector.multiplicate(Math.abs(this.vector.vectorLength() - Math.sqrt(Math.abs(circleX * circleX + circleY * circleY - this.width / 2 * this.width / 2))));
                    //this.vector.x = this.vector.x - directionX * Math.sqrt(Math.abs(circleX * circleX + circleY * circleY - this.width / 2 * this.width / 2));
                    //this.vector.y = this.vector.y - directionY * Math.sqrt(Math.abs(circleY * circleY - (this.width / 2) * (this.width / 2)));
                    //this.vector.y = this.vector.y - directionY*(Math.abs(circleY - this.width /2));
                    //console.log(this.vector.x, this.vector.y);
                    return true;

                }
            }
        }


        return false;
    }

    collideCircleWithSquare(object) {
        let newHalfWidth = (object.width + this.width) / 2;
        let newHalfHeight = (object.height + this.height) / 2;
        let newCenter = Object.assign(new Point(0, 0), this.center);
        newCenter.x += this.vector.x;
        newCenter.y += this.vector.y;

        let collideX = (newCenter.x >= object.center.x - newHalfWidth) && (newCenter.x <= object.center.x + newHalfWidth);
        let collideY = (newCenter.y >= object.center.y - newHalfHeight) && (newCenter.y <= object.center.y + newHalfHeight);



        if (collideX && collideY) {
            let minX = Math.min(newCenter.x - (object.center.x - newHalfWidth), object.center.x + newHalfWidth - newCenter.x);
            let minY = Math.min(newCenter.y - (object.center.y - newHalfHeight), object.center.y + newHalfHeight - newCenter.y);

            if (minX < minY) {
                if (newCenter.x - (object.center.x - newHalfWidth) < object.center.x + newHalfWidth - newCenter.x) {
                    this.vector.x = object.center.x - newHalfWidth - this.center.x;
                } else {
                    this.vector.x = object.center.x + newHalfWidth - this.center.x;
                }
            } else
                if (newCenter.y - (object.center.y - newHalfHeight) < object.center.y + newHalfHeight - newCenter.y) {
                    this.vector.y = object.center.y - newHalfHeight - this.center.y;
                } else {
                    this.vector.y = object.center.y + newHalfHeight - this.center.y;
                }
            //this.vector.y = 0;
            return true
        }

        return false;

    }


}