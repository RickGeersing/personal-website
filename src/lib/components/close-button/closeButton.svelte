<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('click');
	}
</script>

<button class="close-button" on:click={handleClick}>
	<div></div>
	<div></div>
</button>

<style lang="scss">
	@import './closeButton.scss';
</style>
