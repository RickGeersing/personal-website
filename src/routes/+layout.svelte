<script>
	import '$lib/scss/globals.scss';
	import ContactForm from '$lib/components/contact-form/contactForm.svelte';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';

	let showContact = writable(false);

	setContext('showContact', showContact);
</script>

<svelte:head>
	<link rel="preload" href="/fonts/NewAmsterdam-Regular.woff2" as="font" crossorigin="anonymous" />
	<link rel="preload" href="/fonts/NewAmsterdam-Regular.woff" as="font" crossorigin="anonymous" />
</svelte:head>

<main>
	<slot></slot>
</main>

<ContactForm bind:open={$showContact} />
