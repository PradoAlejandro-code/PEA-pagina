package models

import "time"

type TutoringField string

const (
	TutoringID        TutoringField = "id"
	TutoringImagePath TutoringField = "image_path"
	TutoringMajor     TutoringField = "major"
	TutoringSubject   TutoringField = "subject"
	TutoringPlace     TutoringField = "place"
	TutoringDate      TutoringField = "date"
	TutoringCreatedAt TutoringField = "created_at"
)

type TutoringModel struct {
	ID        int          `gorm:"primaryKey;column:id"`
	ImagePath string       `gorm:"column:image_path"`
	Major     string       `gorm:"column:major"`
	Subject   string       `gorm:"column:subject"`
	Place     string       `gorm:"column:place"`
	Date      time.Time    `gorm:"column:date"`
	CreatedAt time.Time    `gorm:"column:created_at"`
	Tutors    []TutorModel `gorm:"many2many:tutoring_tutor;"`
}
