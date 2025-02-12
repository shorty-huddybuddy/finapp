package handlers

import (
	"backend/database"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type LikeHandler struct{}

func NewLikeHandler() *LikeHandler {
	return &LikeHandler{}
}

func (h *LikeHandler) ToggleLike(c *fiber.Ctx) error {
	postId := c.Params("postId")
	userId := c.Locals("userId").(string)

	// Get reference to the like in Firebase
	likeRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("likes/%s/%s", postId, userId))
	postRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("posts/%s", postId))

	// Check if user already liked the post
	var exists bool
	if err := likeRef.Get(c.Context(), &exists); err == nil && exists {
		// Unlike: Remove like and decrease count
		if err := likeRef.Delete(c.Context()); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to unlike post",
			})
		}

		// Decrease likes count atomically
		err = postRef.Child("likes").Transaction(c.Context(), func(likes interface{}) interface{} {
			if likes == nil {
				return 0
			}
			return likes.(int64) - 1
		})

		return c.JSON(fiber.Map{
			"liked":   false,
			"message": "Post unliked",
		})
	}

	// Like: Add like and increase count
	if err := likeRef.Set(c.Context(), true); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to like post",
		})
	}

	// Increase likes count atomically
	err := postRef.Child("likes").Transaction(c.Context(), func(likes interface{}) interface{} {
		if likes == nil {
			return 1
		}
		return likes.(int64) + 1
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update like count",
		})
	}

	return c.JSON(fiber.Map{
		"liked":   true,
		"message": "Post liked",
	})
}
