package repositories

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories/models"

	"gorm.io/gorm"
)

func toModelCurriculum(curriculum domain.Curriculum) models.CurriculumModel {
	return models.CurriculumModel{
		ID:        curriculum.ID,
		Major:     curriculum.Major,
		Institute: curriculum.Institute,
		ImagePath: curriculum.ImagePath,
		CreatedAt: curriculum.CreatedAt,
	}
}

func toDomainCurriculum(curriculum models.CurriculumModel) domain.Curriculum {
	return domain.Curriculum{
		ID:        curriculum.ID,
		Major:     curriculum.Major,
		Institute: curriculum.Institute,
		ImagePath: curriculum.ImagePath,
		CreatedAt: curriculum.CreatedAt,
	}
}

type CurriculumRepository interface {
	Create(curriculum domain.Curriculum) (domain.Curriculum, error)
	List() ([]domain.Curriculum, error)
	FindByID(id int) (domain.Curriculum, error)
	Update(curriculum domain.Curriculum, updatedFields []string) (domain.Curriculum, error)
	Delete(id int) error
}

type PostgresCurriculumRepository struct {
	db *gorm.DB
}

func NewPostgresCurriculumRepository(db *gorm.DB) *PostgresCurriculumRepository {
	return &PostgresCurriculumRepository{
		db: db,
	}
}

func (r *PostgresCurriculumRepository) Create(curriculum domain.Curriculum) (domain.Curriculum, error) {
	model := toModelCurriculum(curriculum)
	if err := r.db.Create(&model).Error; err != nil {
		return domain.Curriculum{}, err
	}

	return toDomainCurriculum(model), nil
}

func (r *PostgresCurriculumRepository) List() ([]domain.Curriculum, error) {
	var modelList []models.CurriculumModel

	if err := r.db.Find(&modelList).Error; err != nil {
		return []domain.Curriculum{}, err
	}

	var list []domain.Curriculum

	for _, model := range modelList {
		list = append(list, toDomainCurriculum(model))
	}

	return list, nil
}

func (r *PostgresCurriculumRepository) FindByID(id int) (domain.Curriculum, error) {
	var model models.CurriculumModel

	if err := r.db.First(&model, id).Error; err != nil {
		return domain.Curriculum{}, err
	}

	return toDomainCurriculum(model), nil
}

func (r *PostgresCurriculumRepository) Update(curriculum domain.Curriculum, updatedFields []string) (domain.Curriculum, error) {
	model := toModelCurriculum(curriculum)

	err := r.db.
		Model(&models.CurriculumModel{}).
		Where("id = ?", model.ID).
		Select(updatedFields).
		Updates(&model).Error

	if err != nil {
		return domain.Curriculum{}, err
	}

	return toDomainCurriculum(model), nil

}

func (r *PostgresCurriculumRepository) Delete(id int) error {
	if err := r.db.Delete(&models.CurriculumModel{}, id).Error; err != nil {
		return err
	}

	return nil
}
