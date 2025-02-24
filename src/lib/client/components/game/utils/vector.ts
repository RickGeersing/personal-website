export class Vector {
    constructor(public x: number, public y: number) { }

    add(vector: Vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector: Vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    multiply(scalar: number) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    divide(scalar: number) {
        return new Vector(this.x / scalar, this.y / scalar);
    }

    limit(max: number) {
        if (this.magnitude > max) {
            return this.normalized.multiply(max);
        }
        return this;
    }

    rotate(angle: number) {
        const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        return new Vector(x, y);
    }

    distanceTo(vector: Vector) {
        return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2);
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get normalized() {
        return this.divide(this.magnitude);
    }

    get angle() {
        return Math.atan2(this.y, this.x);
    }
}