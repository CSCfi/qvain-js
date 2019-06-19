SHELL:=/bin/bash

all: lint
	@echo
	@echo "== downloading all npm packages =="
	@cd vendor/validator && npm install --no-audit
	@cd vendor/json-pointer && npm install --no-audit
	@npm install --no-audit
	@echo "== Completed downloading all npm packages =="
	@echo
	@echo "== Build project =="
	@npm run build
	@echo "== Completed Build project =="
	@echo

security: dependency-check
	@echo
	@echo "== OWASP Dependency Check =="
	-@./dependency-check/bin/dependency-check.sh --format JSON --scan . --enableExperimental --disableOssIndex --prettyPrint --failOnCVSS 1 --exclude dependency-check --disableJar --disableNugetconf --disableNuspec --disableAssembly
	@echo "== Completed OWASP Dependency Check =="
	@make audit

lint:
	-@./node_modules/.bin/eslint src  --ext .js

audit:
	@echo
	@echo "== npm audit > . =="
	-@npm audit --parseable
	@echo "== Completed npm audit > . =="
	@echo
	@echo "== npm audit > vendor/validator =="
	-@cd vendor/validator && npm audit --parseable
	@echo "== Completed npm audit > vendor/validator =="
	@echo
	@echo "== npm audit > vendor/json-pointer =="
	-@cd vendor/json-pointer && npm audit --parseable
	@echo "== Completed npm audit > vendor/json-pointer =="
	@echo

dependency-check:
	@echo
	@echo "== Downloading dependency check =="
	@curl -sLS "https://bintray.com/jeremy-long/owasp/download_file?file_path=dependency-check-5.0.0-release.zip" > dependency-check-5.0.0-release.zip
	@unzip dependency-check-5.0.0-release.zip
	@echo "== Completed Downloading dependency check =="
	@echo
