package domain

import "time"

type Calendar struct {
	ID        int `gorm:"primaryKey"`
	Title     string
	StartDate time.Time
	EndDate   time.Time
	Style     Style `gorm:"embedded"` // Se aplana en la base de datos
}

type Style struct {
	BgColor        string
	TextColor      string
	Underline      bool
	UnderlineColor string
	IsBold         bool `json:"is_bold"`
}
