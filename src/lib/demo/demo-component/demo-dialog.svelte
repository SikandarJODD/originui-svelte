<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { ComponentRender } from '$lib/types/components.js';
	import { cn } from '$lib/utils.js';
	import Eye from 'lucide-svelte/icons/eye';
	import CodePreview from '../code-preview.svelte';
	import CopyButton from '../copy-button.svelte';
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger
	} from '$lib/components/ui/tooltip/index.js';

	let {
		component,
		allcomponents,
		class: className
	}: {
		component: ComponentRender;
		allcomponents: ComponentRender[];
		class?: string;
	} = $props();
	let nextComponent = () => {
		let currentIndex = allcomponents.findIndex((c) => c.id === component.id);
		let nextIndex = currentIndex + 1;
		if (nextIndex >= allcomponents.length) {
			nextIndex = 0;
		}
		component = allcomponents[nextIndex];
	};
	let prevComponent = () => {
		let currentIndex = allcomponents.findIndex((c) => c.id === component.id);
		let prevIndex = currentIndex - 1;
		if (prevIndex < 0) {
			prevIndex = allcomponents.length - 1;
		}
		component = allcomponents[prevIndex];
	};
	let isBtn = $derived(component.id.split('-')[0] === 'button');
</script>

<Dialog.Root>
	<Dialog.Trigger>
		{@render previewButton()}
	</Dialog.Trigger>
	<Dialog.Content class="max-w-6xl">
		<Dialog.Header>
			<Dialog.Title>Component</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</Dialog.Description>
		</Dialog.Header>
		<div class="mt-2">
			<div class="grid grid-cols-1 gap-4 lg:grid-cols-9">
				<div class="col-span-3 flex w-full items-center justify-center rounded-lg border px-6">
					<div class="{isBtn === true ? '' : 'mx-auto min-w-64'} ">
						{#if component && component.code.copyable.content && component.code.preview.content}
							<component.render />
						{:else}
							<div>
								<p>Component not available</p>
							</div>
						{/if}
					</div>
				</div>
				<div class="relative col-span-6 rounded-lg border px-2">
					{#if component && component.code.copyable.content && component.code.preview.content}
						<div class="absolute right-1 top-1 z-40">
							<CopyButton code={component.code.copyable.content} />
						</div>
					{/if}
					<div class="no-scrollbar relative h-[420px] overflow-auto">
						{#if component && component.code.copyable.content && component.code.preview.content}
							<CodePreview code={component.code.highlighted.content} />
						{:else}
							<div
								class="flex h-48 flex-col items-center justify-center text-center text-sm text-muted-foreground"
							>
								<p>Component not available</p>
								<a
									class="underline hover:text-foreground"
									href="https://github.com/max-got/originui-svelte"
								>
									Create a pull request
								</a>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button onclick={prevComponent} variant="outline">Prev</Button>
			<Button onclick={nextComponent} variant="outline">Next</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

{#snippet previewButton()}
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger
				class="text-muted-foreground/80 hover:bg-transparent hover:text-foreground disabled:opacity-100"
			>
				<Button variant="ghost" size="icon">
					<Eye size={16} />
				</Button>
			</TooltipTrigger>

			<TooltipContent
				class="border border-input bg-popover px-2 py-1 text-xs text-muted-foreground"
			>
				Preview Code
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
{/snippet}
