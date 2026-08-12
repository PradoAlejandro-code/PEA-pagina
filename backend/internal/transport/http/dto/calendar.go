package dto

type StyleDTO struct {
	BgColor        string `json:"bg_color" binding:"omitempty,hexcolor"`
	TextColor      string `json:"text_color" binding:"omitempty,hexcolor"`
	Underline      bool   `json:"underline"`
	UnderlineColor string `json:"underline_color" binding:"omitempty,hexcolor"`
	IsBold         bool   `json:"is_bold"`
}

type CreateCalendarRequest struct {
	Title     string   `json:"title" binding:"required"`
	StartDate string   `json:"start_date" binding:"required"`
	EndDate   string   `json:"end_date" binding:"required"`
	Style     StyleDTO `json:"style"`
}

type UpdateCalendarRequest struct {
	Title     string   `json:"title" binding:"required"`
	StartDate string   `json:"start_date" binding:"required"`
	EndDate   string   `json:"end_date" binding:"required"`
	Style     StyleDTO `json:"style"`
}

type CalendarResponse struct {
	ID        int      `json:"id"`
	Title     string   `json:"title"`
	StartDate string   `json:"start_date"`
	EndDate   string   `json:"end_date"`
	Style     StyleDTO `json:"style"`
}
