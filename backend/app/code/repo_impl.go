package code

type CodeRepoImpl struct {
}

func NewCodeRepoImpl() *CodeRepoImpl {
	return &CodeRepoImpl{}
}

func (cr *CodeRepoImpl) GetCode() *Code {
	return nil
}
