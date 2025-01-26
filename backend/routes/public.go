package routes

import (
	"backend/handlers"
	"net/http"
)

func RegisterRoutes(mux *http.ServeMux) {
	// Public route (no authentication required)
	mux.HandleFunc("/", handlers.PublicHandler)

	// Protected route (requires authentication)
	mux.HandleFunc("/protected", handlers.ProtectedHandler)

	// Chatbot route
	mux.HandleFunc("/generate", handlers.ChatbotHandler)
}
