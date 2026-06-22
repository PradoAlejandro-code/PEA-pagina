package repositories

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories/models"

	"gorm.io/gorm"
)

type TutorialRepository interface {
	Create(tutorial domain.Tutorial) (domain.Tutorial, error)
	List() ([]domain.Tutorial, error)
	FindByID(id int) (domain.Tutorial, error)
	Update(tutorial domain.Tutorial, updatedFields []string) (domain.Tutorial, error)
	Delete(id int) error
}

type PostgresTutorialRepository struct {
	db *gorm.DB
}

func NewPostgresTutorialRepository(db *gorm.DB) *PostgresTutorialRepository {
	return &PostgresTutorialRepository{
		db: db,
	}
}

func toDomainTutorial(m models.TutorialModel) domain.Tutorial {
	return domain.Tutorial{
		ID:        m.ID,
		Name:      m.Name,
		VideoPath: m.VideoPath,
		CreatedAt: m.CreatedAt,
	}
}

func toModelTutorial(tutorial domain.Tutorial) models.TutorialModel {
	return models.TutorialModel{
		ID:        tutorial.ID,
		Name:      tutorial.Name,
		VideoPath: tutorial.VideoPath,
		CreatedAt: tutorial.CreatedAt,
	}
}

func (r *PostgresTutorialRepository) Create(tutorial domain.Tutorial) (domain.Tutorial, error) {
	model := toModelTutorial(tutorial)

	if err := r.db.Create(&model).Error; err != nil {
		return domain.Tutorial{}, err
	}

	return toDomainTutorial(model), nil
}

func (r *PostgresTutorialRepository) List() ([]domain.Tutorial, error) {
	var models []models.TutorialModel

	if err := r.db.Find(&models).Error; err != nil {
		return []domain.Tutorial{}, err
	}

	var list []domain.Tutorial

	for _, model := range models {
		list = append(list, toDomainTutorial(model))
	}

	return list, nil
}

func (r *PostgresTutorialRepository) FindByID(id int) (domain.Tutorial, error) {
	var model models.TutorialModel
	if err := r.db.First(&model, id).Error; err != nil {
		return domain.Tutorial{}, err
	}

	return toDomainTutorial(model), nil
}

func (r *PostgresTutorialRepository) Update(tutorial domain.Tutorial, updatedFields []string) (domain.Tutorial, error) {
	model := toModelTutorial(tutorial)
	err := r.db.
		Model(&models.TutorialModel{}).
		Where("id = ?", model.ID).
		Select(updatedFields).
		Updates(&model).Error

	if err != nil {
		return domain.Tutorial{}, err
	}

	return toDomainTutorial(model), nil
}

func (r *PostgresTutorialRepository) Delete(id int) error {
	if err := r.db.Delete(&models.TutorialModel{}, id).Error; err != nil {
		return err
	}

	return nil
}
