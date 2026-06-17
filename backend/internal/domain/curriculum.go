package domain

import (
	"time"
)

type Curriculum struct {
	ID        int
	Major     string
	ImagePath string
	Institute string
	CreatedAt time.Time
}
