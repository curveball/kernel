SOURCE_FILES:=$(shell find src/ -type f -name '*.ts')
VERSION:=$(shell node -e "process.stdout.write(require('./package.json').version)")

.PHONY:all
all: build

.PHONY:build
build: cjs/build esm/build

.PHONY:test
test:
	npx nyc mocha

.PHONY:test-cjs
test-cjs:
	mkdir -p cjs-test
	cd test; npx tsc --module commonjs --outdir ../cjs-test
	echo '{"type": "commonjs"}' > cjs-test/package.json
	cd cjs-test; npx mocha --no-package --r ../test/polyfills.cjs

.PHONY:lint
lint:
	npx eslint --quiet 'src/**/*.ts' 'test/**/*.ts'

.PHONY:lint-fix
lint-fix: fix

.PHONY:fix
fix:
	npx eslint --quiet 'src/**/*.ts' 'test/**/*.ts' --fix

.PHONY:watch
watch:
	npx tsc --watch

.PHONY:start
start: build

.PHONY:clean
clean:
	rm -r dist esm cjs cjs-test

cjs/build: $(SOURCE_FILES)
	npx tsc --module commonjs --outDir cjs/
	sed -i 's/const VERSION.*$$/const VERSION = '\''Curveball\/$(VERSION) \(cjs\)'\'';/g' cjs/application.js
	echo '{"type": "commonjs"}' > cjs/package.json
	@# Creating a small file to keep track of the last build time
	touch cjs/build


esm/build: $(SOURCE_FILES)
	npx tsc --module es2022 --outDir esm/
	sed -i 's/const VERSION.*$$/const VERSION = '\''Curveball\/$(VERSION) \(esm\)'\'';/g' esm/application.js
	echo '{"type": "module"}' > esm/package.json
	@# Creating a small file to keep track of the last build time
	touch esm/build
