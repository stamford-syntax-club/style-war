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

func (chr *ChallengeRepoImpl) GetAllChallenges(fields ...string) ([]Challenge, error) {
	if len(fields) < 1 {
		fields = []string{"*"}
	}

	var challenges []Challenge
	if result := chr.db.Select(fields).Find(&challenges); result.Error != nil {
		return nil, result.Error
	}

	return challenges, nil
}

func (chr *ChallengeRepoImpl) SetActiveChallenge(id int) {
	/*
	   UPDATE challenges
	   SET is_active = FALSE
	   WHERE is_active = TRUE;

	   UPDATE challenges
	   SET is_active = TRUE
	   WHERE "id" = 2;
	*/

	chr.db.Exec("UPDATE challenges SET is_active = FALSE WHERE is_active = TRUE")
	chr.db.Exec("UPDATE challenges SET is_active = TRUE WHERE id = ?", id)
}
