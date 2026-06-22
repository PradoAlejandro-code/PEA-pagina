package models

type NewField string

const (
	NewID        NewField = "id"
	NewTitle     NewField = "title"
	NewText      NewField = "text"
	NewImagePath NewField = "image_path"
)

type NewModel struct {
	ID        int    `gorm:"primaryKey;column:id"`
	Title     string `gorm:"column:title"`
	Text      string `gorm:"column:text"`
	ImagePath string `gorm:"column:image_path"`
}
