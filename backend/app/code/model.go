package code

import "github.com/stamford-syntax-club/style-war/backend/app/challenge"

type Code struct {
	UserId      string `gorm:"primaryKey" json:"userId"`
	ChallengeId int    `gorm:"primaryKey" json:"challengeId"`
	Code        string `json:"code"`
	Challenge   challenge.Challenge
}

// Any struct with the following method is considered to be CodeRepo
type CodeRepo interface {
	GetCode(int, string) (*Code, error)
	StoreCode(Code) (*Code, error)
}
