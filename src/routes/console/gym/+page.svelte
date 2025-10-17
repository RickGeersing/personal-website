<script lang="ts">
	import StatisticCard from '$src/lib/client/components/statistic-card/statisticCard.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { nl } from 'date-fns/locale';
	import 'chartjs-adapter-date-fns';

	import Chart from 'chart.js/auto';

	let { data }: { data: PageData } = $props();

	let populairExercisesCanvas: HTMLCanvasElement;

	// const groupedData = {};
	// data.stats.populairExercises.forEach(({ name, weight, startDate }) => {
	// 	if (!groupedData[name]) {
	// 		groupedData[name] = { label: name, data: [], borderWidth: 2 };
	// 	}
	// 	groupedData[name].data.push({ x: date, y: weight });
	// });

	const populairExercisesData = data.stats.populairExercises.reduce(
		(
			acc: Record<
				string,
				{ label: string; data: { x: unknown; y: unknown }[]; borderWidth: number }
			>,
			{ name, weight, startDate }
		) => {
			console.log(startDate);
			if (!acc[name]) {
				acc[name] = { label: name, data: [], borderWidth: 2 };
			}
			acc[name].data.push({ x: new Date(startDate), y: weight });
			return acc;
		},
		{}
	);

	const datasets = Object.values(populairExercisesData);

	function totalSessionDescription(difference: number) {
		if (difference > 0) {
			return `This is ${difference} more than last month`;
		} else if (difference < 0) {
			return `This is ${Math.abs(difference)} less than last month`;
		} else {
			return `This is the same as last month`;
		}
	}

	function totalWeightLiftedDescription(difference: number) {
		return difference > 0
			? `+${difference.toLocaleString('nl-NL')} kg from last month`
			: `-${Math.abs(difference).toLocaleString('nl-NL')} kg from last month`;
	}

	let populairExercisesChart;

	onMount(() => {
		populairExercisesChart = new Chart(populairExercisesCanvas, {
			type: 'line',
			data: {
				datasets: datasets.map((dataset, index) => ({
					...dataset,
					borderColor: `hsl(${index * 90}, 70%, 50%)`, // Unique color per exercise
					fill: false
				}))
			},
			options: {
				responsive: true,
				scales: {
					x: {
						type: 'time',
						time: {
							unit: 'week'
						},
						adapters: {
							date: {
								locale: nl
							}
						}
					},
					y: {
						ticks: {
							callback: (value) => `${value} kg`
						}
					}
				}
			}
		});
	});
</script>

<div class="stats">
	<StatisticCard
		subtitle="Total sessions"
		title={(data?.stats?.sessions?.current || 0).toString()}
		description={totalSessionDescription(data?.stats?.sessions?.difference || 0)}
	/>

	<StatisticCard
		subtitle="Total weight lifted"
		title={`${(data?.stats?.weightLifted?.current || 0).toLocaleString('nl-NL')} kg`}
		description={totalWeightLiftedDescription(data?.stats?.weightLifted?.difference || 0)}
	/>

	<StatisticCard
		subtitle="Most trained muscle"
		title={data?.stats?.mostTrainedMuscle?.name || 'None'}
		description={`${data?.stats?.mostTrainedMuscle?.count || 0} times this month`}
	/>

	<StatisticCard
		subtitle="Strongest exercise"
		title={data?.stats?.strongestExercise?.name || 'None'}
		description={`${data?.stats?.strongestExercise?.weight || 0} kg max weight`}
	/>
</div>

<div class="charts">
	<canvas class="populair-exercises" bind:this={populairExercisesCanvas}></canvas>
</div>

<style lang="scss">
	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		grid-gap: 1rem;
		padding: 4rem 3rem;
	}
</style>
