<script lang="ts">
	let { children } = $props();
</script>

<div class="card">
	{@render children?.()}
</div>

<style lang="scss">
	@use './card.scss';
</style>
