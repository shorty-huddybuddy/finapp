package handlers

import (
	"backend/database"
	"backend/models"
	"fmt"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type PostHandler struct{}

func NewPostHandler() *PostHandler {
	return &PostHandler{}
}

func (h *PostHandler) CreatePost(c *fiber.Ctx) error {
	// Get authenticated user info
	userId := c.Locals("userId").(string)
	username := c.Locals("username").(string)

	// Log raw request body for debugging
	fmt.Println("Raw request body:", string(c.Body()))
	fmt.Println("Authenticated user:", userId, username)

	post := new(models.Post)
	if err := c.BodyParser(post); err != nil {
		fmt.Printf("Body parsing error: %v\n", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body: " + err.Error(),
		})
	}

	// Debug log parsed post
	fmt.Printf("Parsed post: %+v\n", post)
	fmt.Printf("Author details: %+v\n", post.Author)

	// Validate required fields
	if post.Content == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Content is required",
		})
	}

	// Ensure Author fields are properly set
	if post.Author.Name == "" || post.Author.Handle == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Author name and handle are required",
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

	// Debug log final post before saving
	fmt.Printf("Final post to save: %+v\n", post)

	// Save to Firestore
	_, err := database.Posts().Doc(post.ID).Set(c.Context(), post)
	if err != nil {
		fmt.Printf("Firestore error: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save post: " + err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  "success",
		"message": "Post created successfully",
		"data":    post,
	})
}

func (h *PostHandler) GetPost(c *fiber.Ctx) error {
	id := c.Params("id")
	doc, err := database.Posts().Doc(id).Get(c.Context())
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Post not found",
		})
	}

	var post models.Post
	doc.DataTo(&post)
	return c.JSON(post)
}

func (h *PostHandler) GetAllPosts(c *fiber.Ctx) error {
	iter := database.Posts().OrderBy("CreatedAt", firestore.Desc).Limit(20).Documents(c.Context())
	var posts []models.Post

	for {
		doc, err := iter.Next()
		if err != nil {
			break
		}

		var post models.Post
		doc.DataTo(&post)
		posts = append(posts, post)
	}

	return c.JSON(posts)
}
