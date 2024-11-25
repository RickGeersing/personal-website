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
	<div class="content">
		<h1>Rick Geersing</h1>
		<h2>Software Developer</h2>
		<Button label="Get in contact" on:click={handleClick} />
	</div>
</div>

<style lang="scss">
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

			h1 {
				margin: 0;
				font-size: 120px;
				font-weight: 400;
				line-height: 75px;
				user-select: none;
			}

			h2 {
				margin: 0;
				font-size: 45px;
				font-family: 'Montserrat', sans-serif;
				user-select: none;
			}
		}
	}
</style>
