package challenge

import (
	"gorm.io/gorm"
)

type ChallengeRepoImpl struct {
	db *gorm.DB
}

func NewChallengeRepoImpl(db *gorm.DB) *ChallengeRepoImpl {
	return &ChallengeRepoImpl{db: db}
}

func (chr *ChallengeRepoImpl) GetActiveChallenge() (*Challenge, error) {
	var challenge Challenge
	result := chr.db.First(&challenge, "is_active = true")
	return &challenge, result.Error
}
