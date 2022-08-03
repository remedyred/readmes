import {packageReadmeRegex, readmeHasDescription} from '../src/generate-readmes'

const readme = `
# My Awesome Package

<!--START_SECTION:readmes-description-->

My awesome package is a great package.

<!--END_SECTION:readmes-description-->

## Installation

> npm install my-awesome-package	

> yarn add my-awesome-package

## Documentation

Lorem ipsum dolor sit amet, consectetur adipiscing elit.

## License

MIT
`

describe('Readme', () => {
	describe('readmeHasDescription', () => {
		it('should be a function', () => {
			expect(typeof readmeHasDescription).toBe('function')
		})

		it('should accept a string and return a boolean', () => {
			expect(typeof readmeHasDescription('foo')).toBe('boolean')
		})

		it('should return false if the readme does not contain a description', () => {
			expect(readmeHasDescription('foo')).toBe(false)
		})

		it('should return true if the readme contains a description', () => {
			expect(readmeHasDescription(readme)).toBe(true)
		})
	})

	describe('packageReadmeRegex', () => {
		it('should be a regex object', () => {
			expect(typeof packageReadmeRegex).toBe('object')
		})

		it('should match the readme', () => {
			expect(readme.matchAll(packageReadmeRegex)).toBeTruthy()
		})
	})
})
