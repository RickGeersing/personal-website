<script lang="ts">
	import Button from '$lib/components/button/button.svelte';
	import Game from '$lib/components/game/game.svelte';
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';

	const showContact = getContext<Writable<boolean>>('showContact');

	function handleClick() {
		showContact.set(true);
	}
</script>

<div class="hero">
	<div class="background">
		<Game />
	</div>
	<div class="background-glass"></div>
	<div class="content">
		<h1>Rick Geersing</h1>
		<h2>Software Developer</h2>
		<Button label="Get in contact" on:click={handleClick} />
	</div>
</div>

<style lang="scss">
	@mixin breakpoint($point, $type: max, $direction: width) {
		@media only screen and (#{$type}-#{$direction}: $point) {
			@content;
		}
	}

	.hero {
		height: 100vh;
		width: 100%;

		.content {
			position: absolute;
			height: 100%;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 5px;

			h1 {
				margin: 0;
				font-weight: 400;
				line-height: 75px;
				user-select: none;
				font-size: 120px;
				text-align: center;

				@include breakpoint(768px) {
					font-size: 80px;
					line-height: 50px;
				}

				@include breakpoint(480px) {
					font-size: 60px;
					line-height: 40px;
				}
			}

			h2 {
				margin: 0;
				font-family: 'Montserrat', sans-serif;
				user-select: none;
				font-size: 45px;

				@include breakpoint(768px) {
					font-size: 30px;
				}

				@include breakpoint(480px) {
					font-size: 20px;
				}
			}
		}

		.background-glass {
			position: absolute;
			height: 100%;
			width: 100%;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 16px;
			box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
			backdrop-filter: blur(5px);
			-webkit-backdrop-filter: blur(5px);
		}
	}
</style>
