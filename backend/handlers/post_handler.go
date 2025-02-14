package handlers

import (
	"backend/database"
	"backend/models"
	"fmt"
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
	fmt.Println("getting posts")
	ref := database.GetFirebaseDB().NewRef("posts")
	var posts map[string]models.Post

	if err := ref.Get(c.Context(), &posts); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch posts",
		})
	}

	// Convert map to slice
	postsList := make([]models.Post, 0, len(posts))
	for _, post := range posts {
		postsList = append(postsList, post)
	}

	return c.JSON(postsList)
}
