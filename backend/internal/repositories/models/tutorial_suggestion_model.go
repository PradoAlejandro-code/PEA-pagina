package models

import "time"

type TutorialSuggestionField string

const (
	TutorialSuggestionID        TutorialSuggestionField = "id"
	TutorialSuggestionText      TutorialSuggestionField = "text"
	TutorialSuggestionCreatedAt TutorialSuggestionField = "created_at"
)

type TutorialSuggestionModel struct {
	ID        int       `gorm:"primaryKey;column:id"`
	Text      string    `gorm:"column:text"`
	CreatedAt time.Time `gorm:"column:created_at"`
}
