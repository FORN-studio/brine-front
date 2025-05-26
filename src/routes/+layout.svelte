<script>
	import '$lib/scss/reset.scss';
	import '$lib/scss/main.scss';
	let { children } = $props();
</script>

<div class="layout">
	{@render children()}
</div>
