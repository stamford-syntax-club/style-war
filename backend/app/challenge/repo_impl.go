package challenge

type ChallengeRepoImpl struct {
}

func NewChallengeRepo() *ChallengeRepoImpl {
	return &ChallengeRepoImpl{}
}

func (chr *ChallengeRepoImpl) GetActiveChallenge() *Challenge {
	return nil
}
