ARTEFACT_DIRECTORY := $(PROJECT_ROOT)/output
BUILD_DIRECTORY := $(ARTEFACT_DIRECTORY)/build
PACKAGE_DIRECTORY := $(ARTEFACT_DIRECTORY)/package

build: env clean ## Compile and package the code
	npx webpack --config webpack.config.js

clean: ## remove output
	rm -rf $(ARTEFACT_DIRECTORY)

lint: ## linting
	npx eslint .

unit: ## testing 
	npx jest
