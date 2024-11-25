<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { Entity } from './utils/entity';
	import { Vector } from './utils/vector';
	import { Obstacle, TextButtonObstacle, TextObstacle } from './utils/textObstacle';
	import { clamp } from './utils/clamp';

	let canvas: HTMLCanvasElement;
	let last: number = 0;

	const fps = 60;
	const interval = 1000 / fps;
	const mousePosition = new Vector(0, 0);

	let entities: Entity[] = [];

	function main() {
		for (let i = 0; i < 500; i++) {
			entities.push(
				new Entity(
					new Vector(Math.random() * window.innerWidth, Math.random() * window.innerHeight)
				)
			);
		}

		scale();
		loop();
	}

	function scale() {
		let ctx = canvas?.getContext('2d');

		if (!ctx) return;

		ctx.canvas.setAttribute('width', window.innerWidth.toString());
		ctx.canvas.setAttribute('height', window.innerHeight.toString());
	}

	function loop() {
		const elapsed = Date.now() - last;
		let ctx = canvas.getContext('2d');

		if (elapsed > interval && ctx) {
			last = Date.now() - (elapsed % interval);
			update(ctx);
		}
		requestAnimationFrame(loop);
	}

	function update(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		entities.forEach((entity) => {
			entity.update(ctx, entities, [], mousePosition);
		});
	}

	onMount(main);
</script>

<svelte:window on:resize={scale} />

<canvas on:focus bind:this={canvas}></canvas>

<style lang="scss">
	canvas {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
</style>
