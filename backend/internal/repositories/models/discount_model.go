package models

import (
	"time"
)

type DiscountField string

const (
	DiscountID           DiscountField = "id"
	DiscountName         DiscountField = "name"
	DiscountCategory     DiscountField = "category"
	DiscountDescription  DiscountField = "description"
	DiscountRequirements DiscountField = "requirements"
	DiscountImagePath    DiscountField = "image_path"
	DiscountCreatedAt    DiscountField = "created_at"
)

type DiscountModel struct {
	ID           int       `gorm:"primaryKey;column:id"`
	Name         string    `gorm:"column:name"`
	Category     string    `gorm:"column:category"`
	Description  string    `gorm:"column:description"`
	Requirements string    `gorm:"column:requirements"`
	ImagePath    string    `gorm:"column:image_path"`
	CreatedAt    time.Time `gorm:"column:created_at"`
}
