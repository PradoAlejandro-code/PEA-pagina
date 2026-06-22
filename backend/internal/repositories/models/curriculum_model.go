package models

import (
	"time"
)

type CurriculumField string

const (
	CurriculumID        CurriculumField = "id"
	CurriculumMajor     CurriculumField = "major"
	CurriculumImagePath CurriculumField = "image_path"
	CurriculumInstitute CurriculumField = "institute"
	CurriculumCreatedAt CurriculumField = "created_at"
)

type CurriculumModel struct {
	ID        int       `gorm:"primaryKey;column:id"`
	Major     string    `gorm:"column:major"`
	ImagePath string    `gorm:"column:image_path"`
	Institute string    `gorm:"column:institute"`
	CreatedAt time.Time `gorm:"column:created_at"`
}
