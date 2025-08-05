FROM golang:1.24-alpine AS builder

RUN apk add --no-cache git

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download
RUN go install github.com/pressly/goose/v3/cmd/goose@latest

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix -cgo -o app .

FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata bash

WORKDIR /root/

COPY --from=builder /go/bin/goose /usr/local/bin/goose

COPY --from=builder /app/app .

COPY --from=builder /app/front-end ./front-end

COPY --from=builder /app/sql ./sql
COPY --from=builder /app/migrate.sh ./migrate.sh

RUN chmod +x ./migrate.sh

EXPOSE 8080

CMD ["./app"]
