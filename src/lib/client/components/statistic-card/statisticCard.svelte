<script lang="ts">
	type Props = {
		subtitle: string;
		title: string;
		description: string;
	};

	let { subtitle, title, description }: Props = $props();
</script>

<div class="statistic-card">
	<h3>{subtitle}</h3>
	<h2>{title}</h2>
	<p>{description}</p>
</div>

<style lang="scss">
	@use '../../scss/variables.scss' as *;

	.statistic-card {
		display: flex;
		flex-direction: column;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		padding: 1rem;

		h2,
		h3,
		p {
			margin: 0;
		}

		h2 {
			font-size: 2rem;
			font-family: $font-main;
		}
	}
</style>
