package code

import (
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

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

func (cr *CodeRepoImpl) StoreCode(newCode Code) (*Code, error) {
	result := cr.db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "user_id"}, {Name: "challenge_id"}},
		DoUpdates: clause.AssignmentColumns([]string{"code"}),
	}).Create(&newCode)

	if result.Error != nil {
		return nil, result.Error
	}

	return &newCode, nil
}
