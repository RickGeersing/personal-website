<script lang="ts">
	type Props = {
		value: string;
		href: string;
	};

	let { value, href }: Props = $props();
</script>

<td>
	<a {href}>{value}</a>
</td>

<style lang="scss">
	td {
		text-align: left;
		a {
			display: block;
			color: inherit;
			text-decoration: none;
			padding: 1rem;

			width: 100%;
			height: 100%;
		}
	}
</style>
