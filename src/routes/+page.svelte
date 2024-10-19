<script>
	import Game from '$lib/components/game/game.svelte';
</script>

<div class="hero">
	<div class="background">
		<Game />
	</div>
</div>

<style lang="scss">
	.hero {
		height: 100vh;
		width: 100%;

		.content {
			height: 100%;
			width: 100%;
			display: flex;
			justify-content: center;
		}
	}
</style>
