package models

import (
	"time"
)

type CertificateModel struct {
	ID        int `gorm:"primaryKey"`
	Name      string
	Free      bool
	PDFPath   string
	CreatedAt time.Time
}
