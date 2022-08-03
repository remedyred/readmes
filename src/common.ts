import {Out} from '@snickbit/out'

export const $out = new Out('readmes')

export type ReadmePath = string

export type Config = Record<ReadmePath, ReadmeConfig>

export interface ReadmeConfig {

	/** Workspace root directory */
	root?: string

	/** globs to search for readme files */
	packages: string[]

	/** the repo to use for the readme */
	repo?: string

	/** rename categories */
	renameCategories?: Record<string, string>

	/** Repo url template */
	repoUrlTemplate?: string
}

export interface ReadmePackage {
	name: string
	path: string
	workspace: string
	description: string
	category: string
	repo: string
}

export interface WorkspacePackage extends ReadmePackage {
	packagePath: string
	repoUrl?: string
}
