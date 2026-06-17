package dto

type UpdateEntrepreneurshipRequest struct {
	Name       string `json:"name"`
	ContactURL string `json:"contact_url"`
}

type CreateEntrepreneurshipRequest struct {
	Name       string `form:"name"`
	ContactURL string `form:"contact_url"`
}

type UpdateFileEntrepreneurshipResponse struct {
	ImagePath string `json:"new_path"`
}

type EntrepreneurshipResponse struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	ImagePath  string `json:"image_path"`
	ContactURL string `json:"contact_url"`
}
