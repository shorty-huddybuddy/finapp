package handlers

import (
	"fmt"
	"strings"

	"github.com/clerk/clerk-sdk-go/v2/jwt"
	"github.com/clerk/clerk-sdk-go/v2/user"
	"github.com/gofiber/fiber/v2"
)

func ProtectedHandler(c *fiber.Ctx) error {
	// Get the session token from the Authorization header
	sessionToken := strings.TrimPrefix(c.Get("Authorization"), "Bearer ")

	// Verify the session token
	claims, err := jwt.Verify(c.Context(), &jwt.VerifyParams{
		Token: sessionToken,
	})
	if err != nil {
		fmt.Println("Token verification failed:", err)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"access": "unauthorized",
		})
	}

	// Fetch user details using the session claims
	usr, err := user.Get(c.Context(), claims.Subject)
	if err != nil {
		fmt.Println("Failed to fetch user details:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch user details",
		})
	}

	// Respond with user details
	return c.JSON(fiber.Map{
		"user_id":     usr.ID,
		"user_banned": usr.Banned,
	})
}
