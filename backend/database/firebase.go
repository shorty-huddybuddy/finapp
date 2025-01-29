package database

import (
	"context"
	"log"
	"os"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/db"
	"google.golang.org/api/option"
)

var FirebaseDB *db.Client

func InitFirebase() {
	opt := option.WithCredentialsFile("api_key.json")
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("Error initializing Firebase app: %v", err)
	}

	FirebaseDB, err = app.DatabaseWithURL(context.Background(), os.Getenv("FIREBASE_DB_URL"))
	if err != nil {
		log.Fatalf("Error initializing Firebase Realtime Database: %v", err)
	}
}

func GetFirebaseDB() *db.Client {
	return FirebaseDB
}
