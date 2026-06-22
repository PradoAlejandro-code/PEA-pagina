package repositories

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories/models"

	"gorm.io/gorm"
)

type TutorRepository interface {
	Create(tutor domain.Tutor) (domain.Tutor, error)
	List() ([]domain.Tutor, error)
	FindByID(id int) (domain.Tutor, error)
	Update(tutor domain.Tutor, updatedFields []string) (domain.Tutor, error)
	Delete(id int) error
}

type PostgresTutorRepository struct {
	db *gorm.DB
}

func NewPostgresTutorRepository(db *gorm.DB) *PostgresTutorRepository {
	return &PostgresTutorRepository{
		db: db,
	}
}

func toDomainTutor(m models.TutorModel) domain.Tutor {
	return domain.Tutor{
		ID:   m.ID,
		Name: m.Name,
	}
}

func toModelTutor(tutor domain.Tutor) models.TutorModel {
	return models.TutorModel{
		ID:   tutor.ID,
		Name: tutor.Name,
	}
}

func (r *PostgresTutorRepository) Create(tutor domain.Tutor) (domain.Tutor, error) {
	model := toModelTutor(tutor)

	if err := r.db.Create(&model).Error; err != nil {
		return domain.Tutor{}, err
	}

	return toDomainTutor(model), nil
}

func (r *PostgresTutorRepository) List() ([]domain.Tutor, error) {
	var models []models.TutorModel

	if err := r.db.Find(&models).Error; err != nil {
		return []domain.Tutor{}, err
	}

	var list []domain.Tutor

	for _, model := range models {
		list = append(list, toDomainTutor(model))
	}

	return list, nil
}

func (r *PostgresTutorRepository) FindByID(id int) (domain.Tutor, error) {
	var model models.TutorModel
	if err := r.db.First(&model, id).Error; err != nil {
		return domain.Tutor{}, err
	}

	return toDomainTutor(model), nil
}

func (r *PostgresTutorRepository) Update(tutor domain.Tutor, updatedFields []string) (domain.Tutor, error) {
	model := toModelTutor(tutor)
	err := r.db.
		Model(&models.TutorModel{}).
		Where("id = ?", model.ID).
		Select(updatedFields).
		Updates(&model).Error

	if err != nil {
		return domain.Tutor{}, err
	}

	return toDomainTutor(model), nil
}

func (r *PostgresTutorRepository) Delete(id int) error {
	if err := r.db.Delete(&models.TutorModel{}, id).Error; err != nil {
		return err
	}

	return nil
}
