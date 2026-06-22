package models

type TutorField string

const (
	TutorID   TutorField = "id"
	TutorName TutorField = "name"
)

type TutorModel struct {
	ID        int             `gorm:"primaryKey;column:id"`
	Name      string          `gorm:"column:name"`
	Tutorings []TutoringModel `gorm:"many2many:tutoring_tutor;"`
}
