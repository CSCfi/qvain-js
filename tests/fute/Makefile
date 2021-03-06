# ADD_LICENSE_HEADER
SHELL:=/bin/bash
PYTHON_CMD:=source venv/bin/activate && source .secrets && python3
UNAME_S := $(shell uname -s)


all: venv check

venv:
	@python3 -m venv venv
	@source venv/bin/activate && pip3 install https://github.com/CSCfi/tauhka/archive/master.zip
	@source venv/bin/activate && pip3 install -r requirements.txt

chromedriver:
ifeq ($(UNAME_S),Linux)
	@curl -O https://chromedriver.storage.googleapis.com/78.0.3904.105/chromedriver_linux64.zip
	@unzip chromedriver_linux64.zip
endif
ifeq ($(UNAME_S),Darwin)
	@curl -O https://chromedriver.storage.googleapis.com/78.0.3904.105/chromedriver_mac64.zip
	@unzip chromedriver_mac64.zip
endif

.secrets:
	@cp .secrets.template .secrets

clean:
	@rm -f chromedriver
	@rm -f chromedriver_*.zip
	@rm -rf venv
	@rm -rf __pycache__
	@rm -rf views/__pycache__

check: .secrets venv chromedriver
	@venv/bin/pycodestyle --show-source --show-pep8 .  --exclude=venv
	@$(PYTHON_CMD) -m unittest discover

recheck:
	@rm -rf venv
	@rm -rf __pycache__
	@rm -rf views/__pycache__
	@make check
