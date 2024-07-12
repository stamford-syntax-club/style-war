FROM golang:alpine as build-base

WORKDIR /app

COPY . .

RUN go mod download && CGO_ENABLED=0 GOOS=linux go build -o ./out/stylewars main.go

# Optimize Image Size
FROM alpine:3.16.2

WORKDIR /app

COPY --from=build-base /app/out/stylewars ./

EXPOSE 8080

CMD ["sh", "-c", "./stylewars"]
