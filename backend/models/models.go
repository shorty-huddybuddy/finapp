package models

import (
	"time"
)

type User struct {
	ID                  string    `json:"id" firestore:"id"`
	ClerkID             string    `json:"clerkId" firestore:"clerkId"`
	Username            string    `json:"username" firestore:"username"`
	DisplayName         string    `json:"displayName" firestore:"displayName"`
	ProfileImageURL     string    `json:"profileImageUrl" firestore:"profileImageUrl"`
	IsPremium           bool      `json:"isPremium" firestore:"isPremium"`
	CreatedAt           time.Time `json:"createdAt" firestore:"createdAt"`
	UpdatedAt           time.Time `json:"updatedAt" firestore:"updatedAt"`
	IsCreator           bool      `json:"isCreator" firestore:"isCreator"`
	CreatorProfile      *Creator  `json:"creatorProfile,omitempty" firestore:"creatorProfile,omitempty"`
	ActiveSubscriptions []string  `json:"activeSubscriptions" firestore:"activeSubscriptions"`
}

type Author struct {
	Name      string `json:"name" firestore:"name"`
	Handle    string `json:"handle" firestore:"handle"`
	Avatar    string `json:"avatar" firestore:"avatar"`
	IsPremium bool   `json:"isPremium" firestore:"isPremium"`
}

type Post struct {
	ID                       string    `json:"id" firestore:"id"`
	Author                   Author    `json:"author" firestore:"author"`
	Content                  string    `json:"content" firestore:"content"`
	Image                    string    `json:"image,omitempty" firestore:"image,omitempty"`
	Likes                    int       `json:"likes" firestore:"likes"`
	Comments                 int       `json:"comments" firestore:"comments"`
	Shares                   int       `json:"shares" firestore:"shares"`
	IsPremiumPost            bool      `json:"isPremiumPost" firestore:"isPremiumPost"`
	Timestamp                string    `json:"timestamp" firestore:"timestamp"`
	CreatedAt                time.Time `json:"-" firestore:"createdAt"`
	UpdatedAt                time.Time `json:"-" firestore:"updatedAt"`
	Liked                    bool      `json:"liked" firestore:"liked,omitempty"`
	RequiredSubscriptionTier string    `json:"requiredSubscriptionTier,omitempty" firestore:"requiredSubscriptionTier,omitempty"`
	MinimumTierRequired      string    `json:"minimumTierRequired,omitempty" firestore:"minimumTierRequired,omitempty"`
	HasAccess                bool      `json:"hasAccess" firestore:"hasAccess"` // Indicates if current user can access this premium content
	CreatorID                string    `json:"creatorId,omitempty" firestore:"creatorId,omitempty"`
}

type Comment struct {
	ID        string    `json:"id" firestore:"id"`
	PostID    string    `json:"postId" firestore:"postId"`
	Author    Author    `json:"author" firestore:"author"`
	Content   string    `json:"content" firestore:"content"`
	CreatedAt time.Time `json:"createdAt" firestore:"createdAt"`
}

type Like struct {
	ID        string    `json:"id" firestore:"id"`
	PostID    string    `json:"postId" firestore:"postId"`
	UserID    string    `json:"userId" firestore:"userId"`
	CreatedAt time.Time `json:"createdAt" firestore:"createdAt"`
}

type PremiumSubscription struct {
	ID            string    `json:"id" firestore:"id"`
	UserID        string    `json:"userID" firestore:"userID"`                           // Support both cases
	UserId        string    `json:"userId" firestore:"userId"`                           // Support both cases
	CreatorID     string    `json:"creatorId,omitempty" firestore:"creatorId,omitempty"` // Optional for platform-wide subs
	Status        string    `json:"status" firestore:"status"`                           // active, cancelled, expired
	Type          string    `json:"type" firestore:"type"`                               // platform, creator
	TierID        string    `json:"tierId" firestore:"tierId"`                           // premium-monthly, creator-basic, etc
	Price         float64   `json:"price" firestore:"price"`
	StartDate     time.Time `json:"startDate" firestore:"startDate"`
	EndDate       time.Time `json:"endDate" firestore:"endDate"`
	AutoRenew     bool      `json:"autoRenew" firestore:"autoRenew"`
	PaymentStatus string    `json:"paymentStatus" firestore:"paymentStatus"`
	StripeSubID   string    `json:"stripeSubId" firestore:"stripeSubId"` // Stripe subscription ID
	CreatedAt     time.Time `json:"createdAt" firestore:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt" firestore:"updatedAt"`
}

type SubscriptionTier struct {
	ID        string    `json:"id" firestore:"id"`
	Name      string    `json:"name" firestore:"name"`
	Type      string    `json:"type" firestore:"type"` // platform, creator
	Price     float64   `json:"price" firestore:"price"`
	Interval  string    `json:"interval" firestore:"interval"` // monthly, yearly
	Features  []string  `json:"features" firestore:"features"`
	CreatedAt time.Time `json:"createdAt" firestore:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" firestore:"updatedAt"`
}

type SubscriptionPayment struct {
	ID              string    `json:"id" firestore:"id"`
	SubscriptionID  string    `json:"subscriptionId" firestore:"subscriptionId"`
	Amount          float64   `json:"amount" firestore:"amount"`
	Currency        string    `json:"currency" firestore:"currency"`
	Status          string    `json:"status" firestore:"status"`
	StripePaymentID string    `json:"stripePaymentId" firestore:"stripePaymentId"`
	CreatedAt       time.Time `json:"createdAt" firestore:"createdAt"`
}

type Creator struct {
	Bio             string   `json:"bio" firestore:"bio"`
	Categories      []string `json:"categories" firestore:"categories"`
	SubscriberCount int      `json:"subscriberCount" firestore:"subscriberCount"`
	TotalEarnings   float64  `json:"totalEarnings" firestore:"totalEarnings"`
	AvailableTiers  []string `json:"availableTiers" firestore:"availableTiers"`
}

type CreatorSubscription struct {
	ID           string    `json:"id" firestore:"id"`
	CreatorID    string    `json:"creatorId" firestore:"creatorId"`
	SubscriberID string    `json:"subscriberId" firestore:"subscriberId"`
	TierID       string    `json:"tierId" firestore:"tierId"`
	Status       string    `json:"status" firestore:"status"` // active, cancelled, expired
	Price        float64   `json:"price" firestore:"price"`
	StartDate    time.Time `json:"startDate" firestore:"startDate"`
	EndDate      time.Time `json:"endDate" firestore:"endDate"`
	AutoRenew    bool      `json:"autoRenew" firestore:"autoRenew"`
	StripeSubID  string    `json:"stripeSubId" firestore:"stripeSubId"`
	CreatedAt    time.Time `json:"createdAt" firestore:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt" firestore:"updatedAt"`
}
