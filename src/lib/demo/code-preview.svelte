<script lang="ts">
	let { code }: { code: string } = $props();
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<div class="no-scrollbar w-fit overflow-auto">
	{@html code}
</div>

<style lang="postcss">
	:global(pre.shiki) {
		@apply h-full overflow-auto rounded-md px-2 py-4 text-left text-sm;
	}

	:global(html.dark .shiki),
	:global(html.dark .shiki span) {
		color: var(--shiki-dark) !important;
		background-color: transparent !important;
	}

	:global(.shiki .shiki-collapsible-content) {
		display: inline;
		&.hidden {
			display: none;
		}

		& .line {
			display: block;
		}
	}

	:global(.shiki .shiki-collapsible-toggle) {
		cursor: pointer;
		color: var(--shiki-dark);
		text-decoration: underline;
		position: relative;
	}
</style>
