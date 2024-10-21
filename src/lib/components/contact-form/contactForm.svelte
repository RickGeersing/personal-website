<script lang="ts">
	import { fade } from 'svelte/transition';
	import Button from '../button/button.svelte';
	import Input from '../input/input.svelte';
	import Textarea from '../textarea/textarea.svelte';
	import CloseButton from '../close-button/closeButton.svelte';

	export let open = true;

	let loading = false;
	let formElement: HTMLFormElement | undefined;

	function handleClose() {
		open = false;
	}

	async function handleSubmit(e: SubmitEvent) {
		loading = true;

		const response = await fetch('/api/contact', {
			method: 'POST',
			body: new FormData(formElement)
		}).then((res) => res.json());
		

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
			<Input name="name" label="Name" />
			<Input name="email" label="E-mail" />
			<Textarea name="message" label="Message" />
			<div class="buttons">
				<Button label="Send" {loading} />
			</div>
		</form>
	</div>
{/if}

<style lang="scss">
	@import './contactForm.scss';
</style>
