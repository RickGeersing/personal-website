<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	type Props = {
		label: string;
		loading?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: () => void;
	};

	let { label, loading = false, type = 'button', onclick }: Props = $props();
	let mouseDown = $state(false);

	function onMouseDown() {
		mouseDown = true;
	}

	function onMouseUp() {
		mouseDown = false;
	}
</script>

<button
	{type}
	{onclick}
	class:loading
	class:mouse-down={mouseDown}
	onmousedown={onMouseDown}
	onmouseup={onMouseUp}
>
	<div class="content">
		{label}
		{#if loading}
			<div transition:slide|local={{ axis: 'x', duration: 300 }} class="spinner-container">
				<div
					in:fade={{ duration: 50, delay: 300 }}
					out:fade={{ duration: 50 }}
					class="spinner"
				></div>
			</div>
		{/if}
	</div>
</button>

<style lang="scss">
	@use './button.scss';
</style>
