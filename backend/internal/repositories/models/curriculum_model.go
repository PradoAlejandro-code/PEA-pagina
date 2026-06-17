package models

import (
	"time"
)

type CurriculumModel struct {
	ID        int `gorm:"primaryKey"`
	Major     string
	ImagePath string
	Institute string
	CreatedAt time.Time
}
