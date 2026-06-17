package dto

import "time"

type Tutorial struct {
	ID        int
	Name      string
	VideoPath string
	CreatedAt time.Time
}

type CreateTutorialRequest struct {
	Name string `from:"name"`
}

type UpdateTutorialRequest struct {
	Name string `json:"name"`
}

type UpdateFileTutorialResponse struct {
	NewPath string `json:"new_path"`
}

type TutorialResponse struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	VideoPath string    `json:"video_path"`
	CreatedAt time.Time `json:"created_at"`
}
