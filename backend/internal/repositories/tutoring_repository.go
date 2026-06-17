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
	Update(tutoring domain.Tutoring) (domain.Tutoring, error)
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

func replaceTutors(db *gorm.DB, tutoringID int, tutors []domain.Tutor) ([]domain.Tutor, error) {
	var tutorIDs []int

	for _, tutor := range tutors {
		tutorIDs = append(tutorIDs, tutor.ID)
	}

	var tutorModels []models.TutorModel

	if len(tutorIDs) > 0 {
		if err := db.Find(&tutorModels, tutorIDs).Error; err != nil {
			return nil, err
		}
	}

	if err := db.Model(&models.TutoringModel{ID: tutoringID}).
		Association("Tutors").
		Replace(&tutorModels); err != nil {
		return nil, err
	}

	var result []domain.Tutor

	for _, tutor := range tutorModels {
		result = append(result, toDomainTutor(tutor))
	}

	return result, nil
}

func (r *PostgresTutoringRepository) Create(tutoring domain.Tutoring) (domain.Tutoring, error) {
	created := toModelTutoring(tutoring)

	var tutorsResult []domain.Tutor

	err := r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&created).Error; err != nil {
			return err
		}

		result, err := replaceTutors(tx, created.ID, tutoring.Tutors)
		if err != nil {
			return err
		}

		tutorsResult = result

		return nil
	})

	if err != nil {
		return domain.Tutoring{}, err
	}

	result := toDomainTutoring(created)
	result.Tutors = tutorsResult

	return result, nil
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

func (r *PostgresTutoringRepository) Update(tutoring domain.Tutoring) (domain.Tutoring, error) {
	updated := toModelTutoring(tutoring)

	var tutorsResult []domain.Tutor

	err := r.db.Transaction(func(tx *gorm.DB) error {

		if err := tx.
			Model(&models.TutoringModel{}).
			Where("id = ?", tutoring.ID).
			Updates(updated).Error; err != nil {
			return err
		}

		var err error
		tutorsResult, err = replaceTutors(tx, updated.ID, tutoring.Tutors)
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return domain.Tutoring{}, err
	}

	result := toDomainTutoring(updated)
	result.Tutors = tutorsResult

	return result, nil
}

func (r *PostgresTutoringRepository) Delete(id int) error {
	if err := r.db.Delete(&models.TutoringModel{}, id).Error; err != nil {
		return err
	}
	return nil
}
