package handlers

import (
	"backend/database"
	"backend/models"
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type PostHandler struct{}

func NewPostHandler() *PostHandler {
	return &PostHandler{}
}

func (h *PostHandler) CreatePost(c *fiber.Ctx) error {
	post := new(models.Post)

	if err := c.BodyParser(post); err != nil {
		fmt.Printf("Body parsing error: %v\n", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body: " + err.Error(),
		})
	}

	// Set up post metadata
	now := time.Now()
	post.ID = uuid.New().String()
	post.CreatedAt = now
	post.UpdatedAt = now
	post.Timestamp = "now"
	post.Likes = 0
	post.Comments = 0
	post.Shares = 0

	// Create reference to specific post ID in Firebase
	ref := database.GetFirebaseDB().NewRef("posts").Child(post.ID)

	// Set the post data directly with its ID
	if err := ref.Set(c.Context(), post); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to store post data: " + err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Post created successfully",
		"post_id": post.ID,
		"data":    post,
	})
}

// Update GetPost to use Realtime Database
func (h *PostHandler) GetPost(c *fiber.Ctx) error {
	id := c.Params("id")
	var post models.Post

	ref := database.GetFirebaseDB().NewRef(fmt.Sprintf("posts/%s", id))
	if err := ref.Get(c.Context(), &post); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Post not found",
		})
	}

	return c.JSON(post)
}

// Update GetAllPosts to use Realtime Database
func (h *PostHandler) GetAllPosts(c *fiber.Ctx) error {
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	lastId := c.Query("lastId")
	userId := c.Locals("userId")

	// Get reference to posts in Realtime Database
	ref := database.GetFirebaseDB().NewRef("posts")
	query := ref.OrderByKey()
	if lastId != "" {
		query = query.StartAt(lastId)
	}
	query = query.LimitToFirst(limit)

	var posts map[string]models.Post
	if err := query.Get(c.Context(), &posts); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch posts",
		})
	}

	// Convert map to slice and add metadata
	postsList := make([]models.Post, 0, len(posts))
	for id, post := range posts {
		post.ID = id

		// Check like status if user is authenticated
		if userId != nil {
			likeRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("likes/%s/%s", id, userId))
			var liked bool
			if err := likeRef.Get(c.Context(), &liked); err == nil {
				post.Liked = liked
			}
		}

		if !post.IsPremiumPost || userId != nil {
			postsList = append(postsList, post)
		}
	}

	return c.JSON(postsList)
}
