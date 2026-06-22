package models

import (
	"time"
)

type CertificateField string

const (
	CertificateID        CertificateField = "id"
	CertificateName      CertificateField = "name"
	CertificateFree      CertificateField = "free"
	CertificatePDFPath   CertificateField = "pdf_path"
	CertificateCreatedAt CertificateField = "created_at"
)

type CertificateModel struct {
	ID        int       `gorm:"primaryKey;column:id"`
	Name      string    `gorm:"column:name"`
	Free      bool      `gorm:"column:free"`
	PDFPath   string    `gorm:"column:pdf_path"`
	CreatedAt time.Time `gorm:"column:created_at"`
}
