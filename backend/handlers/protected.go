package handlers

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/clerk/clerk-sdk-go/v2/jwt"
	"github.com/clerk/clerk-sdk-go/v2/user"
)

func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	// Get the session token from the Authorization header
	sessionToken := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")

	// Verify the session token
	claims, err := jwt.Verify(r.Context(), &jwt.VerifyParams{
		Token: sessionToken,
	})
	if err != nil {
		// Print the error for debugging
		fmt.Println("Token verification failed:", err)
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"access": "unauthorized"}`))
		return
	}

	// Fetch user details using the session claims
	usr, err := user.Get(r.Context(), claims.Subject)
	if err != nil {
		// Print the error for debugging
		fmt.Println("Failed to fetch user details:", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error": "Failed to fetch user details"}`))
		return
	}

	// Respond with user details
	fmt.Fprintf(w, `{"user_id": "%s", "user_banned": "%t"}`, usr.ID, usr.Banned)
}
