<script lang="ts">
	import { ToggleGroup as ToggleGroupPrimitive } from 'bits-ui';
	import { getToggleGroupCtx } from '$lib/components/ui/toggle-group/toggle-group.svelte';
	import { cn } from '$lib/utils.js';
	import { type ToggleVariants, toggleVariants } from '$lib/components/ui/toggle.svelte';

	let {
		ref = $bindable(null),
		value,
		class: className,
		size,
		variant,
		...restProps
	}: ToggleGroupPrimitive.ItemProps & ToggleVariants = $props();

	const ctx = getToggleGroupCtx();
</script>

<ToggleGroupPrimitive.Item
	bind:ref
	{value}
	class={cn(
		toggleVariants({
			variant: ctx.variant || variant,
			size: ctx.size || size
		}),
		className
	)}
	{...restProps}
/>
