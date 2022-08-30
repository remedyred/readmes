#!/usr/bin/env node
import {$out, Config, ReadmeConfig} from './common'
import {version} from '../package.json'
import {lilconfig} from 'lilconfig'
import {getFileJson} from '@snickbit/node-utilities'
import cli from '@snickbit/node-cli'
import generateReadmes from './generate-readmes'

cli().name('@snickbit/readmes')
	.version(version)
	.run().then(async (/* argv */) => {
		const results = await lilconfig('readmes').search()
		if (!results) {
			$out.fatal('No config found')
		}

		const userConfig = results.config as Config | ReadmeConfig

		let config: Config
		if (isReadmeConfig(userConfig)) {
			const packageName = getFileJson('./package.json').name
			config = {[packageName]: {root: '.', ...userConfig}}
		} else {
			config = userConfig
		}

		if (!config) {
			$out.fatal('No config found')
		}

		await generateReadmes(config)

		$out.done('Done!')
	}).catch(error => $out.fatal('Error:', error))

function isReadmeConfig(userConfig: Config | ReadmeConfig): userConfig is ReadmeConfig {
	return 'packages' in userConfig || 'repo' in userConfig
}
