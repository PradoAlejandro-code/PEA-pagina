package domain

import (
	"time"
)

type Certificate struct {
	ID        int
	Name      string
	Free      bool
	PDFPath   string
	CreatedAt time.Time
}
