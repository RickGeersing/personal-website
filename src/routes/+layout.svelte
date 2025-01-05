<script lang="ts">
	import '$lib/scss/fonts.scss';
	import '$lib/scss/globals.scss';
	import ContactForm from '$lib/components/contact-form/contactForm.svelte';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let showContact = writable(false);

	setContext('showContact', showContact);
</script>

<svelte:head>
	<link rel="preload" href="/fonts/NewAmsterdam-Regular.woff2" as="font" crossorigin="anonymous" />
	<link rel="preload" href="/fonts/NewAmsterdam-Regular.woff" as="font" crossorigin="anonymous" />
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<main>
	{@render children?.()}
</main>

<ContactForm bind:open={$showContact} />
