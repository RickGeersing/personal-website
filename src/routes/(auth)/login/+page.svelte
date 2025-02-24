<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$client/components/button/button.svelte';
	import Input from '$client/components/input/input.svelte';
	import { validateFormData, type FormFieldIssues } from '$shared/utilities/formData';
	import { route } from '$shared/utilities/routes';
	import { loginSchema } from '$shared/schemas/loginSchema';
	import { slide } from 'svelte/transition';
	import { z } from 'zod';

	let error: string | undefined = $state();
	let loading: boolean = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();

		loading = true;
		error = undefined;

		try {
			const formData = new FormData(e.target as HTMLFormElement);
			const body = validateFormData(formData, loginSchema);
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				body: JSON.stringify(body)
			});

			switch (response.status) {
				case 200:
					goto(route('console'));
					break;
				case 400:
					const data = await response.json();
					error = data.message;
					break;
				default:
					error = 'An error occurred';
					break;
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				error = 'Invalid email or password';
			}
		}

		loading = false;
	}
</script>

\
<div class="login">
	<form onsubmit={handleSubmit}>
		{#if error}
			<span transition:slide={{ duration: 300 }} class="error">{error}</span>
		{/if}
		<Input name="email" label="E-mail" placeholder="mail@example.com" />
		<Input name="password" label="Password" type="password" />
		<div class="buttons">
			<Button label="Login" type="submit" {loading} />
		</div>
	</form>
</div>

<style lang="scss">
	@use '$client/scss/variables.scss' as *;

	.login {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;

		form {
			display: flex;
			flex-direction: column;
			gap: 15px;
			width: 300px;

			.error {
				font-family: $font-secondary;
				font-size: 12px;
				background-color: rgb(221, 178, 178);
				padding: 5px 10px;
				border-radius: 5px;
				color: #000;
			}
		}
	}
</style>
