package challenge

import (
	"time"

	"github.com/lib/pq"
)

type Challenge struct {
	ID         int            `json:"id"`
	ImageUrl   string         `json:"imageUrl"`
	Objectives pq.StringArray `gorm:"type:text[]" json:"objectives"`
	IsActive   bool           `json:"isActive"`
	StartTime  time.Time
	Duration   time.Duration
}

// Any struct with the following method is considered to be ChallengeRepo
type ChallengeRepo interface {
	GetActiveChallenge() (*Challenge, error)
	GetAllChallenges(...string) ([]Challenge, error)
}
