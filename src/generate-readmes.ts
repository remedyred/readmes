import {$out, Config, ReadmeConfig, ReadmePackage, WorkspacePackage} from './common'
import {interpolate, slugify} from '@snickbit/utilities'
import {getFile, saveFile} from '@snickbit/node-utilities'
import {template} from './template'
import path from 'path'
import upwords from '@snickbit/upwords'
import fg from 'fast-glob'

enum SECTIONS {
	prefix = 'readmes',
	toc = 'toc',
	description = 'description',
	packages = 'packages'
}

const tag = (name: string, start: boolean) => `<!--${start ? 'START' : 'END'}_SECTION:${SECTIONS.prefix}-${name}-->`
const section = (name: string, text: string) => `${tag(name, true)}\n${text}\n${tag(name, false)}`
export const packageReadmeRegex = /^# (?<name>.*?)$[^]*<!--START_SECTION:readmes-description-->\s*(?<description>[^]*?)\s*<!--END_SECTION:readmes-description-->/gm

export default async function(config: Config): Promise<void> {
	for (let [workspace, readmeConfig] of Object.entries(config)) {
		$out.info('Processing workspace:', workspace, readmeConfig)
		readmeConfig.root = path.resolve(readmeConfig.root || workspace)

		const workspaceReadmeFile = path.join(readmeConfig.root, 'README.md')
		let workspaceReadme = getFile(workspaceReadmeFile)

		if (!workspaceReadme) {
			$out.error(`No README.md found in workspace: ${workspace} (${workspaceReadmeFile})`)
			continue
		}

		const {workspacePackages, categories} = await getWorkspace(workspace, readmeConfig)

		if (!workspacePackages.length) {
			$out.force.warn('No packages found')
			continue
		}

		const repoUrlTemplate = readmeConfig.repoUrlTemplate || 'https://github.com/{{repo}}/tree/main/{{packagePath}}'
		const readmePackages = ['']
		const shownCategories = []
		for (let pkg of workspacePackages) {
			const workspacePackage: WorkspacePackage = {
				...pkg,
				packagePath: path.dirname(pkg.path)
			}

			if (!shownCategories.includes(workspacePackage.category)) {
				shownCategories.push(workspacePackage.category)
				readmePackages.push(`## ${upwords(workspacePackage.category)}`)
			}

			workspacePackage.repoUrl = interpolate(repoUrlTemplate, workspacePackage)
			readmePackages.push(template('category.md', workspacePackage))
		}

		const toc = generateToc(workspacePackages, categories)

		workspaceReadme = workspaceReadme
			.replace(new RegExp(section('toc', '([^]*)')), section('toc', toc))
			.replace(new RegExp(section('packages', '([^]*)')), section('packages', readmePackages.join('\n')))

		$out.debug(`Saving ${workspaceReadmeFile}`)
		saveFile(workspaceReadmeFile, workspaceReadme)
	}
}

export function readmeHasDescription(readme: string): boolean {
	return readme && String(readme).includes(tag(SECTIONS.description, true))
}

export async function getWorkspace(workspace: string, readmeConfig: ReadmeConfig): Promise<{workspacePackages: ReadmePackage[]; categories: Set<string>}> {
	const files = await fg(readmeConfig.packages.map(glob => !glob.endsWith('README.md') ? `${glob}/README.md` : glob))

	files.sort()

	const workspacePackages: ReadmePackage[] = []
	const categories = new Set<string>()

	for (let file of files) {
		$out.debug('Processing readme file', file)
		const readme: string = getFile(file)

		if (readmeHasDescription(readme)) {
			$out.debug('Checking for package description with readme regex', packageReadmeRegex)

			const packageDescriptions = readme.matchAll(packageReadmeRegex)

			for (let packageDescription of packageDescriptions) {
				$out.debug('Found package description', packageDescription)
				const {groups} = packageDescription
				if (!groups) {
					$out.warn('No groups found')
					continue
				}
				const name = groups?.name.trim()
				let category = file.replace(/.*?\/?([^\\/]+)\/?[^\\/]+\/README\.md$/gm, '$1')

				if (readmeConfig.renameCategories) {
					category = readmeConfig.renameCategories[category] || category
				}

				categories.add(category)

				const readmePackage: ReadmePackage = {
					name,
					path: file.replace(new RegExp(`^${readmeConfig.root}/`), ''),
					workspace,
					description: groups?.description.trim(),
					category,
					repo: readmeConfig.repo
				}

				workspacePackages.push(readmePackage)
			}
		} else {
			$out.warn(`No package description found in ${file}`, {packageReadmeRegex})
		}
	}

	return {
		workspacePackages,
		categories
	}
}

function generateToc(workspacePackages, categories): string {
	const toc = ['', '## Table of Contents', '']
	const tocCategories = categories.size > 1
	for (let category of categories) {
		if (tocCategories) {
			toc.push(`* [${upwords(category)}](#${slugify(category)})`)
		}
		const categoryPackages = workspacePackages.filter(pkg => pkg.category === category)
		for (let pkg of categoryPackages) {
			toc.push(`  - [${pkg.name}](#${slugify(pkg.name)})`)
		}
	}
	toc.push('')

	return toc.join('\n')
}
