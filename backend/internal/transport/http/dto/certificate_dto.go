package dto

import "time"

type CreateCertificateRequest struct {
	Name string `form:"name" binding:"required"`
	Free bool   `form:"is_free" binding:"required"`
}

type UpdateCertificateRequest struct {
	Name string `json:"name"`
	Free bool   `json:"is_free"`
}

type UpdateFileCertificateResponse struct {
	NewPath string `json:"new_path"`
}

type CertificateResponse struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Free      bool      `json:"is_free"`
	PDFPath   string    `json:"pdf_path"`
	CreatedAt time.Time `json:"created_at"`
}
