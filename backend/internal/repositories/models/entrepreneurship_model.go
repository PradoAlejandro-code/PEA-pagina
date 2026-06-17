package models

type EntrepreneurshipModel struct {
	ID         int `gorm:"primaryKey"`
	Name       string
	ImagePath  string
	ContactURL string
}
