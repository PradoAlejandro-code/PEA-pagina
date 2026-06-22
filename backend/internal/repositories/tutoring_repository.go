package repositories

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories/models"

	"gorm.io/gorm"
)

type TutoringRepository interface {
	Create(tutoring domain.Tutoring) (domain.Tutoring, error)
	List() ([]domain.Tutoring, error)
	FindByID(id int) (domain.Tutoring, error)
	Update(tutoring domain.Tutoring, updatedFields []string) (domain.Tutoring, error)
	Delete(id int) error
}

type PostgresTutoringRepository struct {
	db *gorm.DB
}

func NewPostgresTutoringRepository(db *gorm.DB) *PostgresTutoringRepository {
	return &PostgresTutoringRepository{
		db: db,
	}
}

func toDomainTutoring(m models.TutoringModel) domain.Tutoring {
	var tutors []domain.Tutor
	for _, model := range m.Tutors {
		tutors = append(tutors, toDomainTutor(model))
	}

	return domain.Tutoring{
		ID:        m.ID,
		ImagePath: m.ImagePath,
		Major:     m.Major,
		Subject:   m.Subject,
		Place:     m.Place,
		Date:      m.Date,
		Tutors:    tutors,
		CreatedAt: m.CreatedAt,
	}
}

func toModelTutoring(d domain.Tutoring) models.TutoringModel {
	return models.TutoringModel{
		ID:        d.ID,
		ImagePath: d.ImagePath,
		Major:     d.Major,
		Subject:   d.Subject,
		Place:     d.Place,
		Date:      d.Date,
		CreatedAt: d.CreatedAt,
	}
}

func (r *PostgresTutoringRepository) Create(tutoring domain.Tutoring) (domain.Tutoring, error) {
	createdModel := toModelTutoring(tutoring)

	var tutorModels []models.TutorModel
	for _, tutor := range tutoring.Tutors {
		tutorModels = append(tutorModels, models.TutorModel{ID: tutor.ID})
	}

	createdModel.Tutors = tutorModels

	err := r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&createdModel).Error; err != nil {
			return err
		}

		if err := tx.Preload("Tutors").First(&createdModel, createdModel.ID).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return domain.Tutoring{}, err
	}

	return toDomainTutoring(createdModel), nil
}

func (r *PostgresTutoringRepository) List() ([]domain.Tutoring, error) {
	var tutoringModels []models.TutoringModel

	err := r.db.Find(&tutoringModels).Error
	if err != nil {
		return []domain.Tutoring{}, err
	}

	var list []domain.Tutoring

	for _, model := range tutoringModels {
		list = append(list, toDomainTutoring(model))
	}

	return list, nil
}

func (r *PostgresTutoringRepository) FindByID(id int) (domain.Tutoring, error) {
	var model models.TutoringModel
	if err := r.db.Preload("Tutors").First(&model, id).Error; err != nil {
		return domain.Tutoring{}, err
	}

	return toDomainTutoring(model), nil
}

func (r *PostgresTutoringRepository) Update(tutoring domain.Tutoring, updatedFields []string) (domain.Tutoring, error) {
	updatedModel := toModelTutoring(tutoring)

	err := r.db.Transaction(func(tx *gorm.DB) error {

		if err := tx.
			Model(&models.TutoringModel{ID: updatedModel.ID}).
			Select(updatedFields).
			Updates(updatedModel).Error; err != nil {
			return err
		}

		var tutorModels []models.TutorModel
		for _, tutor := range tutoring.Tutors {
			tutorModels = append(tutorModels, models.TutorModel{ID: tutor.ID})
		}

		if err := tx.Model(&updatedModel).Association("Tutors").Replace(&tutorModels); err != nil {
			return err
		}

		if err := tx.Preload("Tutors").First(&updatedModel, updatedModel.ID).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return domain.Tutoring{}, err
	}

	return toDomainTutoring(updatedModel), nil
}

func (r *PostgresTutoringRepository) Delete(id int) error {
	if err := r.db.Delete(&models.TutoringModel{}, id).Error; err != nil {
		return err
	}
	return nil
}
