package domain

import "time"

type Vote struct {
	ID        int       `json:"id"`
	Mesa      string    `json:"mesa"`
	PEAVotes  int       `json:"pea_votes"`
	UPLVotes  int       `json:"upl_votes"`
	CreatedAt time.Time `json:"created_at"`
}

type VoteSummary struct {
	PEATotal int `json:"pea_total"`
	UPLTotal int `json:"upl_total"`
}
