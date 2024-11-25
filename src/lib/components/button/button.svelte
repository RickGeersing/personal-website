<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	export let label: string;
	export let loading = false;

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('click');
	}
</script>

<button on:click={handleClick} class:loading>
	{label}
	{#if loading}
		<div transition:slide|local={{ axis: 'x', duration: 300 }} class="spinner-container">
			<div in:fade={{ duration: 50, delay: 300 }} out:fade={{ duration: 50 }} class="spinner"></div>
		</div>
	{/if}
</button>

<style lang="scss">
	@use './button.scss';
</style>
