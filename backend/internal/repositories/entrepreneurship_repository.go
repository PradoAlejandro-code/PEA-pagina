package repositories

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories/models"

	"gorm.io/gorm"
)

func toModelEntrepreneurship(entrepreneurship domain.Entrepreneurship) models.EntrepreneurshipModel {
	return models.EntrepreneurshipModel{
		ID:         entrepreneurship.ID,
		Name:       entrepreneurship.Name,
		ImagePath:  entrepreneurship.ImagePath,
		ContactURL: entrepreneurship.ContactURL,
	}
}

func toDomainEntrepreneurship(entrepreneurship models.EntrepreneurshipModel) domain.Entrepreneurship {
	return domain.Entrepreneurship{
		ID:         entrepreneurship.ID,
		Name:       entrepreneurship.Name,
		ImagePath:  entrepreneurship.ImagePath,
		ContactURL: entrepreneurship.ContactURL,
	}
}

type EntrepreneurshipRepository interface {
	Create(entrepreneurship domain.Entrepreneurship) (domain.Entrepreneurship, error)
	List() ([]domain.Entrepreneurship, error)
	FindByID(id int) (domain.Entrepreneurship, error)
	Update(entrepreneurship domain.Entrepreneurship) (domain.Entrepreneurship, error)
	Delete(id int) error
}

type PostgresEntrepreneurshipRepository struct {
	db *gorm.DB
}

func NewPostgresEntrepreneurshipRepository(db *gorm.DB) *PostgresEntrepreneurshipRepository {
	return &PostgresEntrepreneurshipRepository{
		db: db,
	}
}

func (r *PostgresEntrepreneurshipRepository) Create(entrepreneurship domain.Entrepreneurship) (domain.Entrepreneurship, error) {
	model := toModelEntrepreneurship(entrepreneurship)
	if err := r.db.Create(&model).Error; err != nil {
		return domain.Entrepreneurship{}, err
	}

	return toDomainEntrepreneurship(model), nil
}

func (r *PostgresEntrepreneurshipRepository) List() ([]domain.Entrepreneurship, error) {
	var modelList []models.EntrepreneurshipModel

	if err := r.db.Find(&modelList).Error; err != nil {
		return []domain.Entrepreneurship{}, err
	}

	var list []domain.Entrepreneurship

	for _, model := range modelList {
		list = append(list, toDomainEntrepreneurship(model))
	}

	return list, nil
}

func (r *PostgresEntrepreneurshipRepository) FindByID(id int) (domain.Entrepreneurship, error) {
	var model models.EntrepreneurshipModel

	if err := r.db.First(&model, id).Error; err != nil {
		return domain.Entrepreneurship{}, err
	}

	return toDomainEntrepreneurship(model), nil
}

func (r *PostgresEntrepreneurshipRepository) Update(entrepreneurship domain.Entrepreneurship) (domain.Entrepreneurship, error) {
	model := toModelEntrepreneurship(entrepreneurship)

	err := r.db.
		Model(&models.EntrepreneurshipModel{}).
		Where("id = ?", model.ID).
		Updates(&model).Error

	if err != nil {
		return domain.Entrepreneurship{}, err
	}

	return toDomainEntrepreneurship(model), nil

}

func (r *PostgresEntrepreneurshipRepository) Delete(id int) error {
	if err := r.db.Delete(&models.EntrepreneurshipModel{}, id).Error; err != nil {
		return err
	}

	return nil
}
