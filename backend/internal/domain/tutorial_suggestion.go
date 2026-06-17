package domain

import "time"

type TutorialSuggestion struct {
	ID        int
	Text      string
	CreatedAt time.Time
}
