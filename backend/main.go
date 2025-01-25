package main

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/jwt"
	"github.com/clerk/clerk-sdk-go/v2/user"
	"github.com/rs/cors"
)

func main() {
	// Set your Clerk Secret Key
	clerk.SetKey(os.Getenv("CLERK_SECRET_KEY"))

	// Create a new HTTP server multiplexer
	mux := http.NewServeMux()

	// Public route (no authentication required)
	mux.HandleFunc("/", publicRoute)

	// Protected route (requires authentication)
	mux.HandleFunc("/protected", protectedRoute)

	// Set up CORS middleware with the frontend domain (e.g., http://localhost:3000)
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},         // Frontend origin
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},  // Allowed HTTP methods
		AllowedHeaders: []string{"Content-Type", "Authorization"}, // Allowed headers
	})

	// Start the server with CORS middleware
	fmt.Println("Server is running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", corsHandler.Handler(mux)); err != nil {
		panic("Failed to start server: " + err.Error())
	}
}

// Public route handler
func publicRoute(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(`{"access": "public"}`))
}

// Protected route handler
func protectedRoute(w http.ResponseWriter, r *http.Request) {
	// Get the session token from the Authorization header
	sessionToken := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")

	// Verify the session token
	claims, err := jwt.Verify(r.Context(), &jwt.VerifyParams{
		Token: sessionToken,
	})
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"access": "unauthorized"}`))
		return
	}

	// Fetch user details using the session claims
	usr, err := user.Get(r.Context(), claims.Subject)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error": "Failed to fetch user details"}`))
		return
	}

	// Respond with user details
	fmt.Fprintf(w, `{"user_id": "%s", "user_banned": "%t"}`, usr.ID, usr.Banned)
}
