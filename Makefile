SOURCE_FILES:=$(shell find src/ -type f -name '*.ts')
VERSION:=$(shell node -e "process.stdout.write(require('./package.json').version)")

.PHONY:all
all: build

.PHONY:build
build: dist/build

.PHONY:test
test:
	npx nyc mocha

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
	rm -rf dist

dist/build: $(SOURCE_FILES)
	npx tsc
	sed -i 's/VERSION = '\''Curveball\/dev.*$$/VERSION = '\''Curveball\/$(VERSION)'\'';/g' dist/application.js
	touch dist/build
