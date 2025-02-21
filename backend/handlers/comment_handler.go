package handlers

import (
	"backend/database"
	"backend/models"
	"fmt"
	"sort"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type CommentHandler struct{}

func NewCommentHandler() *CommentHandler {
	return &CommentHandler{}
}

func (h *CommentHandler) CreateComment(c *fiber.Ctx) error {
	fmt.Println("creating comments");
	postId := c.Params("postId")
	userId := c.Locals("userId").(string)
	username := c.Locals("username").(string)
	userImagePtr, ok := c.Locals("userImage").(*string)
	var userImage string
	if ok && userImagePtr != nil {
		userImage = *userImagePtr
	}


	// Parse comment data
	var input struct {
		Content string `json:"content"`
	}

	fmt.Println("creating comments");

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Create new comment
	comment := models.Comment{
		ID:     uuid.New().String(),
		PostID: postId,
		Author: models.Author{
			Name:   username,
			Handle: fmt.Sprintf("@%s", userId),
			Avatar: userImage,
		},
		Content:   input.Content,
		CreatedAt: time.Now(),
	}

	// Save comment to Firebase
	commentRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("comments/%s/%s", postId, comment.ID))
	if err := commentRef.Set(c.Context(), comment); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save comment",
		})
	}

	// Increment post's comment count
	postRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("posts/%s", postId))
	var post models.Post
	if err := postRef.Get(c.Context(), &post); err == nil {
		post.Comments++
		postRef.Update(c.Context(), map[string]interface{}{
			"comments": post.Comments,
		})
	}

	return c.Status(fiber.StatusCreated).JSON(comment)
}

func (h *CommentHandler) GetComments(c *fiber.Ctx) error {
	postId := c.Params("postId")

	// Get comments from Firebase
	commentsRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("comments/%s", postId))
	var comments map[string]models.Comment

	if err := commentsRef.Get(c.Context(), &comments); err != nil {
		return c.JSON([]models.Comment{}) // Return empty array if no comments
	}

	// Convert map to slice and sort by creation time
	commentsList := make([]models.Comment, 0, len(comments))
	for _, comment := range comments {
		commentsList = append(commentsList, comment)
	}

	// Sort comments by creation time (newest first)
	sort.Slice(commentsList, func(i, j int) bool {
		return commentsList[i].CreatedAt.After(commentsList[j].CreatedAt)
	})

	return c.JSON(commentsList)
}

func (h *CommentHandler) DeleteComment(c *fiber.Ctx) error {
	postId := c.Params("postId")
	commentId := c.Params("commentId")
	userId := c.Locals("userId").(string)

	// Get comment to verify ownership
	commentRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("comments/%s/%s", postId, commentId))
	var comment models.Comment
	if err := commentRef.Get(c.Context(), &comment); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Comment not found",
		})
	}

	// Verify ownership
	if comment.Author.Handle != fmt.Sprintf("@%s", userId) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Not authorized to delete this comment",
		})
	}

	// Delete comment
	if err := commentRef.Delete(c.Context()); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete comment",
		})
	}

	// Decrement post's comment count
	postRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("posts/%s", postId))
	var post models.Post
	if err := postRef.Get(c.Context(), &post); err == nil && post.Comments > 0 {
		post.Comments--
		postRef.Update(c.Context(), map[string]interface{}{
			"comments": post.Comments,
		})
	}

	return c.JSON(fiber.Map{
		"message": "Comment deleted successfully",
	})
}
