package repositories

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories/models"

	"gorm.io/gorm"
)

type TutorialSuggestionRepository interface {
	Create(tutorialSuggestion domain.TutorialSuggestion) (domain.TutorialSuggestion, error)
	List() ([]domain.TutorialSuggestion, error)
	FindByID(id int) (domain.TutorialSuggestion, error)
	Update(totorialSuggestion domain.TutorialSuggestion, updatedFields []string) (domain.TutorialSuggestion, error)
	Delete(id int) error
}

type PostgresTutorialSuggestionRepository struct {
	db *gorm.DB
}

func NewPostgresTutorialSuggestionRepository(db *gorm.DB) *PostgresTutorialSuggestionRepository {
	return &PostgresTutorialSuggestionRepository{
		db: db,
	}
}

func toDomainTutorialSuggestion(m models.TutorialSuggestionModel) domain.TutorialSuggestion {
	return domain.TutorialSuggestion{
		ID:        m.ID,
		Text:      m.Text,
		CreatedAt: m.CreatedAt,
	}
}

func toModelTutorialSuggestion(tutorialSuggestion domain.TutorialSuggestion) models.TutorialSuggestionModel {
	return models.TutorialSuggestionModel{
		ID:        tutorialSuggestion.ID,
		Text:      tutorialSuggestion.Text,
		CreatedAt: tutorialSuggestion.CreatedAt,
	}
}

func (r *PostgresTutorialSuggestionRepository) Create(tutorialSuggestion domain.TutorialSuggestion) (domain.TutorialSuggestion, error) {
	model := toModelTutorialSuggestion(tutorialSuggestion)

	if err := r.db.Create(&model).Error; err != nil {
		return domain.TutorialSuggestion{}, err
	}

	return toDomainTutorialSuggestion(model), nil
}

func (r *PostgresTutorialSuggestionRepository) List() ([]domain.TutorialSuggestion, error) {
	var models []models.TutorialSuggestionModel

	if err := r.db.Find(&models).Error; err != nil {
		return []domain.TutorialSuggestion{}, err
	}

	var list []domain.TutorialSuggestion

	for _, model := range models {
		list = append(list, toDomainTutorialSuggestion(model))
	}

	return list, nil
}

func (r *PostgresTutorialSuggestionRepository) FindByID(id int) (domain.TutorialSuggestion, error) {
	var model models.TutorialSuggestionModel
	if err := r.db.First(&model, id).Error; err != nil {
		return domain.TutorialSuggestion{}, err
	}

	return toDomainTutorialSuggestion(model), nil
}

func (r *PostgresTutorialSuggestionRepository) Update(tutorialSuggestion domain.TutorialSuggestion, updatedFields []string) (domain.TutorialSuggestion, error) {
	model := toModelTutorialSuggestion(tutorialSuggestion)
	err := r.db.
		Model(&models.TutorialSuggestionModel{}).
		Where("id = ?", model.ID).
		Select(updatedFields).
		Updates(&model).Error

	if err != nil {
		return domain.TutorialSuggestion{}, err
	}

	return toDomainTutorialSuggestion(model), nil
}

func (r *PostgresTutorialSuggestionRepository) Delete(id int) error {
	if err := r.db.Delete(&models.TutorialSuggestionModel{}, id).Error; err != nil {
		return err
	}

	return nil
}
