<script lang="ts">
	let { onclick } = $props();
</script>

<button class="close-button" {onclick} type="button" aria-label="Close">
	<div></div>
	<div></div>
</button>

<style lang="scss">
	@use './closeButton.scss';
</style>
