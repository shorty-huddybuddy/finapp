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

	likeRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("likes/%s/%s", postId, userId))
	postRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("posts/%s", postId))

	// Check current like status
	var exists bool
	if err := likeRef.Get(c.Context(), &exists); err == nil && exists {
		// Unlike flow
		if err := likeRef.Delete(c.Context()); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to unlike post",
			})
		}

		// Update post like count
		var post map[string]interface{}
		if err := postRef.Get(c.Context(), &post); err == nil {
			likes := 0
			if l, ok := post["likes"].(float64); ok {
				likes = int(l)
			}
			if likes > 0 {
				post["likes"] = likes - 1
				postRef.Update(c.Context(), post)
			}
		}

		return c.JSON(fiber.Map{
			"liked":   false,
			"message": "Post unliked",
		})
	}

	// Like flow
	if err := likeRef.Set(c.Context(), true); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to like post",
		})
	}

	// Update post like count
	var post map[string]interface{}
	if err := postRef.Get(c.Context(), &post); err == nil {
		likes := 0
		if l, ok := post["likes"].(float64); ok {
			likes = int(l)
		}
		post["likes"] = likes + 1
		postRef.Update(c.Context(), post)
	}

	return c.JSON(fiber.Map{
		"liked":   true,
		"message": "Post liked",
	})
}

func (h *LikeHandler) GetLikeStatus(c *fiber.Ctx) error {
	postId := c.Params("postId")
	userId := c.Locals("userId").(string)

	likeRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("likes/%s/%s", postId, userId))

	var exists bool
	if err := likeRef.Get(c.Context(), &exists); err != nil {
		exists = false
	}

	return c.JSON(fiber.Map{
		"liked": exists,
	})
}
