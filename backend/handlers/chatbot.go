package handlers

import (
	"backend/chatbot"

	"github.com/gofiber/fiber/v2"
)

func ChatbotHandler(c *fiber.Ctx) error {

	// if err := c.BodyParser(&req); err != nil {
	// 	 //fmt.Println(err)
	// 	// return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
	// 	// 	"error": "Invalid request body",
	// 	// })
	// }

	qtype := c.Query("type")
	if qtype == "investment_planner" {
		var req chatbot.RequestBody
		c.BodyParser(&req)
		response, err := chatbot.GenerateResponse(req)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.JSON(fiber.Map{
			"response": response,
		})
	} else if qtype == "analyzer" {
		var req map[string]interface{}
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		response, err := chatbot.Analyze_Portfolio(req)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.JSON(fiber.Map{
			"response": response,
		})
	} else {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid query type",
		})
	}
}
