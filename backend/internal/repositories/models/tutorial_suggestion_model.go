package models

import "time"

type TutorialSuggestionModel struct {
	ID        int `gorm:"primaryKey"`
	Text      string
	CreatedAt time.Time
}
