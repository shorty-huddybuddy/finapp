package routes

import (
	"backend/handlers"
	"backend/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {
	// Public routes (no authentication required)
	app.Get("/", handlers.PublicHandler)
	app.Get("/api/test/firebase", handlers.TestDatabaseConnection)

	// calender routes
	// Calendar routes with authentication
	calendarGroup := app.Group("/api/calender")
	calendarGroup.Use(middleware.AuthMiddleware())
	calendarGroup.Get("/events", handlers.FetchEvents)
	calendarGroup.Post("/events", handlers.CreateEvent)
	calendarGroup.Put("/events/:id", handlers.UpdateEvent)
	calendarGroup.Delete("/events/:id", handlers.DeleteEvent)
	
	app.Post("/api/calendar/global",handlers.CreateGlobalEvent)
	app.Get("/api/calender/notifications", handlers.FetchNotifications)
	app.Get("/api/calender/insights", handlers.FetchInsights)
	app.Get("/api/calender/market-events", handlers.FetchMarketEvents)
	app.Get("/api/calender/risk-alerts", handlers.FetchRiskAlerts)
	app.Get("/api/calendar/goals", handlers.FetchGoals)

	// Subscription routes
	subscriptions := app.Group("/api/subscriptions")
	subscriptions.Use(middleware.AuthMiddleware())
	subscriptions.Post("/check-access", handlers.CheckSubscriptionAccess)
	subscriptions.Post("/create", handlers.CreateSubscription)
	subscriptions.Get("/status", handlers.GetSubscriptionStatus)
	// subscriptions.Delete("/cancel", handlers.CancelSubscription)

	// User permission routes
	users := app.Group("/api/users")
	users.Use(middleware.AuthMiddleware())
	users.Get("/permissions", handlers.GetUserPermissions)
	users.Post("/creator/signup", handlers.SignupAsCreator)

	// Stripe webhook (no auth required)
	app.Post("/api/webhooks/stripe", handlers.HandleStripeWebhook)

	// Protected Social Media Routes
	social := app.Group("/api/social")
	social.Use(middleware.AuthMiddleware()) // Apply auth middleware to all social routes
	social.Post("/posts", handlers.NewPostHandler().CreatePost)
	social.Get("/posts/:id", handlers.NewPostHandler().GetPost)
	social.Get("/posts", handlers.NewPostHandler().GetAllPosts)
	social.Delete("/posts/:id", handlers.NewPostHandler().DeletePost)
	social.Post("/posts/batch", handlers.NewPostHandler().BatchGetPosts) // New batch posts endpoint

	// Like routes
	social.Post("/posts/:postId/like", handlers.NewLikeHandler().ToggleLike)
	social.Get("/posts/:postId/like/status", handlers.NewLikeHandler().GetLikeStatus)
	social.Post("/posts/batch/like-status", handlers.NewLikeHandler().BatchGetLikeStatus) // New batch endpoint

	// Comment routes
	social.Post("/posts/:postId/comments", handlers.NewCommentHandler().CreateComment)
	social.Get("/posts/:postId/comments", handlers.NewCommentHandler().GetComments)
	social.Delete("/posts/:postId/comments/:commentId", handlers.NewCommentHandler().DeleteComment)

	// Protected route (requires authentication)
	app.Get("/protected", handlers.ProtectedHandler)

	// Chatbot route
	app.Post("/generate", handlers.ChatbotHandler)

	// Watchlist routes
	app.All("/api/watchlist", handlers.WatchlistHandler)

	app.Get("/api/search", handlers.SearchHandler)
	app.Get("/api/price", handlers.PriceHandler)
}