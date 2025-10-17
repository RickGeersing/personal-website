<script lang="ts">
	import { fly } from 'svelte/transition';
	import { toasts } from './toast';
	import { flip } from 'svelte/animate';
	import { AlertCircle, CircleCheck, Info } from 'lucide-svelte';
</script>

<div class="toast-container">
	{#each $toasts as toast, i (toast.id)}
		<div
			class={`toast ${toast.type}`}
			animate:flip={{ duration: 300 }}
			in:fly={{ duration: 300, y: 100 }}
			out:fly={{ duration: 300, x: 200 }}
		>
			{#if toast.type === 'info'}
				<Info size="24" />
			{:else if toast.type === 'success'}
				<CircleCheck size="24" />
			{:else if toast.type === 'error'}
				<AlertCircle size="24" />
			{/if}
			{toast.message}
		</div>
	{/each}
</div>

<style lang="scss">
	@use './toast.scss';
</style>
