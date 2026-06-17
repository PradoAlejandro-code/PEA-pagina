package models

import "time"

type TutoringModel struct {
	ID        int `gorm:"primaryKey"`
	ImagePath string
	Major     string
	Subject   string
	Place     string
	Date      time.Time
	CreatedAt time.Time
	Tutors    []TutorModel `gorm:"many2many:tutoring_tutor;"`
}
