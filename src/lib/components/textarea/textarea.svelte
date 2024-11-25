<script lang="ts">
	import { slide } from 'svelte/transition';

	export let name: string;
	export let label: string;
	export let placeholder = '';
	export let errors: string[] = [];

	function handleInput() {
		errors = [];
	}
</script>

<label>
	<span>{label}</span>
	<textarea {name} {placeholder} on:input={handleInput}></textarea>
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
