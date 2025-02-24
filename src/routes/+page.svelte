<script lang="ts">
	import Button from '$client/components/button/button.svelte';
	import Game from '$client/components/game/game.svelte';
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import LinkedInLink from '$client/components/linkedin-link/linkedInLink.svelte';
	import GithubLink from '$client/components/github-link/githubLink.svelte';
	import MetaTags from '$client/components/meta-tags/metaTags.svelte';

	const showContact = getContext<Writable<boolean>>('showContact');

	function handleClick() {
		showContact.set(true);
	}
</script>

<MetaTags
	title="Rick Geersing – Software Developer"
	description="Personal website of Rick Geersing, a passionate software developer dedicated to innovative and efficient solutions."
/>

<div class="hero">
	<div class="background">
		<Game />
	</div>
	<div class="content">
		<h1>Rick Geersing</h1>
		<h2>Software Developer</h2>
		<Button label="Get in contact" onclick={handleClick} />
		<div class="socials">
			<LinkedInLink />
			<GithubLink />
		</div>
	</div>
</div>

<style lang="scss">
	@mixin breakpoint($point, $type: max, $direction: width) {
		@media only screen and (#{$type}-#{$direction}: $point) {
			@content;
		}
	}

	.hero {
		position: relative;
		height: 100vh;
		width: 100%;

		.content {
			position: absolute;
			height: 100%;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			pointer-events: none;
			gap: 5px;

			h1 {
				margin: 0;
				font-weight: 400;
				line-height: 75px;
				user-select: none;
				font-size: 120px;
				text-align: center;

				@include breakpoint(768px) {
					font-size: 80px;
					line-height: 50px;
				}

				@include breakpoint(480px) {
					font-size: 60px;
					line-height: 40px;
				}
			}

			h2 {
				margin: 0;
				font-family: 'Montserrat', sans-serif;
				user-select: none;
				font-size: 45px;

				@include breakpoint(768px) {
					font-size: 30px;
				}

				@include breakpoint(480px) {
					font-size: 20px;
				}
			}

			:global(button) {
				pointer-events: auto;
			}

			.socials {
				margin-top: 20px;
				display: flex;
				flex-direction: row;
				gap: 10px;
				pointer-events: auto;
			}
		}
	}
</style>
