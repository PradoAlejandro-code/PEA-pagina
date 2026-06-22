package models

type UserField string

const (
	UserID       UserField = "id"
	UserUsername UserField = "username"
	UserPassword UserField = "password"
	UserRole     UserField = "role"
)

type UserModel struct {
	ID       uint   `gorm:"primaryKey;column:id"`
	Username string `gorm:"column:username"`
	Password string `gorm:"column:password"`
	Role     string `gorm:"column:role"`
}
