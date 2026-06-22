package models

import (
	"time"
)

type TutorialField string

const (
	TutorialID        TutorialField = "id"
	TutorialName      TutorialField = "name"
	TutorialVideoPath TutorialField = "video_path"
	TutorialCreatedAt TutorialField = "created_at"
)

type TutorialModel struct {
	ID        int       `gorm:"primaryKey;column:id"`
	Name      string    `gorm:"column:name"`
	VideoPath string    `gorm:"column:video_path"`
	CreatedAt time.Time `gorm:"column:created_at"`
}
