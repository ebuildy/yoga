include .env
export

VERSION ?= $(shell cat ./VERSION)
RELEASE_HOME ?= /home/hdfs/yoga
RELEASE_PATH ?= /home/hdfs/yoga/${VERSION}

dev/init/server:
	cd server && pipenv install

dev/init/ui:
	cd ui && yarn install

dev/run/server:
	-pipenv shell
	YOGA_YARN_API_URL=${YOGA_YARN_API_URL} python server/server.py --debug=true foreground

dev/run/ui:
	cd ui && yarn start

build:
	cd ui && PUBLIC_URL=/static/ yarn build

ci/release/dev:
	$(foreach h,$(DEPLOY_HOST_DEV),RELEASE_PATH=${RELEASE_PATH} RELEASE_HOME=${RELEASE_HOME} ./devops/bin/release.sh $(h);)

ci/release/prod:
	$(foreach h,$(DEPLOY_HOST_PROD),RELEASE_PATH=${RELEASE_PATH} RELEASE_HOME=${RELEASE_HOME} ./devops/bin/release.sh $(h);)
