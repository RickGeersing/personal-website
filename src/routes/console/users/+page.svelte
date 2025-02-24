<script lang="ts">
	import Table from '$client/components/table/table.svelte';
	import type { User } from '@prisma/client';
	import type { PageData } from './$types';
	import TableDataLink from '$src/lib/client/components/table/components/table-data-link/tableDataLink.svelte';
	import { route } from '$src/lib/shared/utilities/routes';
	import Pagination from '$src/lib/client/components/pagination/pagination.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="user-overview">
	<Table data={data.users?.results}>
		{#snippet header()}
			<th>ID</th>
			<th>Email</th>
			<th>Role</th>
		{/snippet}

		{#snippet row(item: User)}
			{@const href = route('user', { id: item.id })}
			<TableDataLink {href} value={item.id} />
			<TableDataLink {href} value={item.email} />
			<TableDataLink {href} value={item.role} />
		{/snippet}
	</Table>

	{#if data.users.limit < data.users.total}
		<Pagination paginatedResults={data.users} />
	{/if}
</div>

<style lang="scss">
	.user-overview {
		padding: 4rem 3rem;
	}
</style>
