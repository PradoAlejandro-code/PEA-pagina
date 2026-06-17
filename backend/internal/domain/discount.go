package domain

import (
	"time"
)

type Discount struct {
	ID           int
	Name         string
	Category     string
	Description  string
	Requirements string
	ImagePath    string
	CreatedAt    time.Time
}
