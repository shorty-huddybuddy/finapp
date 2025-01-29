package handlers

import (
	"github.com/gofiber/fiber/v2"
)

func PublicHandler(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"access": "public",
	})
}
