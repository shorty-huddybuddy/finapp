package main

import (
	"backend/database"
	"backend/routes"
	"fmt"
	"log"
	"os"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Initialize Clerk with your secret key
	clerkKey := os.Getenv("CLERK_SECRET_KEY")
	if clerkKey == "" {
		log.Fatal("CLERK_SECRET_KEY is required")
	}
	clerk.SetKey(clerkKey)

	fmt.Println("CLERK SECRET KEY", clerkKey);
	fmt.Println("GEMINI API KEY", os.Getenv("GEMINI_API_KEY"))

	// Initialize Firebase
	database.InitFirebase()
	defer database.CloseFirebase()

	// Setup Fiber
	app := fiber.New()

	// Add CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH",
	}))



	// Register routes
	routes.RegisterRoutes(app)

	// Start server
	log.Println("Server starting on :8080")
	if err := app.Listen(":8080"); err != nil {
		log.Fatal(err)
	}
}
