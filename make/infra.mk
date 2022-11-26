STACK_PREFIX = $(ENV)-$(APPLICATION_NAME)
ARTEFACT_DIRECTORY := $(PROJECT_ROOT)/output
MAIN_STACK = $(STACK_PREFIX)-main

TAGS_INPUT_FILE := $(PROJECT_ROOT)/tags/tags.env
TAGS_OUTPUT_FILE := $(ARTEFACT_DIRECTORY)/tags.env

CDK_DEFAULT_ACCOUNT = $(AWS_ACCOUNT) 

API_URL = https://$(API_DOMAIN_NAME)

env:
	$(eval export TAGS_OUTPUT_FILE=$(TAGS_OUTPUT_FILE))
	$(eval export HOSTED_ZONE_NAME=$(HOSTED_ZONE_NAME))
	$(eval export MAIN_STACK=$(MAIN_STACK))
	$(eval export API_DOMAIN_NAME=$(API_DOMAIN_NAME))
	$(eval export ARTEFACT_DIRECTORY=$(ARTEFACT_DIRECTORY))
	$(eval export PACKAGE_DIRECTORY=$(PACKAGE_DIRECTORY))
	$(eval export API_ALLOWED_CORS_ORIGINS=$(API_ALLOWED_CORS_ORIGINS))
	$(eval export CDK_DEFAULT_REGION=$(CDK_DEFAULT_REGION))
	$(eval export CDK_DEFAULT_ACCOUNT=$(CDK_DEFAULT_ACCOUNT))
	
	
list: env
	npx cdk list

bootstrap: env
	npx cdk bootstrap aws://$(CDK_DEFAULT_ACCOUNT)/$(CDK_DEFAULT_REGION)

deploy: env ## Deploy all resources
	npx cdk deploy --stack-name $(MAIN_STACK) --require-approval never "*"
	

describe: env # describe the deployed stack
	@aws cloudformation describe-stacks \
		--stack-name $(MAIN_STACK) \
		--query "Stacks[0].Outputs[*].[OutputValue]" \
		--output text \
	| sed s/DescribeStacks/$(MAIN_STACK)/

destroy: env## Remove AWS resources
	npx cdk destroy --force "*"

destroy-%: # Clean up a specific stack
	npx cdk destroy --force "$(STACK_PREFIX)-$*"

diff: # Show differences 
	npx cdk diff

synth-%: # Generate the CloudFormation
	npx cdk synth "$(STACK_PREFIX)-$*"
