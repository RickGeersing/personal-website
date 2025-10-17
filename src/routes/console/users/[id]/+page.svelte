<script lang="ts">
	import UserDetail from '$src/lib/client/components/user-detail/userDetail.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<UserDetail user={data.user} />
