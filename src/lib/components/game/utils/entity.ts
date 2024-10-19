import type { Obstacle } from "./textObstacle";
import { Vector } from "./vector";

export class Entity {
    position: Vector;
    heading: Vector = new Vector(1, 0);
    velocity: Vector = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
    acceleration: Vector = new Vector(0, 0);

    maxVelocity: number = 2;
    maxSteeringForce: number = 0.05;

    width: number = 20;
    height: number = 10;

    // Flocking weights
    separationWeight: number = 1.5;
    alignmentWeight: number = 1.0;
    cohesionWeight: number = 1.0;

    constructor(position: Vector) {
        this.position = position;
    }

    update(ctx: CanvasRenderingContext2D, entities: Entity[], obstacles: Obstacle[], cursorPosition: Vector) {
        this.flock(entities);
        this.avoid(cursorPosition);

        obstacles.forEach((obstacle) => {
            this.avoidObstacle(obstacle);
        });

        this.velocity = this.velocity.add(this.acceleration);
        this.velocity = this.velocity.limit(this.maxVelocity);
        this.position = this.position.add(this.velocity);

        this.wrapAround(ctx.canvas.width, ctx.canvas.height);
        this.#draw(ctx);

        // Update heading based on the new velocity
        if (this.velocity.magnitude > 0) {
            this.heading = this.velocity.normalized;
        }

        // Reset acceleration for the next frame
        this.acceleration = new Vector(0, 0);
    }

    avoidObstacle(obstacle: Obstacle) {
        const padding = 30; // Adjust padding as needed

        // Calculate the boundaries of the obstacle
        const left = obstacle.position.x - obstacle.width / 2 - padding;
        const right = obstacle.position.x + obstacle.width / 2 + padding;
        const top = obstacle.position.y - obstacle.height / 2 - padding;
        const bottom = obstacle.position.y + obstacle.height / 2 + padding;

        // Check if the entity is within the padded boundaries
        if (
            this.position.x > left &&
            this.position.x < right &&
            this.position.y > top &&
            this.position.y < bottom
        ) {
            // Calculate a steering force away from the center of the obstacle
            const away = this.position.subtract(obstacle.position).normalized.multiply(this.maxVelocity);
            let steer = away.subtract(this.velocity);
            steer = steer.limit(this.maxSteeringForce * 3); // Increase force if necessary

            // Add to acceleration
            this.acceleration = this.acceleration.add(steer);
        }
    }

    flock(entities: Entity[]) {
        const separationForce = this.separate(entities).multiply(this.separationWeight);
        const alignmentForce = this.align(entities).multiply(this.alignmentWeight);
        const cohesionForce = this.cohere(entities).multiply(this.cohesionWeight);

        // Accumulate all forces
        this.acceleration = this.acceleration
            .add(separationForce)
            .add(alignmentForce)
            .add(cohesionForce);
    }

    avoid(target: Vector) {
        const desiredSeparation = 100; // Adjust this value as needed
        const distance = this.position.distanceTo(target);

        if (distance < desiredSeparation) {
            // Calculate a vector pointing away from the cursor
            let steer = this.position.subtract(target).normalized.multiply(this.maxVelocity);
            steer = steer.subtract(this.velocity);
            steer = steer.limit(this.maxSteeringForce * 3); // Increase force if necessary

            // Add to acceleration
            this.acceleration = this.acceleration.add(steer);
        }
    }

    separate(entities: Entity[]): Vector {
        const desiredSeparation = 25;
        let steer = new Vector(0, 0);
        let count = 0;

        for (const other of entities) {
            const distance = this.position.distanceTo(other.position);
            if (other !== this && distance < desiredSeparation) {
                const diff = this.position.subtract(other.position).normalized;
                steer = steer.add(diff.divide(distance));
                count++;
            }
        }

        if (count > 0) {
            steer = steer.divide(count);
        }

        if (steer.magnitude > 0) {
            steer = steer.normalized.multiply(this.maxVelocity).subtract(this.velocity);
            steer = steer.limit(this.maxSteeringForce);
        }

        return steer;
    }

    align(entities: Entity[]): Vector {
        const neighborDist = 50;
        let sum = new Vector(0, 0);
        let count = 0;

        for (const other of entities) {
            const distance = this.position.distanceTo(other.position);
            if (other !== this && distance < neighborDist) {
                sum = sum.add(other.velocity);
                count++;
            }
        }

        if (count > 0) {
            sum = sum.divide(count).normalized.multiply(this.maxVelocity);
            let steer = sum.subtract(this.velocity);
            steer = steer.limit(this.maxSteeringForce);
            return steer;
        } else {
            return new Vector(0, 0);
        }
    }

    cohere(entities: Entity[]): Vector {
        const neighborDist = 50;
        let sum = new Vector(0, 0);
        let count = 0;

        for (const other of entities) {
            const distance = this.position.distanceTo(other.position);
            if (other !== this && distance < neighborDist) {
                sum = sum.add(other.position);
                count++;
            }
        }

        if (count > 0) {
            const averagePosition = sum.divide(count);
            return this.seek(averagePosition);
        } else {
            return new Vector(0, 0);
        }
    }

    seek(target: Vector): Vector {
        const desired = target.subtract(this.position).normalized.multiply(this.maxVelocity);
        let steer = desired.subtract(this.velocity);
        steer = steer.limit(this.maxSteeringForce);
        return steer;
    }

    wrapAround(width: number, height: number) {
        if (this.position.x > width + this.width) {
            this.position.x = 0;
        } else if (this.position.x < 0 - this.width) {
            this.position.x = width;
        }

        if (this.position.y > height + this.height) {
            this.position.y = 0;
        } else if (this.position.y < 0 - this.height) {
            this.position.y = height;
        }
    }

    #draw(ctx: CanvasRenderingContext2D) {
        // Draw a white triangle pointing along the positive x-axis
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(Math.atan2(this.heading.y, this.heading.x));
        ctx.beginPath();
        ctx.moveTo(this.width / 2, 0); // Point of the triangle
        ctx.lineTo(-this.width / 2, -this.height / 2);
        ctx.lineTo(-this.width / 2, this.height / 2);
        ctx.closePath();
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.restore();
    }
}