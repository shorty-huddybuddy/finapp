package handlers

import (
	"backend/database"
	"backend/models"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"sort"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// PostHandler handles social posts operations.
type PostHandler struct{}

// NewPostHandler returns a new PostHandler.
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

// GetPost returns a single post.
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

// BatchGetPosts returns multiple posts at once
func (h *PostHandler) BatchGetPosts(c *fiber.Ctx) error {
	var postIds []string
	if err := json.Unmarshal(c.Body(), &postIds); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	userId := c.Locals("userId").(string)
	result := make(map[string]models.Post)

	// Process each post ID
	for _, postId := range postIds {
		var post models.Post
		postRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("posts/%s", postId))
		if err := postRef.Get(c.Context(), &post); err != nil {
			// Skip posts that don't exist
			continue
		}

		// Add ID to post
		post.ID = postId

		// Check like status
		likeRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("likes/%s/%s", postId, userId))
		var liked bool
		if err := likeRef.Get(c.Context(), &liked); err == nil {
			post.Liked = liked
		}

		result[postId] = post
	}

	return c.JSON(result)
}

// GetAllPosts returns a list of posts.
func (h *PostHandler) GetAllPosts(c *fiber.Ctx) error {
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	lastId := c.Query("lastId")
	userId := c.Locals("userId")

	// Debug log
	fmt.Printf("[GetAllPosts] Request with limit: %d, lastId: %s\n", limit, lastId)

	// Get reference to posts in Realtime Database
	ref := database.GetFirebaseDB().NewRef("posts")
	var queryResult map[string]models.Post

	// For pagination: if no cursor, get the latest posts
	// If cursor exists, get posts older than cursor
	if lastId == "" {
		// First page: Get the most recent posts
		query := ref.OrderByKey().LimitToLast(limit + 1)
		if err := query.Get(c.Context(), &queryResult); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to fetch posts: " + err.Error(),
			})
		}
	} else {
		// Get posts before the cursor
		query := ref.OrderByKey().EndAt(lastId).LimitToLast(limit + 2) // +2 to account for cursor and check for more
		if err := query.Get(c.Context(), &queryResult); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to fetch posts: " + err.Error(),
			})
		}
	}

	// Debug log
	fmt.Printf("[GetAllPosts] Found %d posts in raw results\n", len(queryResult))

	// Sort post IDs in reverse chronological order (newest first)
	postIds := make([]string, 0, len(queryResult))
	for id := range queryResult {
		postIds = append(postIds, id)
	}
	sort.Sort(sort.Reverse(sort.StringSlice(postIds)))

	// Remove the cursor from results if present
	if lastId != "" && len(postIds) > 0 {
		for i, id := range postIds {
			if id == lastId {
				postIds = append(postIds[:i], postIds[i+1:]...)
				break
			}
		}
	}

	// Debug log
	fmt.Printf("[GetAllPosts] After removing cursor, have %d post IDs\n", len(postIds))

	// Check if we have more posts than the limit
	var nextCursor string
	if len(postIds) > limit {
		nextCursor = postIds[limit] // The first post of the next page
		postIds = postIds[:limit]   // Limit to requested amount
	}

	// Debug log
	fmt.Printf("[GetAllPosts] Final post count: %d, next cursor: %s\n", len(postIds), nextCursor)

	// Build the posts list with all metadata
	postsList := make([]models.Post, 0, len(postIds))
	for _, id := range postIds {
		post := queryResult[id]
		post.ID = id

		// Check like status
		if userId != nil {
			likeRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("likes/%s/%s", id, userId))
			var liked bool
			if err := likeRef.Get(c.Context(), &liked); err == nil {
				post.Liked = liked
			}
		}

		postsList = append(postsList, post)
	}

	// Return posts with pagination info
	result := fiber.Map{
		"posts": postsList,
	}

	if nextCursor != "" {
		result["nextPageCursor"] = nextCursor
	}

	return c.JSON(result)
}

// DeletePost handles the deletion of a post
func (h *PostHandler) DeletePost(c *fiber.Ctx) error {
	postId := c.Params("id")
	userId := c.Locals("userId").(string)
	username := c.Locals("username")

	fmt.Printf("Delete request - Post ID: %s, User ID: %s, Username: %v\n", postId, userId, username)

	// Get post to verify ownership
	var post models.Post
	postRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("posts/%s", postId))

	if err := postRef.Get(c.Context(), &post); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Post not found",
		})
	}

	// Extract username from author handle (remove '@' prefix)
	authorUsername := strings.TrimPrefix(post.Author.Handle, "@")

	// Compare with username from auth context
	if username == nil || username.(string) != authorUsername {
		fmt.Printf("Auth failed - Author username: %s, Request username: %v\n",
			authorUsername, username)
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Not authorized to delete this post",
		})
	}

	// Delete post and cleanup
	if err := postRef.Delete(c.Context()); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete post",
		})
	}

	// Clean up associated likes
	likesRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("likes/%s", postId))
	likesRef.Delete(c.Context())

	return c.JSON(fiber.Map{
		"message": "Post deleted successfully",
	})
}
