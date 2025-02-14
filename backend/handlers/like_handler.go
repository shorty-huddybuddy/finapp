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

func (h *LikeHandler) CheckLikeStatus(c *fiber.Ctx) error {
	postId := c.Params("postId")
	userId := c.Locals("userId").(string)
	// userId := "test"
	likeRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("likes/%s/%s", postId, userId))

	var liked bool
	if err := likeRef.Get(c.Context(), &liked); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to check like status",
		})
	}

	return c.JSON(fiber.Map{
		"liked": liked,
	})
}

func (h *LikeHandler) ToggleLike(c *fiber.Ctx) error {
	postId := c.Params("postId")
	userId := c.Locals("userId").(string)
	// userId := "test" // TODO: Replace with actual user ID

	// Create references using the direct post ID
	postRef := database.GetFirebaseDB().NewRef("posts").Child(postId)
	likeRef := database.GetFirebaseDB().NewRef("likes").Child(postId).Child(userId)

	// Verify post exists first
	var post map[string]interface{}
	if err := postRef.Get(c.Context(), &post); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Post not found",
		})
	}

	// Check current like status
	var isLiked bool
	if err := likeRef.Get(c.Context(), &isLiked); err == nil && isLiked {
		// User has already liked the post - remove like
		if err := likeRef.Delete(c.Context()); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to unlike post",
			})
		}

		// Update post likes count
		currentLikes := int64(0)
		if likes, ok := post["likes"]; ok {
			currentLikes = int64(likes.(float64))
		}
		if currentLikes > 0 {
			currentLikes--
		}

		if err := postRef.Update(c.Context(), map[string]interface{}{
			"likes": currentLikes,
		}); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to update post likes",
			})
		}

		return c.JSON(fiber.Map{
			"liked":   false,
			"likes":   currentLikes,
			"message": "Post unliked",
		})
	}

	// User hasn't liked the post - add like
	if err := likeRef.Set(c.Context(), true); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to like post",
		})
	}

	// Update post likes count
	currentLikes := int64(0)
	if likes, ok := post["likes"]; ok {
		currentLikes = int64(likes.(float64))
	}
	currentLikes++

	if err := postRef.Update(c.Context(), map[string]interface{}{
		"likes": currentLikes,
	}); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update post likes",
		})
	}

	return c.JSON(fiber.Map{
		"liked":   true,
		"likes":   currentLikes,
		"message": "Post liked",
	})
}
