package handlers

import (
	"net/http"
)

func PublicHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(`{"access": "public"}`))
}
