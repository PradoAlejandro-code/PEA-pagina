package models

import (
	"time"
)

type DiscountModel struct {
	ID           int `gorm:"primaryKey"`
	Name         string
	Category     string
	Description  string
	Requirements string
	ImagePath    string
	CreatedAt    time.Time
}
