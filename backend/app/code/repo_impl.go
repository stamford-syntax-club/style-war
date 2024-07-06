package code

import "gorm.io/gorm"

type CodeRepoImpl struct {
	db *gorm.DB
}

func NewCodeRepoImpl(db *gorm.DB) *CodeRepoImpl {
	return &CodeRepoImpl{db: db}
}

func (cr *CodeRepoImpl) GetCode() *Code {
	return nil
}
