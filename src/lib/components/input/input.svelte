<script lang="ts">
	export let name: string;
	export let label: string;
	export let type = 'text';
	export let placeholder = '';
</script>

<label>
	<span>{label}</span>
	<input {name} {type} {placeholder} />
</label>

<style lang="scss">
	@import './input.scss';
</style>
