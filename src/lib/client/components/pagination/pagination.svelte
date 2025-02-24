<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PaginatedResults } from '$src/app';

	type Props<T = unknown> = {
		paginatedResults: PaginatedResults<T>;
	};

	let { paginatedResults }: Props = $props();

	const totalPages = $derived(Math.ceil(paginatedResults.total / paginatedResults.limit));
	const itemRange = $derived(getItemRange(paginatedResults.page));
	const siblingCount = 1;

	function getPaginationRange(
		currentPage: number,
		totalPages: number,
		siblingCount: number = 1
	): (number | string)[] {
		const totalPageNumbers = siblingCount * 2 + 5;

		if (totalPages <= totalPageNumbers) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
		const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

		const showLeftEllipsis = leftSiblingIndex > 2;
		const showRightEllipsis = rightSiblingIndex < totalPages - 1;

		let pages: (number | string)[] = [];

		if (!showLeftEllipsis && showRightEllipsis) {
			let leftItemCount = 3 + 2 * siblingCount;
			const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
			pages = [...leftRange, '...', totalPages];
		} else if (showLeftEllipsis && !showRightEllipsis) {
			let rightItemCount = 3 + 2 * siblingCount;
			const rightRange = Array.from(
				{ length: rightItemCount },
				(_, i) => totalPages - rightItemCount + 1 + i
			);
			pages = [1, '...', ...rightRange];
		} else if (showLeftEllipsis && showRightEllipsis) {
			const middleRange = Array.from(
				{ length: rightSiblingIndex - leftSiblingIndex + 1 },
				(_, i) => leftSiblingIndex + i
			);
			pages = [1, '...', ...middleRange, '...', totalPages];
		}

		return pages;
	}

	function getItemRange(page: number) {
		const start = (page - 1) * paginatedResults.limit + 1;
		const end = Math.min(page * paginatedResults.limit, paginatedResults.total);
		return { start, end };
	}

	function handlePageChange(i: number) {
		const url = new URL($page.url);
		url.searchParams.set('page', i.toString());
		goto(url.toString());
	}

	function handleLimitChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const limit = Number(target.value) || 10;
		const url = new URL($page.url);

		url.searchParams.set('limit', limit.toString());
		url.searchParams.delete('page');

		goto(url.toString());
	}
</script>

<div class="pagination-container">
	<nav class="pagination" aria-label="Pagination Navigation">
		<button
			onclick={() => handlePageChange(paginatedResults.page - 1)}
			disabled={!paginatedResults.hasPrevious}
		>
			Previous
		</button>

		{#each getPaginationRange(paginatedResults.page, totalPages, siblingCount) as pageItem}
			{#if pageItem === '...'}
				<span class="ellipsis">{pageItem}</span>
			{:else}
				<button
					onclick={() => handlePageChange(pageItem as number)}
					class:active={pageItem === paginatedResults.page}
				>
					{pageItem}
				</button>
			{/if}
		{/each}

		<button
			onclick={() => handlePageChange(paginatedResults.page + 1)}
			disabled={!paginatedResults.hasNext}
		>
			Next
		</button>
	</nav>
	<div class="pagination-info">
		<div class="item-range">
			{itemRange.start} - {itemRange.end} of {paginatedResults.total}
		</div>
		<select onchange={handleLimitChange} value={paginatedResults.limit.toString()}>
			<option value="10">10</option>
			<option value="20">20</option>
			<option value="50">50</option>
			<option value="100">100</option>
		</select>
	</div>
</div>

<style lang="scss">
	.pagination-container {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.pagination {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			margin: 1rem 0;

			button {
				padding: 0.5rem 1rem;
				border: 1px solid #ccc;
				background-color: #fff;
				border-radius: 5px;
				transition: background-color 0.3s;
				cursor: pointer;

				&.active {
					background-color: #000;
					color: #fff;

					&:hover {
						background-color: #333;
					}
				}

				&:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}

				&:hover {
					background-color: #f9f9f9;
				}
			}

			.ellipsis {
				padding: 0.5rem 1rem;
			}
		}

		.pagination-info {
			display: flex;
			align-items: center;
			gap: 0.5rem;

			.item-range {
				font-size: 0.9rem;
			}

			select {
				padding: 0.5rem;
				border: 1px solid #ccc;
				background-color: #fff;
				border-radius: 5px;
				cursor: pointer;
			}
		}
	}
</style>
