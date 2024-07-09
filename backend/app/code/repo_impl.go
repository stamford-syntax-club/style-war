package code

import "gorm.io/gorm"

type CodeRepoImpl struct {
	db *gorm.DB
}

func NewCodeRepoImpl(db *gorm.DB) *CodeRepoImpl {
	return &CodeRepoImpl{db: db}
}

func (cr *CodeRepoImpl) GetCode(challenge_id int, user_id string) (*Code, error) {
	var code Code
	result := cr.db.Where("user_id = ? AND challenge_id= ?", user_id, challenge_id).First(&code)
	return &code, result.Error
}
