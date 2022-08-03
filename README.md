# @snickbit/readmes

<!--START_SECTION:readmes-description-->

Minimal monorepo readme generator. Generates a list of packages and attempts to pull their description using readme comment blocks.

**NOTE:** This is primarily for my own use. Use it at your own risk.

<!--END_SECTION:readmes-description-->

## Installation

```bash
pnpm -g add @snickbit/readmes
```

```bash
yarn global add @snickbit/readmes
```

```bash
npm -g add @snickbit/readmes
```

## Configuration

### Configuration Locations

```
readmesrc.json
readmesrc.js
readmesrc.cjs
readmes.config.js
readmes.config.cjs
package.json "readmes" property
```

### Configuration Options

```json
{
	// Globs of packages to include in the readme.
	// Globs should either point to the root of the package or to the README.md file.
	"packages": [
		"packages/*",
		"apps/*"
	],
	// The repo to use for the readme.
	"repo": "github-username/github-repo",
	
	// Your directories will be used as categories
	// You can rename the categories here with key/value pairs.
	"renameCategories": {
		"packages": "libraries"
	},
	
	// If you have a different root directory path, define it here
	"root": "root/directory/path",
	
	// Template to use for linking to files or packages in the repo. 
	// The following variables are available:
	// - `{repo}`: The repo name.
	// - `{packagePath}`: The path to the file or package.
	// - `{name}`: The name of the package from the package.json file.
	// - `{workspace}`: (polyrepo only) The workspace name.
	// - `{category}`: The category of the package, usually the directory name.
	"repoUrlTemplate": "https://github.com/{{repo}}/tree/main/{{packagePath}}"
}
```


### Typical Monorepo

You don't need to define the "packages" configuration if you are using the "typical" monorepo file structure.

```
project
├── packages
│   ├── package-a
│   ├── package-b
│   ├── package-c
│   └── package-d
└── package.json
└── README.md
```

```json
{
	"repo": "snickbit/snickbit.js"
}
```

### Custom Monorepo

If you are using some a different file structure, you can define it in the configuration

```json
{
	"packages": [
		"projects/*",
		"packages/*",
		"path/to/package/directory",
		"path/to/package/README.md"
	]
}
```

### Polyrepo

You can also use this for polyrepo setups, or poly-monorepo setups.

```json
{
	"root": {
		"packages": [
			"*"
		],
		"repo": "."
	},
	"project-a": {
		"packages": [
			"path/to/project-a/package"
		],
		"repo": "project-a"
	},
	"project-b": {
		"packages": [
			"project-b/packages/*"
		],
		"repo": "project-b"
	}
}
```

## Usage

### Package README 

For each package, create your normal README.md file. Then wrap your description with tagged comment blocks.

**START_SECTION:readmes-description**
**END_SECTION:readmes-description**

```markdown
<!--START_SECTION:readmes-description-->

This is my super cool package 

<!--END_SECTION:readmes-description-->
```

### Root README

Then in your **root** package, add comment blocks where you want to insert the packages and table of contents.

**START_SECTION:readmes-toc**
**END_SECTION:readmes-toc**

**START_SECTION:readmes-packages**
**END_SECTION:readmes-packages**

```markdown
<!--START_SECTION:readmes-toc-->

Be careful of what you put in here. It will be erased by the generator!

<!--END_SECTION:readmes-toc-->

<!--START_SECTION:readmes-packages-->

Be careful of what you put in here. It will be erased by the generator!

<!--END_SECTION:readmes-packages-->

```

### Generating the README

Then in the root package, run the generator.

```bash
readmes
```

## License

Copyright (c) 2022 - **Nicholas Lowe** aka **Snickbit**

[MIT License](https://github.com/snickbit/readmes/blob/main/LICENSE)
