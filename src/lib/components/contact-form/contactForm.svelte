<script lang="ts">
	import { fade } from 'svelte/transition';
	import Button from '../button/button.svelte';
	import Input from '../input/input.svelte';
	import Textarea from '../textarea/textarea.svelte';
	import CloseButton from '../close-button/closeButton.svelte';
	import { Turnstile } from 'svelte-turnstile';
	import { PUBLIC_CF_SITE_KEY } from '$env/static/public';

	export let open = true;

	let loading = false;
	let formElement: HTMLFormElement | undefined;
	let errors: Record<string, string[]> | undefined;

	function handleClose() {
		open = false;
	}

	async function handleSubmit(e: SubmitEvent) {
		loading = true;

		const response = await fetch('/api/contact', {
			method: 'POST',
			body: new FormData(formElement)
		});
		const data = await response.json();

		if (!response.ok && data.errors) {
			errors = data.errors;
		} else {
			formElement?.reset();
			open = false;
		}

		loading = false;
	}
</script>

{#if open}
	<div
		class="contact-form"
		on:click|self={handleClose}
		on:keydown|self={handleClose}
		role="button"
		tabindex="0"
		transition:fade={{ duration: 200 }}
	>
		<form bind:this={formElement} on:submit|preventDefault={handleSubmit}>
			<div class="close">
				<CloseButton on:click={handleClose} />
			</div>
			<Input name="name" label="Name" errors={errors?.name} />
			<Input name="email" label="E-mail" errors={errors?.email} />
			<Textarea name="message" label="Message" errors={errors?.message} />
			<Turnstile siteKey={PUBLIC_CF_SITE_KEY} theme="light" />
			<div class="buttons">
				<Button label="Send" {loading} />
			</div>
		</form>
	</div>
{/if}

<style lang="scss">
	@use './contactForm.scss';
</style>
