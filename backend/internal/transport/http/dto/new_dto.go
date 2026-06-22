package dto

type UpdateNewRequest struct {
	Title string `json:"title"`
	Text  string `json:"text"`
}

type CreateNewRequest struct {
	Title string `form:"title"`
	Text  string `form:"text"`
}

type UpdateFileNewResponse struct {
	ImagePath string `json:"new_path"`
}

type NewResponse struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	Text      string `json:"text"`
	ImagePath string `json:"image_path"`
}
