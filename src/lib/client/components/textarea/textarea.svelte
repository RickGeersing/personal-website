<script lang="ts">
	import { slide } from 'svelte/transition';

	interface Props {
		name: string;
		label: string;
		placeholder?: string;
		errors?: string[];
	}

	let {
		name,
		label,
		placeholder = '',
		errors = $bindable([])
	}: Props = $props();

	function handleInput() {
		errors = [];
	}
</script>

<label>
	<span>{label}</span>
	<textarea {name} {placeholder} oninput={handleInput}></textarea>
	{#if errors?.length > 0}
		<div class="errors" transition:slide={{ duration: 300 }}>
			{#each errors as error}
				<div>{error}</div>
			{/each}
		</div>
	{/if}
</label>

<style lang="scss">
	@use './textarea.scss';
</style>
