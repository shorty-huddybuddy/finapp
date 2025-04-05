# Use the official Golang image
FROM golang:1.23.5 as builder

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum first (for caching)
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of your backend code
COPY . .

# 👇 Copy the API key into the container
COPY api_key.json /app/api_key.json

# Build the Go application
RUN go build -o server .

# Expose the port your app listens on
EXPOSE 8080

# Run the binary
CMD ["./server"]
