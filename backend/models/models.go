package models

import (
	"time"
)

type User struct {
	ID              string    `json:"id" firestore:"id"`
	ClerkID         string    `json:"clerkId" firestore:"clerkId"`
	Username        string    `json:"username" firestore:"username"`
	DisplayName     string    `json:"displayName" firestore:"displayName"`
	ProfileImageURL string    `json:"profileImageUrl" firestore:"profileImageUrl"`
	IsPremium       bool      `json:"isPremium" firestore:"isPremium"`
	CreatedAt       time.Time `json:"createdAt" firestore:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt" firestore:"updatedAt"`
}

type Author struct {
	Name      string `json:"name" firestore:"name"`
	Handle    string `json:"handle" firestore:"handle"`
	Avatar    string `json:"avatar" firestore:"avatar"`
	IsPremium bool   `json:"isPremium" firestore:"isPremium"`
}

type Post struct {
	ID            string    `json:"id" firestore:"id"`
	Author        Author    `json:"author" firestore:"author"`
	Content       string    `json:"content" firestore:"content"`
	Image         string    `json:"image,omitempty" firestore:"image,omitempty"`
	Likes         int       `json:"likes" firestore:"likes"`
	Comments      int       `json:"comments" firestore:"comments"`
	Shares        int       `json:"shares" firestore:"shares"`
	IsPremiumPost bool      `json:"isPremiumPost" firestore:"isPremiumPost"`
	Timestamp     string    `json:"timestamp" firestore:"timestamp"`
	CreatedAt     time.Time `json:"-" firestore:"createdAt"`
	UpdatedAt     time.Time `json:"-" firestore:"updatedAt"`
	Liked         bool      `json:"liked" firestore:"liked,omitempty"`
}

type Comment struct {
	ID        string    `json:"id" firestore:"id"`
	PostID    string    `json:"postId" firestore:"postId"`
	AuthorID  string    `json:"authorId" firestore:"authorId"`
	Content   string    `json:"content" firestore:"content"`
	CreatedAt time.Time `json:"createdAt" firestore:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" firestore:"updatedAt"`
}

type Like struct {
	ID        string    `json:"id" firestore:"id"`
	PostID    string    `json:"postId" firestore:"postId"`
	UserID    string    `json:"userId" firestore:"userId"`
	CreatedAt time.Time `json:"createdAt" firestore:"createdAt"`
}

type PremiumSubscription struct {
	ID            string    `json:"id" firestore:"id"`
	UserID        string    `json:"userId" firestore:"userId"`
	Status        string    `json:"status" firestore:"status"`
	PlanType      string    `json:"planType" firestore:"planType"`
	StartDate     time.Time `json:"startDate" firestore:"startDate"`
	EndDate       time.Time `json:"endDate" firestore:"endDate"`
	AutoRenew     bool      `json:"autoRenew" firestore:"autoRenew"`
	PaymentStatus string    `json:"paymentStatus" firestore:"paymentStatus"`
}
