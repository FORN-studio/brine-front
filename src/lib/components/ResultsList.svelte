<script>

    import Result from '$lib/components/Result.svelte';
    import { flip } from 'svelte/animate';
    import { slide } from 'svelte/transition';

    let { results } = $props();

</script>

<div class="results-list">
    {#each results as result, index (result.id)}
        <div class="result" transition:slide={{ duration: 300, axis: 'y', delay: index * 100 }}>
            <Result {result} />
        </div>
    {/each}
</div>

<style lang="scss">

    .results-list {
        margin: 2rem auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 600px;
        max-width: 100vw;
        padding: 1rem;
    }

</style>