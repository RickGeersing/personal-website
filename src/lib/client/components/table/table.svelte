<script lang="ts">
	let { data, header, row } = $props();
</script>

<table>
	<thead>
		<tr>{@render header()}</tr>
	</thead>
	<tbody>
		{#each data as item}
			<tr>{@render row(item)}</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	table {
		width: 100%;
		border-collapse: collapse;

		thead {
			tr {
				&:nth-child(odd) {
					background-color: #fff;
				}
			}
		}

		tr {
			&:nth-child(odd) {
				background-color: #f9f9f9;
			}
		}

		:global(th) {
			padding: 1rem;
			text-align: left;
		}
	}
</style>
