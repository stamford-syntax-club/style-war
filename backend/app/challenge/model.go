package challenge

type Challenge struct {
	ID         int      `json:"id"`
	ImageUrl   string   `json:"imageUrl"`
	Objectives []string `json:"objectives"`
	IsActive   bool     `json:"isActive"`
}
