<script lang="ts">
	import { slide } from 'svelte/transition';

	export let name: string;
	export let label: string;
	export let type = 'text';
	export let placeholder = '';
	export let errors: string[] = [];

	function handleInput() {
		errors = [];
	}
</script>

<label>
	<span>{label}</span>
	<input {name} {type} {placeholder} on:input={handleInput} />
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
