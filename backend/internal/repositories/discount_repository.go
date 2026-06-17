package repositories

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories/models"

	"gorm.io/gorm"
)

func toModelDiscount(discount domain.Discount) models.DiscountModel {
	return models.DiscountModel{
		ID:           discount.ID,
		Name:         discount.Name,
		Category:     discount.Category,
		Description:  discount.Description,
		Requirements: discount.Requirements,
		ImagePath:    discount.ImagePath,
		CreatedAt:    discount.CreatedAt,
	}
}

func toDomainDiscount(discount models.DiscountModel) domain.Discount {
	return domain.Discount{
		ID:           discount.ID,
		Name:         discount.Name,
		Category:     discount.Category,
		Description:  discount.Description,
		Requirements: discount.Requirements,
		ImagePath:    discount.ImagePath,
		CreatedAt:    discount.CreatedAt,
	}
}

type DiscountRepository interface {
	Create(discount domain.Discount) (domain.Discount, error)
	List() ([]domain.Discount, error)
	FindByID(id int) (domain.Discount, error)
	Update(discount domain.Discount) (domain.Discount, error)
	Delete(id int) error
}

type PostgresDiscountRepository struct {
	db *gorm.DB
}

func NewPostgresDiscountRepository(db *gorm.DB) *PostgresDiscountRepository {
	return &PostgresDiscountRepository{
		db: db,
	}
}

func (r *PostgresDiscountRepository) Create(discount domain.Discount) (domain.Discount, error) {
	model := toModelDiscount(discount)
	if err := r.db.Create(&model).Error; err != nil {
		return domain.Discount{}, err
	}

	return toDomainDiscount(model), nil
}

func (r *PostgresDiscountRepository) List() ([]domain.Discount, error) {
	var modelList []models.DiscountModel

	if err := r.db.Find(&modelList).Error; err != nil {
		return []domain.Discount{}, err
	}

	var list []domain.Discount

	for _, model := range modelList {
		list = append(list, toDomainDiscount(model))
	}

	return list, nil
}

func (r *PostgresDiscountRepository) FindByID(id int) (domain.Discount, error) {
	var model models.DiscountModel

	if err := r.db.First(&model, id).Error; err != nil {
		return domain.Discount{}, err
	}

	return toDomainDiscount(model), nil
}

func (r *PostgresDiscountRepository) Update(discount domain.Discount) (domain.Discount, error) {
	model := toModelDiscount(discount)

	err := r.db.
		Model(&models.DiscountModel{}).
		Where("id = ?", model.ID).
		Updates(&model).Error

	if err != nil {
		return domain.Discount{}, err
	}

	return toDomainDiscount(model), nil

}

func (r *PostgresDiscountRepository) Delete(id int) error {
	if err := r.db.Delete(&models.DiscountModel{}, id).Error; err != nil {
		return err
	}

	return nil
}
