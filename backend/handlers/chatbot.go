package handlers

import (
	"backend/chatbot"
	"fmt"
	"github.com/gofiber/fiber/v2"
)

func ChatbotHandler(c *fiber.Ctx) error {
	var req chatbot.RequestBody
	if err := c.BodyParser(&req); err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	response, err := chatbot.GenerateResponse(req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	fmt.Println(response)

	return c.JSON(fiber.Map{
		"response": response,
	})
}