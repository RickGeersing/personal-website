<script lang="ts">
	import Button from '$lib/components/button/button.svelte';
	import Card from '$lib/components/card/card.svelte';
	import Input from '$lib/components/input/input.svelte';
</script>

<div class="login">
	<Card>
		<form>
			<h1>Login</h1>
			<Input name="email" label="E-mail" placeholder="mail@example.com" />
			<Input name="password" label="Password" type="password" />
			<div class="buttons">
				<Button label="Login" />
			</div>
		</form>
	</Card>
</div>

<style lang="scss">
	.login {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;

		form {
			display: flex;
			flex-direction: column;
			gap: 15px;

			h1 {
				margin: 0;
				font-size: 40px;
				text-align: center;
			}
		}
	}
</style>
