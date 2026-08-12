package domain

import (
	"time"
)

type Curriculum struct {
	ID         int
	Major      string
	ImagePath  string
	ApuntesURL string
	Institute  string
	CreatedAt  time.Time
}
