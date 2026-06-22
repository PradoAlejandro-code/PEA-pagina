package repositories

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories/models"

	"gorm.io/gorm"
)

func toModelNew(new domain.New) models.NewModel {
	return models.NewModel{
		ID:        new.ID,
		Title:     new.Title,
		Text:      new.Text,
		ImagePath: new.ImagePath,
	}
}

func toDomainNew(new models.NewModel) domain.New {
	return domain.New{
		ID:        new.ID,
		Title:     new.Title,
		Text:      new.Text,
		ImagePath: new.ImagePath,
	}
}

type NewRepository interface {
	Create(new domain.New) (domain.New, error)
	List() ([]domain.New, error)
	FindByID(id int) (domain.New, error)
	Update(new domain.New, updatedFields []string) (domain.New, error)
	Delete(id int) error
}

type PostgresNewRepository struct {
	db *gorm.DB
}

func NewPostgresNewRepository(db *gorm.DB) *PostgresNewRepository {
	return &PostgresNewRepository{
		db: db,
	}
}

func (r *PostgresNewRepository) Create(new domain.New) (domain.New, error) {
	model := toModelNew(new)
	if err := r.db.Create(&model).Error; err != nil {
		return domain.New{}, err
	}

	return toDomainNew(model), nil
}

func (r *PostgresNewRepository) List() ([]domain.New, error) {
	var modelList []models.NewModel

	if err := r.db.Find(&modelList).Error; err != nil {
		return []domain.New{}, err
	}

	var list []domain.New

	for _, model := range modelList {
		list = append(list, toDomainNew(model))
	}

	return list, nil
}

func (r *PostgresNewRepository) FindByID(id int) (domain.New, error) {
	var model models.NewModel

	if err := r.db.First(&model, id).Error; err != nil {
		return domain.New{}, err
	}

	return toDomainNew(model), nil
}

func (r *PostgresNewRepository) Update(new domain.New, updatedFields []string) (domain.New, error) {
	model := toModelNew(new)

	err := r.db.
		Model(&models.NewModel{}).
		Where("id = ?", model.ID).
		Select(updatedFields).
		Updates(&model).Error

	if err != nil {
		return domain.New{}, err
	}

	return toDomainNew(model), nil

}

func (r *PostgresNewRepository) Delete(id int) error {
	if err := r.db.Delete(&models.NewModel{}, id).Error; err != nil {
		return err
	}

	return nil
}
