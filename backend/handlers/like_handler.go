package handlers

import (
	"backend/database"
	"encoding/json"
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

	fmt.Printf("Checking like status for post: %s, user: %s\n", postId, userId)

	// Get reference to like in Firebase
	likeRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("likes/%s/%s", postId, userId))

	// Check if the like exists
	var exists bool
	if err := likeRef.Get(c.Context(), &exists); err != nil {
		exists = false // If there's an error, assume not liked
	}

	return c.JSON(fiber.Map{
		"liked": exists,
	})
}

// BatchGetLikeStatus gets like statuses for multiple posts at once
func (h *LikeHandler) BatchGetLikeStatus(c *fiber.Ctx) error {
	var postIds []string
	if err := json.Unmarshal(c.Body(), &postIds); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	userId := c.Locals("userId").(string)
	results := make(map[string]bool)

	// Process each post ID
	for _, postId := range postIds {
		likeRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("likes/%s/%s", postId, userId))
		var exists bool
		if err := likeRef.Get(c.Context(), &exists); err != nil {
			exists = false // If there's an error, assume not liked
		}
		results[postId] = exists
	}

	return c.JSON(fiber.Map{
		"results": results,
	})
}
