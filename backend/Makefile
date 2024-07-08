dev:
	go run main.go

test:
	go clean -testcache && go test --race -v ./...

coverage:
	go clean -testcache && go test -coverprofile=coverage.out ./... && go tool cover -html=coverage.out -o coverage.html && open coverage.html
