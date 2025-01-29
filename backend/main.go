package main

import (
	"backend/database"
	"backend/routes"
	"fmt"
	"os"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

// Remove the FirebaseDB variable and initFirebase function as they're moved to database package

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

	// Create a new Fiber app
	app := fiber.New()

	// Configure CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowHeaders: "Content-Type,Authorization",
	}))

	// Initialize Firebase
	database.InitFirebase()

	// Register routes
	routes.RegisterRoutes(app)

	// Start the server
	fmt.Println("Server is running on http://localhost:8080")
	if err := app.Listen(":8080"); err != nil {
		panic("Failed to start server: " + err.Error())
	}
}
