package domain

import (
	"time"
)

type Tutorial struct {
	ID        int
	Name      string
	VideoPath string
	CreatedAt time.Time
}
