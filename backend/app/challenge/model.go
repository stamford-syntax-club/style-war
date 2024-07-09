package challenge

import "github.com/lib/pq"

type Challenge struct {
	ID         int            `json:"id"`
	ImageUrl   string         `json:"imageUrl"`
	Objectives pq.StringArray `gorm:"type:text[]" json:"objectives"`
	IsActive   bool           `json:"isActive"`
}

// Any struct with the following method is considered to be ChallengeRepo
type ChallengeRepo interface {
	GetActiveChallenge() (*Challenge, error)
}
