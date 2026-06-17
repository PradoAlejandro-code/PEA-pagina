package dto

import "time"

type CreateCurriculumRequest struct {
	Major     string `form:"major"`
	Institute string `form:"institute"`
}

type UpdateCurriculumRequest struct {
	Major     string `json:"major"`
	Institute string `json:"institute"`
}

type UpdateFileCurriculumResponse struct {
	ImagePath string `json:"new_path"`
}

type CurriculumResponse struct {
	ID        int       `json:"id"`
	Major     string    `json:"major"`
	Institute string    `json:"institute"`
	ImagePath string    `json:"image_path"`
	CreatedAt time.Time `json:"created_at"`
}
