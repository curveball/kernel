SOURCE_FILES:=$(shell find src/ -type f -name '*.ts')
VERSION:=$(shell node -e "process.stdout.write(require('./package.json').version)")

.PHONY:all
all: build

.PHONY:build
build: cjs/build esm/build

.PHONY:test
test:
	node_modules/.bin/nyc node_modules/.bin/mocha

.PHONY:lint
lint:
	node_modules/.bin/eslint --quiet 'src/*.ts' 'test/*.ts'

.PHONY:lint-fix
lint-fix: fix

.PHONY:fix
fix:
	node_modules/.bin/eslint --quiet 'src/**/*.ts' 'test/**/*.ts' --fix

.PHONY:watch
watch:
	node_modules/.bin/tsc --watch

.PHONY:start
start: build

.PHONY:clean
clean:
	rm -r dist esm cjs

cjs/build: $(SOURCE_FILES)
	npx tsc --module commonjs --outDir cjs/
	sed -i 's/const VERSION.*$$/const VERSION = '\''Curveball\/$(VERSION) \(cjs\)'\'';/g' cjs/application.js
	echo '{"type": "commonjs"}' > cjs/package.json
	@# Creating a small file to keep track of the last build time
	touch cjs/build


esm/build: $(SOURCE_FILES)
	npx tsc --module es2022 --outDir esm/
	sed -i 's/const VERSION.*$$/const VERSION = '\''Curveball\/$(VERSION) \(esm\)'\'';/g' cjs/application.js
	echo '{"type": "module"}' > esm/package.json
	@# Creating a small file to keep track of the last build time
	touch esm/build
