<script lang="ts">
	import { slide } from 'svelte/transition';

	interface Props {
		name: string;
		label: string;
		type?: string;
		value?: string;
		placeholder?: string;
		errors?: string[];
	}

	let {
		name,
		label,
		type = 'text',
		placeholder = '',
		errors = $bindable([]),
		value
	}: Props = $props();

	function handleInput() {
		errors = [];
	}
</script>

<label>
	<span>{label}</span>
	<input {name} {type} {value} {placeholder} oninput={handleInput} />
	{#if errors?.length > 0}
		<div class="errors" transition:slide={{ duration: 300 }}>
			{#each errors as error}
				<div>{error}</div>
			{/each}
		</div>
	{/if}
</label>

<style lang="scss">
	@use './input.scss';
</style>
