import {$out} from './common'
import {fileExists, getFile} from '@snickbit/node-utilities'
import ejs from 'ejs'
import path from 'path'

export function template(name: string, data?: any) {
	const file_path = path.join(__dirname, '..', 'templates', `${name}`)

	if (fileExists(file_path)) {
		$out.verbose('Rendering raw file template', name)
		return getFile(file_path)
	} else if (fileExists(`${file_path}.template`)) {
		$out.verbose('Rendering template file', name)
		return getFile(`${file_path}.template`)
	} else if (fileExists(`${file_path}.ejs`)) {
		$out.verbose('Rendering ejs file', name, data)
		return ejs.render(getFile(`${file_path}.ejs`), data)
	}
}
