CONTAINER_PROVISIONER_NAME=provisioner

.PHONY: help run install desinstall build prepare lint prettier migrate seed drop-db test

help:
	@cat banner.txt
	@echo "### Welcome to the provisioner Makefile! ###"
	@echo " 	-> 'make help'"
	@echo " 	-> 'make build'" to run docker-compose and prepare the provisioner
	@echo " 	-> 'make run'" to start the provisioner
	@echo " 	-> 'make install'" to install the provisioner
	@echo " 	-> 'make prepare'" to run Husky
	@echo " 	-> 'make lint'" to run ESLint
	@echo " 	-> 'make prettier'" to run Prettier
	@echo " 	-> 'make migrate'" to run migrations
	@echo " 	-> 'make seed'" to run seeds
	@echo " 	-> 'make drop-db'" to drop the database
	@echo " 	-> 'make test'" to run tests 
	@echo " 	-> 'make desinstall'" to desinstall the provisioner 

run:
	@echo "Starting provisioner..."
	docker exec -it $(CONTAINER_PROVISIONER_NAME) npm run start:dev -- --host 0.0.0.0
	@echo "Provisioner started! Playground: http://localhost:3000/graphql"

desinstall:
	@echo "Desistalling provisioner..."
	docker compose down --rmi all
	@echo "Provisioner desinstalled!"

build:
	@echo "Building provisioner..."
	docker compose up -d --build
	docker buildx prune -f
	@echo "Provisioner built! To install the provisioner, use 'make install'. For more information: 'make help'"

install:
	@echo "Installing dependencies..."
	docker exec -it $(CONTAINER_PROVISIONER_NAME) npm install
	@echo "Dependencies installed!"
	@echo "Running migrations..."
	docker exec -it $(CONTAINER_PROVISIONER_NAME) npm run db:migrate
	@echo "Migrations ran!"
	@echo "Running seeds..."
	docker exec -it $(CONTAINER_PROVISIONER_NAME) npm run db:seed
	@echo "Seeds ran!"
	@echo "Provisioner installed!"
	@echo "Use 'make run' to start the provisioner. For more information: 'make help'"

prepare:
	@echo "[Husky] > Scanning..."
	docker exec -it $(CONTAINER_PROVISIONER_NAME) npm run prepare
	@echo "[Husky] > Done"

lint:
	@echo "[ESLint] > Linting..."
	docker exec -it $(CONTAINER_PROVISIONER_NAME) npm run lint
	@echo "[ESLint] > Done"

prettier:
	@echo "[Prettier] > Formatting..."
	docker exec -it $(CONTAINER_PROVISIONER_NAME) npm run format
	@echo "[Prettier] > Done"

migrate:
	@echo "Running migrations..."
	docker exec -it $(CONTAINER_PROVISIONER_NAME) npm run db:migrate
	@echo "Migrations ran!"

seed:
	@echo "Running seeds..."
	docker exec -it $(CONTAINER_PROVISIONER_NAME) npm run db:seed
	@echo "Seeds ran!"

drop-db:
	@echo "Dropping database..."
	docker exec -it $(CONTAINER_PROVISIONER_NAME) npm run db:drop
	@echo "Database dropped!"

test:
	@echo "Running tests..."
	docker exec -it $(CONTAINER_PROVISIONER_NAME) npm run test
	@echo "Tests ran!"