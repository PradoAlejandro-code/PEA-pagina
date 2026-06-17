package dto

import "time"

type UpdateDiscountRequest struct {
	Name         string `json:"name"`
	Category     string `json:"category"`
	Description  string `json:"description"`
	Requirements string `json:"requirements"`
}

type CreateDiscountRequest struct {
	Name         string `form:"name"`
	Category     string `form:"category"`
	Description  string `form:"description"`
	Requirements string `form:"requirements"`
}

type UpdateFileDiscountResponse struct {
	ImagePath string `json:"new_path"`
}

type DiscountResponse struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	ImagePath    string    `json:"image_path"`
	Category     string    `json:"category"`
	Description  string    `json:"description"`
	Requirements string    `json:"requirements"`
	CreatedAt    time.Time `json:"created_at"`
}
