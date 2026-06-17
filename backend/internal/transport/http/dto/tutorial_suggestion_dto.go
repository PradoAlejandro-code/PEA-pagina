package dto

import "time"

type TutorialSuggestionResponse struct {
	ID        int       `json:"id"`
	Text      string    `json:"Text"`
	CreatedAt time.Time `json:"created_at"`
}
type CreateTutorialSuggestionRequest struct {
	Text string `json:"Text"`
}

type UpdateTutorialSuggestionRequest struct {
	Text string `json:"Text"`
}
