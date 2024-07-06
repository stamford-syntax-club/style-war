package challenge

type ChallengeRepoImpl struct {
}

func NewChallengeRepoImpl() *ChallengeRepoImpl {
	return &ChallengeRepoImpl{}
}

func (chr *ChallengeRepoImpl) GetActiveChallenge() *Challenge {
	return nil
}
