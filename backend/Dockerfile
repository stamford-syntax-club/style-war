FROM golang:alpine as build-base

WORKDIR /app

COPY . .

RUN go mod download && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ./out/stylewars main.go

# Optimize Image Size
FROM --platform=linux/amd64 alpine:3.16.2

WORKDIR /app

COPY --from=build-base /app/out/stylewars ./

EXPOSE 8080

CMD ["./stylewars"]
