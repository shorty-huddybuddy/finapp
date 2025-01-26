package main

import (
	"fmt"
	"net/http"
	"os"
	"backend/routes"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Set your Clerk Secret Key
	clerk.SetKey(os.Getenv("CLERK_SECRET_KEY"))

	// Print Clerk Secret Key for debugging
	fmt.Println("Clerk Secret Key:", os.Getenv("CLERK_SECRET_KEY"))
	fmt.Println("GEMINI API KEY", os.Getenv("GEMINI_API_KEY"))

	// Create a new HTTP server multiplexer
	mux := http.NewServeMux()

	// Register routes
	routes.RegisterRoutes(mux)

	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},         // Frontend origin
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},  // Allowed HTTP methods
		AllowedHeaders: []string{"Content-Type", "Authorization"}, // Allowed headers
	})

	// Start the server with CORS middleware
	fmt.Println("Server is running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", corsHandler.Handler(mux)); err != nil {
		panic("Failed to start server: " + err.Error())
	}
}
