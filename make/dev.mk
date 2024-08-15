ARTEFACT_DIRECTORY := $(PROJECT_ROOT)/dist
BUILD_DIRECTORY := $(ARTEFACT_DIRECTORY)/build
PACKAGE_DIRECTORY := $(ARTEFACT_DIRECTORY)

build: env clean ## Compile and package the code
	node build.js

clean: ## remove output
	rm -rf $(PACKAGE_DIRECTORY)

lint: ## linting
	npx eslint .

unit: ## testing 
	npx jest
