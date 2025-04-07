package main

import (
	"backend/config"
	"backend/database"
	"backend/routes"
	"log"
	"os"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/stripe/stripe-go/v72"
)

func init() {
	// Load .env file first before any initialization
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found")
	}

	// Initialize Stripe configuration after env vars are loaded
	if err := config.InitStripe(); err != nil {
		log.Fatalf("Failed to initialize Stripe: %v", err)
	}

	// Enable Stripe debug mode in non-production
	if os.Getenv("APP_ENV") != "production" {
		stripe.EnableTelemetry = false
		// Use proper debug logging
		stripe.DefaultLeveledLogger = &stripe.LeveledLogger{
			Level: stripe.LevelDebug,
		}
	}

	// Validate Stripe API key
	if err := config.ValidateAPIKey(); err != nil {
		log.Fatalf("Stripe API key validation failed: %v", err)
	}
}

func main() {
	// Initialize Clerk
	clerkKey := os.Getenv("CLERK_SECRET_KEY")
	if clerkKey == "" {
		log.Fatal("CLERK_SECRET_KEY is required")
	}
	clerk.SetKey(clerkKey)

	// Get frontend URL from environment
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000" // fallback default
	}

	// Get API port from environment
	apiPort := os.Getenv("API_PORT")
	if apiPort == "" {
		apiPort = "8080" // fallback default
	}

	// Initialize Firebase
	database.InitFirebase()
	defer database.CloseFirebase()

	// Setup Fiber
	app := fiber.New()

	// CORS middleware with environment variable
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH",
	}))

	// Register routes
	routes.RegisterRoutes(app)

	log.Printf("Server starting on :%s", apiPort)
	if err := app.Listen(":" + apiPort); err != nil {
		log.Fatal(err)
	}
}
