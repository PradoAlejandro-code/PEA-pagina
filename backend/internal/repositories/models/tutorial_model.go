package models

import (
	"time"
)

type TutorialModel struct {
	ID        int `gorm:"primaryKey"`
	Name      string
	VideoPath string
	CreatedAt time.Time
}
