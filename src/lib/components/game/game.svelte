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
	let obstacles: Obstacle[] = [];

	function main() {
		for (let i = 0; i < 500; i++) {
			entities.push(
				new Entity(
					new Vector(Math.random() * window.innerWidth, Math.random() * window.innerHeight)
				)
			);
		}

		obstacles.push(
			new TextObstacle({
				text: 'Rick Geersing',
				position: new Vector(window.innerWidth / 2, window.innerHeight / 2),
				fontFamily: 'NewAmsterdam',
				minFontSize: { size: 60, width: 320 },
				maxFontSize: { size: 120, width: 1280 }
			}),
			new TextObstacle({
				text: 'Software Developer',
				position: new Vector(window.innerWidth / 2, window.innerHeight / 2),
				fontFamily: 'Montserrat',
				minFontSize: { size: 25, width: 320 },
				maxFontSize: { size: 45, width: 1280 }
			}),
			new TextButtonObstacle({
				text: 'Contact',
				position: new Vector(window.innerWidth / 2, window.innerHeight / 2),
				fontFamily: 'Montserrat',
				minFontSize: { size: 20, width: 556 },
				maxFontSize: { size: 30, width: 1280 },
				onClick: () => {}
			})
		);

		scale();
		loop();
	}

	function scale() {
		let ctx = canvas?.getContext('2d');

		if (!ctx) return;

		ctx.canvas.setAttribute('width', window.innerWidth.toString());
		ctx.canvas.setAttribute('height', window.innerHeight.toString());

		const padding = clamp(ctx, 60, 80, 556, 1280);
		obstacles.forEach((obstacle, i) => {
			obstacle.position = new Vector(
				window.innerWidth / 2,
				window.innerHeight / 2 - 50 + (i !== 2 ? i * padding : padding * 2)
			);
		});
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

		obstacles.forEach((obstacles) => {
			obstacles.update(ctx);
		});

		entities.forEach((entity) => {
			entity.update(ctx, entities, obstacles, mousePosition);
		});
	}

	function handleMouseOver(event: MouseEvent) {
		mousePosition.x = event.clientX;
		mousePosition.y = event.clientY;
	}

	onMount(main);
</script>

<svelte:window on:resize={scale} />

<canvas on:focus bind:this={canvas} on:mousemove={handleMouseOver}></canvas>

<style lang="scss">
	canvas {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
</style>
