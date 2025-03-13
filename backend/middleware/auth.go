package middleware

import (
	"fmt"
	"strings"

	"github.com/clerk/clerk-sdk-go/v2/jwt"
	"github.com/clerk/clerk-sdk-go/v2/user"
	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get the session JWT from the Authorization header
		sessionToken := strings.TrimPrefix(c.Get("Authorization"), "Bearer ")
		
		if sessionToken == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "No token provided",
			})
		}

		// Verify the session token
		claims, err := jwt.Verify(c.Context(), &jwt.VerifyParams{
			Token: sessionToken,
		})

		
		if err != nil {
			fmt.Printf("Token verification error: %v\n", err)
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error":   "Invalid token",
				"details": err.Error(),
			})
		}

		// Get user details and check if banned
		usr, err := user.Get(c.Context(), claims.Subject)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error":   "Error fetching user details",
				"details": err.Error(),
			})
		}

		if usr.Banned {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "User is banned",
			})
		}

		// Store user info in context
		c.Locals("userId", usr.ID)
		c.Locals("banned", usr.Banned)
		c.Locals("firstName", usr.FirstName)
		c.Locals("lastName", usr.LastName)
		
		// fmt.Println(usr)
		c.Locals("userImage",usr.ImageURL)

		if usr.Username != nil {
			c.Locals("username", *usr.Username)
		}
		if len(usr.EmailAddresses) > 0 {
			c.Locals("userEmail", usr.EmailAddresses[0].EmailAddress)
		}

		return c.Next()
	}
}
