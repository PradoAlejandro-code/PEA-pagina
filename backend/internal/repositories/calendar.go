package repositories

import (
	"PeaBackEnd/internal/domain"
	"context"

	"gorm.io/gorm"
)

type Calendar interface {
	Create(ctx context.Context, value domain.Calendar) error
	FindByID(ctx context.Context, id int) (domain.Calendar, error)
	Update(ctx context.Context, value domain.Calendar) error
	Delete(ctx context.Context, id int) error
	List(ctx context.Context) ([]domain.Calendar, error)
}

type calendar struct {
	db *gorm.DB
}

func (r *calendar) Create(ctx context.Context, value domain.Calendar) error {
	if err := r.db.WithContext(ctx).Create(&value).Error; err != nil {
		return err
	}

	return nil
}
func (r *calendar) FindByID(ctx context.Context, id int) (*domain.Calendar, error) {
	var found *domain.Calendar

	if err := r.db.WithContext(ctx).First(found, id).Error; err != nil {
		return nil, err
	}

	return found, nil
}

func (r *calendar) Update(ctx context.Context, value domain.Calendar) error {
	return r.db.WithContext(ctx).
		Model(&domain.Calendar{}).
		Where("id = ?", value.ID).
		Updates(map[string]any{
			"title":           value.Title,
			"start_date":      value.StartDate,
			"end_date":        value.EndDate,
			"bg_color":        value.Style.BgColor,
			"text_color":      value.Style.TextColor,
			"underline":       value.Style.Underline,
			"underline_color": value.Style.UnderlineColor,
			"is_bold":         value.Style.IsBold,
		}).Error
}

func (r *calendar) Delete(ctx context.Context, id int) error {
	return r.db.WithContext(ctx).
		Delete(&domain.Calendar{}, id).
		Error
}

func (r *calendar) List(ctx context.Context) ([]domain.Calendar, error) {
	var list []domain.Calendar

	if err := r.db.Find(list).Error; err != nil {
		return nil, err
	}

	return list, nil
}
