import { clamp } from "./clamp";
import type { Vector } from "./vector";

type ObstacleOptions = {
    position: Vector;
    width: number;
    height: number;
};

type TextObstacleOptions = Omit<ObstacleOptions, "width" | "height"> & {
    text: string;
    fontFamily: string;
    minFontSize: FontSizing;
    maxFontSize: FontSizing;
    debug?: boolean;
};

type FontSizing = {
    size: number;
    width: number;
}

export class Obstacle {
    position: Vector;
    width: number;
    height: number;

    constructor({ position, width, height }: { position: Vector, width: number, height: number }) {
        this.position = position;
        this.width = width;
        this.height = height;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(ctx: CanvasRenderingContext2D) {
        // To be implemented by subclasses
    }
}

export class TextObstacle extends Obstacle {
    text: string;
    fontFamily: string = "Arial";
    minFontSize: FontSizing;
    maxFontSize: FontSizing;
    debug: boolean;


    constructor({
        position,
        text,
        fontFamily,
        minFontSize,
        maxFontSize,
        debug,
    }: TextObstacleOptions) {
        super({ position, width: 0, height: 0 });

        this.text = text;
        this.fontFamily = fontFamily;
        this.minFontSize = minFontSize;
        this.maxFontSize = maxFontSize;
        this.debug = debug || false;
    }

    update(ctx: CanvasRenderingContext2D) {
        this.#draw(ctx);
    }

    #draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        // Translate to the desired position
        ctx.translate(this.position.x, this.position.y);

        // Set text alignment properties
        ctx.textAlign = "center"; // Center horizontally
        ctx.textBaseline = "middle"; // Center vertically
        ctx.fillStyle = "#000"; // Text color

        // Calculate font size based on sizing constraints
        const fontSize = clamp(ctx, this.minFontSize.size, this.maxFontSize.size, this.minFontSize.width, this.maxFontSize.width);

        ctx.font = `${fontSize}px ${this.fontFamily}`;

        // Measure text dimensions
        const metrics = ctx.measureText(this.text);
        this.width = metrics.width;
        this.height = fontSize;

        // Draw the text at the origin of the translated context
        ctx.fillText(this.text, 0, 0);

        // Draw the rectangle around the text
        if (this.debug) {
            ctx.strokeStyle = "#f00"; // Rectangle color
            ctx.lineWidth = 2; // Optional: Set rectangle border thickness
            ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }

        ctx.restore();
    }
}

export class TextButtonObstacle extends TextObstacle {
    onClick: () => void;
    paddingBlock: number = 15;
    paddingInline: number = 5;

    constructor({
        position,
        text,
        fontFamily,
        minFontSize,
        maxFontSize,
        debug,
        onClick,
    }: TextObstacleOptions & { onClick: () => void }) {
        super({ position, text, fontFamily, minFontSize, maxFontSize, debug });

        this.onClick = onClick;
    }

    collision(point: Vector): boolean {
        const halfWidth = this.width / 2 + this.paddingBlock;
        const halfHeight = this.height / 2 + this.paddingInline;

        return (
            point.x >= this.position.x - halfWidth &&
            point.x <= this.position.x + halfWidth &&
            point.y >= this.position.y - halfHeight &&
            point.y <= this.position.y + halfHeight
        );
    }

    update(ctx: CanvasRenderingContext2D) {
        this.#draw(ctx);
    }

    #draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const fontSize = clamp(ctx, this.minFontSize.size, this.maxFontSize.size, this.minFontSize.width, this.maxFontSize.width);

        ctx.font = `${fontSize}px ${this.fontFamily}`;

        const metrics = ctx.measureText(this.text);
        this.width = metrics.width;
        this.height = fontSize;

        const rectWidth = this.width + this.paddingBlock * 2;
        const rectHeight = this.height + this.paddingInline * 2;

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.roundRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight, 4);
        ctx.fill();
        ctx.stroke();


        ctx.fillStyle = "#fff";
        ctx.fillText(this.text, 0, 0);


        ctx.restore();
    }
}