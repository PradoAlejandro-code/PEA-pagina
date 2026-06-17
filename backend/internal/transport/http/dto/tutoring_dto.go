package dto

import "time"

type CreateTutoringRequest struct {
	Major    string    `form:"major"`
	Subject  string    `form:"subject"`
	Place    string    `form:"place"`
	Date     time.Time `form:"date"`
	TutorIDs []int     `form:"tutor_ids"`
}

type UpdateTutoringRequest struct {
	Major    string    `json:"major"`
	Subject  string    `json:"subject"`
	Place    string    `json:"place"`
	Date     time.Time `json:"date"`
	TutorIDs []int     `json:"tutor_ids"`
}

type UpdateFileTutoringResponse struct {
	NewPath string `json:"new_path"`
}

type TutoringResponse struct {
	ID        int             `json:"id"`
	ImagePath string          `json:"img_path"`
	Major     string          `json:"major"`
	Subject   string          `json:"subject"`
	Place     string          `json:"place"`
	Date      time.Time       `json:"date"`
	Tutors    []TutorResponse `json:"tutors"`
	CreatedAt time.Time       `json:"created_at"`
}
