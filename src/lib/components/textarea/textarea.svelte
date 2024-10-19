<script lang="ts">
	export let name: string;
	export let label: string;
	export let placeholder = '';
</script>

<label>
	<span>{label}</span>
	<textarea {name} {placeholder}></textarea>
</label>

<style lang="scss">
	@import './textarea.scss';
</style>
