<script lang="ts">
	type MetaTags = {
		title: string;
		description: string;
	};

	let { title, description }: MetaTags = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="Rick Geersing, Software Developer, Web Developer, Frontend Developer, Backend Developer, Full Stack Developer, Developer, Programmer"
	/>
</svelte:head>
