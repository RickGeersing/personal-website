export function clamp(
    ctx: CanvasRenderingContext2D,
    min: number,
    max: number,
    minWidth: number,
    maxWidth: number
) {
    return Math.min(
        max,
        Math.max(min, ((ctx.canvas.width - minWidth) / (maxWidth - minWidth)) * (max - min) + min)
    );
}