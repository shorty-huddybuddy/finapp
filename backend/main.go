package main

import (
	"backend/routes"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/db"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"google.golang.org/api/option"
)

// Global variable for Firebase Database client
var FirebaseDB *db.Client

// Initialize Firebase
func initFirebase() {
	// Use your Firebase Admin SDK JSON file
	opt := option.WithCredentialsFile("api_key.json")
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("Error initializing Firebase app: %v", err)
	}

	// Initialize Firebase Realtime Database
	FirebaseDB, err = app.DatabaseWithURL(context.Background(), os.Getenv("FIREBASE_DB_URL"))
	if err != nil {
		log.Fatalf("Error initializing Firebase Realtime Database: %v", err)
	}
}

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

	initFirebase()

	// Start the server with CORS middleware
	fmt.Println("Server is running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", corsHandler.Handler(mux)); err != nil {
		panic("Failed to start server: " + err.Error())
	}
}
