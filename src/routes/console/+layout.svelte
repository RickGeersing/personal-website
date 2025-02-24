<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Button from '$client/components/button/button.svelte';
	import { goto } from '$app/navigation';
	import { route } from '$shared/utilities/routes';
	import { Role } from '@prisma/client';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	async function handleLogout(): Promise<void> {
		const response = await fetch('/api/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			goto(route('login'));
		}
	}
</script>

<main>
	<nav>
		<ul>
			<li><a href="/console">Dashboard</a></li>
			{#if data?.session?.role === Role.ADMIN}
				<li><a href="/console/users">Users</a></li>
			{/if}
		</ul>

		<ul>
			<li><a href="/console/settings">Settings</a></li>
			<li>
				<button onclick={handleLogout}>Logout</button>
			</li>
		</ul>
	</nav>
	<div class="content">
		{@render children()}
	</div>
</main>

<style lang="scss">
	@use '$client/scss/variables.scss' as *;

	main {
		display: flex;
	}

	nav {
		position: sticky;
		top: 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-right: 1px solid #ccc;
		height: 100vh;
		max-width: 250px;
		width: 100%;
		padding-block: 50px;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		transition: background-color 0.2s;

		a,
		button {
			display: block;
			color: #000;
			text-decoration: none;
			padding: 10px 20px;
			border: none;
			background: transparent;
			font-family: $font-secondary;
			font-size: 1rem;
			width: 100%;
			text-align: left;
			cursor: pointer;
		}

		&:hover {
			background-color: #f0f0f0;
		}
	}

	.content {
		flex: 1;
	}
</style>
