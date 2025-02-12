package middleware

import (
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/user"
	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get session claims from context
		claims, ok := clerk.SessionClaimsFromContext(c.Context())
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized: No valid session",
			})
		}

		// Get user details
		usr, err := user.Get(c.Context(), claims.Subject)
		if (err != nil) {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error fetching user details",
			})
		}

		if usr == nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "User does not exist",
			})
		}

		// Store user info in context
		c.Locals("userId", usr.ID)
		c.Locals("firstName", usr.FirstName)
		c.Locals("lastName", usr.LastName)
		if usr.Username != nil {
			c.Locals("username", *usr.Username)
		}
		if len(usr.EmailAddresses) > 0 {
			c.Locals("userEmail", usr.EmailAddresses[0].EmailAddress)
		}

		return c.Next()
	}
}
