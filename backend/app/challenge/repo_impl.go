package challenge

import "gorm.io/gorm"

type ChallengeRepoImpl struct {
	db *gorm.DB
}

func NewChallengeRepoImpl(db *gorm.DB) *ChallengeRepoImpl {
	return &ChallengeRepoImpl{db: db}
}

func (chr *ChallengeRepoImpl) GetActiveChallenge() *Challenge {
	return nil
}
