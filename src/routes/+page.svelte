<script>
	import { search, similar, getRandomId } from '$lib/api';
	import { selection } from '$lib/state.svelte';
	import { slide } from 'svelte/transition';
	import ResultsList from '$lib/components/ResultsList.svelte';

	let query = $state('');

	const handleSearch = async () => {
		if (query.length <= 3) {
			selection.searchResults = [];
			return;
		}

		const res = await search(query);
		selection.searchResults = res.results;
	};

	const debounce = (func, wait) => {
		let debounceTimer;
		return () => {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				func();
			}, wait);
		};
	};

	const randomize = async () => {
		// create a random search string
		const chars = 'abcdefghijklmnopqrstuvwxyz';
		let query = '';
		for (var i = 4; i > 0; --i) query += chars[Math.floor(Math.random() * chars.length)];

		// find the first match for our random string
		const match = await search(query, 1);
		console.log(match);
		const res = await similar(match.results[0].id);
		selection.activeCompany = res.query_company;
		selection.similarCompanies = res.similar_companies;
	};

	const handleDebouncedSearch = debounce(handleSearch, 300);

	$inspect(selection.activeCompany);
</script>

<div class="main">
	<div class="query-container">
		<h1 class="serif">This is <span class="accent">Brine</span></h1>

		<div class="info">
			<span class="icon">
				<svg
					width="20px"
					height="20px"
					stroke-width="1.5"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					color="currentColor"
					><path
						d="M12 11.5V16.5"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path><path
						d="M12 7.51L12.01 7.49889"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path><path
						d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path></svg
				>
			</span>
			<span class="text"> MVP - expect weird behavior </span>
		</div>

		{#if selection.activeCompany}
			<div class="selected-company" transition:slide={{ duration: 300, axis: 'y' }}>
				<span class="label"> Companies similar to </span>
				<div class="company">
					<h2>{selection.activeCompany.company_name.toLowerCase()}</h2>
					<p>
						{selection.activeCompany.company_description.substring(0, 200)}...
					</p>
				</div>
				<div class="controls">
					<button
						class="cancel"
						onclick={() => {
							selection.activeCompany = null;
							selection.similarCompanies = [];
						}}
					>
						<span class="icon">
							<svg
								width="20px"
								height="20px"
								stroke-width="1.5"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								color="currentColor"
								><path
									d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path></svg
							>
						</span>

						<span class="text"> Clear </span>
					</button>
				</div>
			</div>
		{:else}
			<textarea
				transition:slide={{ duration: 300, axis: 'y' }}
				bind:value={query}
				placeholder="Enter your query here"
				oninput={handleDebouncedSearch}
			></textarea>
			<div class="actions" transition:slide={{ duration: 300, axis: 'y' }}>
				<button class="lucky" onclick={randomize}>
					<span class="icon">
						<svg
							width="24px"
							height="24px"
							stroke-width="1"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							color="currentColor"
							><path
								d="M22 6.99999C19 6.99999 13.5 6.99999 11.5 12.5C9.5 18 5 18 2 18"
								stroke="currentColor"
								stroke-width="1"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path><path
								d="M20 5C20 5 21.219 6.21895 22 7C21.219 7.78105 20 9 20 9"
								stroke="currentColor"
								stroke-width="1"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path><path
								d="M22 18C19 18 13.5 18 11.5 12.5C9.5 6.99999 5 7.00001 2 7"
								stroke="currentColor"
								stroke-width="1"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path><path
								d="M20 20C20 20 21.219 18.781 22 18C21.219 17.219 20 16 20 16"
								stroke="currentColor"
								stroke-width="1"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path></svg
						>
					</span>
					<span class="text"> I'm feeling lucky </span>
				</button>
				<button
					class="send"
					aria-label="Search"
					class:disabled={query.length <= 3}
					onclick={handleSearch}
				>
					<span class="icon">
						<svg
							width="24px"
							height="24px"
							viewBox="0 0 24 24"
							stroke-width="1"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							color="currentColor"
							><path
								d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5"
								stroke="currentColor"
								stroke-width="1"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path></svg
						>
					</span>
				</button>
			</div>
		{/if}
	</div>

	<div class="results-container">
		<ResultsList
			results={selection.similarCompanies.length
				? selection.similarCompanies
				: selection.searchResults}
		/>
	</div>
</div>

<style lang="scss">
	@use 'src/lib/scss/variables' as *;

	.main {
		min-height: 100vh;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
	}

	.results-container {
		margin-top: 2rem;
	}

	.query-container {
		padding-top: 20vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: 600px;
		position: sticky;
		top: -20vh;
		background-color: $grey-dark;
		border-radius: 1rem;

		.selected-company {
			inset: 0;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			width: 100%;
			border: solid 1px $grey-border;
			border-radius: 1rem;

			.label {
				font-size: 0.85rem;
				opacity: 0.8;
				padding: 1rem;
				border-bottom: solid 1px $grey-border;
			}

			.company {
				padding: 0.5rem 1rem;

				h2 {
					text-transform: capitalize;
				}

				p {
					font-size: 0.9rem;
					opacity: 0.8;
					margin-top: 0.5rem;
				}
			}

			.controls {
				display: flex;
				flex-direction: row;
				border-top: solid 1px $grey-border;
				padding: 1rem;

				button {
					border-radius: 9999px;
					padding: 0.3rem 0.8rem 0.2rem 0.8rem;
					font-size: 0.9rem;
					background-color: $grey-mid;
					border: solid 1px $grey-border;
					cursor: pointer;
					transition: ease all 300ms;
					display: flex;
					flex-direction: row;
					gap: 0.5rem;

					&:hover {
						background-color: $forn;
						border-color: $forn;
					}
				}
			}
		}

		.info {
			display: flex;
			flex-direction: row;
			align-items: center;
			border: solid 1px $grey-border;
			padding: 0.5rem 0.7rem 0.4rem 0.5rem;
			border-radius: 99999px;
			gap: 0.5rem;
			font-size: 0.9rem;
			opacity: 0.7;
			margin-bottom: 1rem;

			.icon {
				flex-shrink: 0;
			}
		}

		textarea {
			background-color: $grey-mid;
			color: $white;
			padding: 1rem;
			border: solid 1px $grey-border;
			border-radius: 1rem;
			width: 100%;
			padding-bottom: 75px;
			resize: none;
			field-sizing: content;
		}

		.actions {
			display: flex;
			flex-direction: row;
			gap: 1rem;
			justify-content: space-between;
			align-items: center;
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 1rem;
			height: 75px;

			button {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				background-color: $grey-mid;
				border: solid 1px $grey-border;
				border-radius: 1rem;
				padding: 0.5rem 1rem;
				padding-top: 0.4rem;
				gap: 0.5rem;
				transition: ease all 300ms;

				&.disabled {
					pointer-events: none;
					opacity: 0.5;
				}

				&.send:not(.disabled) {
					background-color: $forn;

					.icon {
						color: $white;
					}
				}

				&.lucky:hover {
					background-color: $grey-dark;
				}

				.text {
					font-size: 0.9rem;
					transform: translateY(2px);
				}

				.icon {
					width: 22px;
					height: 22px;
				}
			}
		}

		h1 {
			font-size: 4.5rem;
			margin-bottom: 2rem;
			text-align: center;

			.accent {
				font-family: 'Crimson Text', serif;
				color: $forn;
			}
		}
	}
</style>
