import type { Component } from 'svelte';
import type { ComponentMetadata, ComponentRender } from '../types/components.js';
import { removeShikiComments, addPathComment, addDependenciesComments } from './sourceProcessor.js';
import highlighter from './codePreview.js';

interface ComponentImports {
	compiled: Record<string, Component>;
	source: Record<string, string>;
}

// Lazy load imports
let imports: ComponentImports | null = null;

function getImports(): ComponentImports {
	if (!imports) {
		imports = {
			compiled: import.meta.glob(
				['/src/lib/components/**/*.svelte', '!/src/lib/components/ui/**/*.svelte'],
				{
					eager: true,
					import: 'default'
				}
			) as Record<string, Component>,

			source: import.meta.glob(
				['/src/lib/components/**/*.svelte', '!/src/lib/components/ui/**/*.svelte'],
				{
					query: '?raw',
					eager: true,
					import: 'default'
				}
			) as Record<string, string>
		};
	}
	return imports;
}

function buildComponentPath(directory: string, componentName: string): string {
	return `/src/lib/components/${directory}/${componentName}.svelte`;
}

function createEmptyComponentMetadata(componentName: string, path: string): ComponentMetadata {
	return {
		id: componentName,
		path,
		code: {
			copyable: { content: '' },
			preview: { content: '' },
			highlighted: { content: '' }
		}
	};
}

async function processComponentSource(rawSource: string, path: string) {
	const cleanedSource = removeShikiComments(rawSource);
	const sourceWithDeps = addDependenciesComments(cleanedSource);
	const previewSource = addPathComment(addDependenciesComments(rawSource), path);
	const highlightedSource = await highlighter(previewSource);

	return {
		copyable: { content: sourceWithDeps },
		preview: { content: previewSource },
		highlighted: { content: highlightedSource }
	};
}

export async function getCompiledComponent(path: string): Promise<Component | null> {
	const { compiled } = getImports();
	return compiled[path] ?? null;
}

export async function getComponentSource(
	directory: string,
	componentName: string
): Promise<ComponentMetadata> {
	const path = buildComponentPath(directory, componentName);
	const { source } = getImports();
	const rawSource = source[path];

	const metadata = !rawSource
		? createEmptyComponentMetadata(componentName, path)
		: {
				id: componentName,
				path,
				code: await processComponentSource(rawSource, path)
			};

	return metadata;
}

export async function fetchComponentsFromAPI(
	fetchFn: typeof fetch,
	directory: string
): Promise<ComponentMetadata[]> {
	const response = await fetchFn(`/api/v1/components/${directory}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch components: ${response.statusText}`);
	}

	const components = (await response.json()) as ComponentMetadata[];
	return components;
}

export async function createComponentRender(metadata: ComponentMetadata): Promise<ComponentRender> {
	const component = await getCompiledComponent(metadata.path);
	if (!component) {
		throw new Error(`Component not found: ${metadata.path}`);
	}

	const render: ComponentRender = {
		render: component,
		...metadata
	};

	return render;
}
