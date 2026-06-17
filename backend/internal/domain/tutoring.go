package domain

import "time"

type Tutoring struct {
	ID        int
	ImagePath string
	Major     string
	Subject   string
	Place     string
	Date      time.Time
	Tutors    []Tutor
	CreatedAt time.Time
}
