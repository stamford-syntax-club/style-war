dev:
	go run main.go

test:
	go clean -testcache && go test --race -v ./...

coverage:
	go clean -testcache && go test -coverprofile=coverage.out ./... && go tool cover -html=coverage.out -o coverage.html && open coverage.html

build:
	docker build -t stylewars .

run-docker:
	docker run --rm -p 8080:8080 -v ./.env.local.docker:/app/.env stylewars

