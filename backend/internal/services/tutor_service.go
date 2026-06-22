package services

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories"
	"PeaBackEnd/internal/repositories/models"
)

type TutorService interface {
	Create(tutor domain.Tutor) (domain.Tutor, error)
	List() ([]domain.Tutor, error)
	FindByID(id int) (domain.Tutor, error)
	Update(tutor domain.Tutor) (domain.Tutor, error)
	Delete(id int) error
}

type tutorService struct {
	repo repositories.TutorRepository
}

func NewTutorService(repo repositories.TutorRepository) *tutorService {
	return &tutorService{
		repo: repo,
	}
}

func (s *tutorService) Create(tutor domain.Tutor) (domain.Tutor, error) {
	created, err := s.repo.Create(tutor)
	if err != nil {
		return domain.Tutor{}, err
	}

	return created, err
}

func (s *tutorService) List() ([]domain.Tutor, error) {
	list, err := s.repo.List()
	if err != nil {
		return []domain.Tutor{}, err
	}

	return list, err
}

func (s *tutorService) FindByID(id int) (domain.Tutor, error) {
	found, err := s.repo.FindByID(id)
	if err != nil {
		return domain.Tutor{}, err
	}

	return found, nil
}

func (s *tutorService) Update(tutor domain.Tutor) (domain.Tutor, error) {
	updatableFields := []string{
		string(models.TutorName),
	}

	updated, err := s.repo.Update(tutor, updatableFields)
	if err != nil {
		return domain.Tutor{}, err
	}

	return updated, nil
}

func (s *tutorService) Delete(id int) error {
	if err := s.repo.Delete(id); err != nil {
		return err
	}

	return nil
}
