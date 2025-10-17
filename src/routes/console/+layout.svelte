<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';
	import { route } from '$shared/utilities/routes';
	import { Dumbbell, Gauge, ListTodo, LogOut, Settings, Users } from 'lucide-svelte';
	import Toast from '$src/lib/client/components/toast/toast.svelte';

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
			<li>
				<a href="/console">
					<Gauge strokeWidth="1" />
				</a>
			</li>
			{#if data?.session?.role === 'ADMIN'}
				<li>
					<a href="/console/users">
						<Users strokeWidth="1" />
					</a>
				</li>
			{/if}
			<li>
				<a href="/console/tasks">
					<ListTodo strokeWidth="1" />
				</a>
			</li>
			<li>
				<a href="/console/gym">
					<Dumbbell strokeWidth="1" />
				</a>
			</li>
		</ul>

		<ul>
			<li>
				<a href="/console/settings">
					<Settings strokeWidth="1" />
				</a>
			</li>
			<li>
				<button onclick={handleLogout}>
					<LogOut strokeWidth="1" />
				</button>
			</li>
		</ul>
	</nav>
	<div class="content">
		{@render children()}
	</div>
	<Toast />
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
		border-right: 1px solid #f0f0f0;
		height: 100vh;
		max-width: 80px;
		width: 100%;
		padding-block: 1rem;
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
			display: flex;
			justify-content: center;
			align-items: center;
			color: #000;
			text-decoration: none;
			padding: 20px;
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
