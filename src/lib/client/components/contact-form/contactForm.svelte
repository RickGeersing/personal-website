<script lang="ts">
	import { fade } from 'svelte/transition';
	import Button from '../button/button.svelte';
	import Input from '../input/input.svelte';
	import Textarea from '../textarea/textarea.svelte';
	import CloseButton from '../close-button/closeButton.svelte';
	import { Turnstile } from 'svelte-turnstile';
	import { PUBLIC_CF_SITE_KEY } from '$env/static/public';

	interface Props {
		open?: boolean;
	}

	let { open = $bindable(true) }: Props = $props();

	let loading = $state(false);
	let formElement: HTMLFormElement | undefined = $state();
	let errors: Record<string, string[]> | undefined = $state();

	function self(fn: Function) {
		return (e: Event) => {
			if (e.target === e.currentTarget) fn(e);
		};
	}

	function handleClose() {
		errors = undefined;
		open = false;
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		errors = undefined;

		const response = await fetch('/api/contact', {
			method: 'POST',
			body: new FormData(formElement)
		});
		const data = await response.json();

		if (!data.success && data.errors) {
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
		onclick={self(handleClose)}
		onkeydown={self(handleClose)}
		role="button"
		tabindex="0"
		transition:fade={{ duration: 200 }}
	>
		<form bind:this={formElement} onsubmit={handleSubmit}>
			<div class="close">
				<CloseButton onclick={handleClose} />
			</div>
			<Input name="name" label="Name" errors={errors?.name} />
			<Input name="email" label="E-mail" errors={errors?.email} />
			<Textarea name="message" label="Message" errors={errors?.message} />
			<Turnstile siteKey={PUBLIC_CF_SITE_KEY} theme="light" />
			<div class="buttons">
				<Button type="submit" label="Send" {loading} />
			</div>
		</form>
	</div>
{/if}

<style lang="scss">
	@use './contactForm.scss';
</style>
