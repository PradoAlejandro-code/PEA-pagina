package models

type TutorModel struct {
	ID        int
	Name      string
	Tutorings []TutoringModel `gorm:"many2many:tutoring_tutor;"`
}
