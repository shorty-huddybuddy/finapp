package main

import (
	"backend/config"
	"backend/database"
	"backend/routes"
	"fmt"
	"log"
	"os"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/stripe/stripe-go/v72"
)

func init() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found")
	}

	// Configure Stripe
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	// Enable Stripe debug mode in non-production
	if os.Getenv("APP_ENV") != "production" {
		stripe.EnableTelemetry = false
		// Use proper debug logging
		stripe.DefaultLeveledLogger = &stripe.LeveledLogger{
			Level: stripe.LevelDebug,
		}
	}

	// Initialize Stripe with proper error handling
	if err := config.InitStripe(); err != nil {
		log.Fatalf("Failed to initialize Stripe: %v", err)
	}

	// Validate Stripe API key
	if err := config.ValidateAPIKey(); err != nil {
		log.Fatalf("Stripe API key validation failed: %v", err)
	}
}

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		fmt.Println("Error loading .env file")
	}

	// Initialize Clerk
	clerkKey := os.Getenv("CLERK_SECRET_KEY")
	if clerkKey == "" {
		log.Fatal("CLERK_SECRET_KEY is required")
	}
	clerk.SetKey(clerkKey)

	// Initialize Firebase
	database.InitFirebase()
	defer database.CloseFirebase()

	// Setup Fiber
	app := fiber.New()

	// CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH",
	}))

	// Register routes
	routes.RegisterRoutes(app)

	log.Println("Server starting on :8080")
	if err := app.Listen(":8080"); err != nil {
		log.Fatal(err)
	}
}
