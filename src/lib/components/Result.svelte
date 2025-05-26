<script>

    import { selection } from "$lib/state.svelte";
    import { similar } from "$lib/api";

    let { result } = $props();

    const select = async () => {
        const res = await similar(result.id)
        selection.activeCompany = res.query_company
        selection.similarCompanies = res.similar_companies
    }

</script>

<div class="result">
    <div class="title">
        <h2 class="serif">{result.company_name.replace('e6', 'æ').toLowerCase()}</h2>
        <button class="compare" onclick={select}>
            More like this
        </button>

    </div>
    <p>{result.description}</p>

    {#if result.website_url}
        <div class="url">
            <span class="icon">
                <svg width="24px" height="24px" stroke-width="1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M14 11.9976C14 9.5059 11.683 7 8.85714 7C8.52241 7 7.41904 7.00001 7.14286 7.00001C4.30254 7.00001 2 9.23752 2 11.9976C2 14.376 3.70973 16.3664 6 16.8714C6.36756 16.9525 6.75006 16.9952 7.14286 16.9952" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 11.9976C10 14.4893 12.317 16.9952 15.1429 16.9952C15.4776 16.9952 16.581 16.9952 16.8571 16.9952C19.6975 16.9952 22 14.7577 22 11.9976C22 9.6192 20.2903 7.62884 18 7.12383C17.6324 7.04278 17.2499 6.99999 16.8571 6.99999" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </span>

            <a href={result.website_url} target="_blank">
                {result.website_url}
            </a>
        </div>
    {/if}
</div>

<style lang="scss">

    @use 'src/lib/scss/variables' as *;

    .result {
        display: flex;
        flex-direction: column;
        border: solid 1px $grey-border;
        border-radius: 1rem;

        .url {
            border-top: solid 1px $grey-border;
            padding: 1rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 1rem;
        }

        .title {
            border-bottom: solid 1px $grey-border;
            padding: 1rem;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            h2 {
                text-transform: capitalize;
            }

            button {
                border-radius: 9999px;
                padding: .3rem .8rem .2rem .8rem;
                font-size: .9rem;
                background-color: $grey-mid;
                border: solid 1px $grey-border;
                cursor: pointer;
                transition: ease all 300ms;

                &:hover {
                    background-color: $forn;
                    border-color: $forn;
                }
            }
        }

        p {
            padding: 1rem;
            white-space: pre-wrap;
            font-size: .9rem;
        }
    }

</style>