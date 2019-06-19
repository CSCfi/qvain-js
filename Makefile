all:
	npm run build

security: dependency-check
	./dependency-check/bin/dependency-check.sh --format JSON --format HTML --scan . --enableExperimental --disableOssIndex --prettyPrint --failOnCVSS 1

dependency-check:
	curl -sLS "https://bintray.com/jeremy-long/owasp/download_file?file_path=dependency-check-5.0.0-release.zip" > dependency-check-5.0.0-release.zip
	unzip dependency-check-5.0.0-release.zip
