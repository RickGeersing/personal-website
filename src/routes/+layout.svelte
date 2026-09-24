<script lang="ts">
	import '$client/scss/fonts.scss';
	import '$client/scss/globals.scss';
	import ContactForm from '$client/components/contact-form/contactForm.svelte';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import newAmsterdamFont from '$client/assets/NewAmsterdam-Regular.woff2?url';
	import siteIcon from '$client/assets/favicon.ico?url';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let showContact = writable(false);

	setContext('showContact', showContact);
</script>

<svelte:head>
	<link rel="icon" href={siteIcon} />
	<link rel="preload" href={newAmsterdamFont} as="font" type="font/woff2" crossorigin="anonymous" />
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<main>
	{@render children?.()}
</main>

<ContactForm bind:open={$showContact} />
