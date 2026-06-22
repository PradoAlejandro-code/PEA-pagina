package models

type EntrepreneurshipField string

const (
	EntrepreneurshipID         EntrepreneurshipField = "id"
	EntrepreneurshipName       EntrepreneurshipField = "name"
	EntrepreneurshipImagePath  EntrepreneurshipField = "image_path"
	EntrepreneurshipContactURL EntrepreneurshipField = "contact_url"
)

type EntrepreneurshipModel struct {
	ID         int    `gorm:"primaryKey;column:id"`
	Name       string `gorm:"column:name"`
	ImagePath  string `gorm:"column:image_path"`
	ContactURL string `gorm:"column:contact_url"`
}
