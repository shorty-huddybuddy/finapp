package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/db"
	"google.golang.org/api/option"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Add collection constants
const (
	UsersCollection                = "users"
	PostsCollection                = "posts"
	CommentsCollection             = "comments"
	LikesCollection                = "likes"
	PremiumSubscriptionsCollection = "premium_subscriptions"
	CreatorSubscriptionsCollection = "creator_subscriptions"
)

var (
	FirebaseDB      *db.Client
	FirestoreClient *firestore.Client
)

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

	// Initialize Firestore client
	firestoreClient, err := app.Firestore(context.Background())
	if err != nil {
		log.Fatalf("Error initializing Firestore: %v", err)
	}
	FirestoreClient = firestoreClient

	println("db connected")
}

// Add collection reference methods
func Users() *firestore.CollectionRef {
	return FirestoreClient.Collection(UsersCollection)
}

func Posts() *firestore.CollectionRef {
	return FirestoreClient.Collection(PostsCollection)
}

func Comments() *firestore.CollectionRef {
	return FirestoreClient.Collection(CommentsCollection)
}

func Likes() *firestore.CollectionRef {
	return FirestoreClient.Collection(LikesCollection)
}

func PremiumSubscriptions() *firestore.CollectionRef {
	return FirestoreClient.Collection(PremiumSubscriptionsCollection)
}

func CreatorSubscriptions() *firestore.CollectionRef {
	return FirestoreClient.Collection(CreatorSubscriptionsCollection)
}

// Update cleanup method to only close Firestore
func CloseFirebase() {
	if FirestoreClient != nil {
		FirestoreClient.Close()
	}
}

func GetFirebaseDB() *db.Client {
	return FirebaseDB
}

func GetFirestoreClient() *firestore.Client {
	return FirestoreClient
}

// Add test connection function
func TestConnection() error {
	// Test Firestore
	_, err := FirestoreClient.Collection("test").Doc("test").Get(context.Background())
	if err != nil && status.Code(err) != codes.NotFound {
		return fmt.Errorf("firestore connection test failed: %v", err)
	}

	// Test Realtime Database
	ref := FirebaseDB.NewRef("test")
	err = ref.Set(context.Background(), "test")
	if err != nil {
		return fmt.Errorf("realtime database connection test failed: %v", err)
	}

	return nil
}
