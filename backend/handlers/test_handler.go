package handlers

import (
	"backend/database"

	"github.com/gofiber/fiber/v2"
)

func TestDatabaseConnection(c *fiber.Ctx) error {
	err := database.TestConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Firebase connection successful",
	})
}
