package code

type Code struct {
	ID          int    `json:"id"`
	UserId      string `json:"userId"`
	Code        string `json:"code"`
	ChallengeId int    `json:"challengeId"`
}
