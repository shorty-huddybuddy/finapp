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

	// Create reference to posts collection in Firebase Realtime Database
	ref := database.GetFirebaseDB().NewRef("posts")

	// Generate a new unique key for the post
	newRef, err := ref.Push(c.Context(), post)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to store post data: " + err.Error(),
		})
	}

	// Update the post ID with the Firebase generated key
	post.ID = newRef.Key

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Post created successfully",
		"post_id": newRef.Key,
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

// Update GetAllPosts to use Realtime Database with pagination
func (h *PostHandler) GetAllPosts(c *fiber.Ctx) error {
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	lastId := c.Query("lastId")
	userID := c.Locals("userId")

	// Get reference to posts in Realtime Database
	ref := database.GetFirebaseDB().NewRef("posts")

	// Create query
	query := ref.OrderByKey()
	if lastId != "" {
		// For Realtime Database, use StartAt for pagination
		query = query.StartAt(lastId)
	}
	query = query.LimitToFirst(limit)

	fmt.Printf("Fetching posts with limit: %d, lastId: %s\n", limit, lastId)

	var posts map[string]models.Post
	if err := query.Get(c.Context(), &posts); err != nil {
		fmt.Printf("Error fetching posts: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch posts",
		})
	}

	// Convert map to slice and filter premium posts
	postsList := make([]models.Post, 0, len(posts))
	for id, post := range posts {
		post.ID = id // Ensure ID is set
		if !post.IsPremiumPost || userID != nil {
			postsList = append(postsList, post)
		}
	}

	fmt.Printf("Fetched %d posts\n", len(postsList))
	return c.JSON(postsList)
}
