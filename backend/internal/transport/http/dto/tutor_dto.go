package dto

type TutorResponse struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
type CreateTutorRequest struct {
	Name string `json:"name"`
}

type UpdateTutorRequest struct {
	Name string `json:"name"`
}
