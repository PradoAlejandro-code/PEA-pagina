package services

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories"
)

type TutorialSuggestionService interface {
	Create(tutorialSuggestion domain.TutorialSuggestion) (domain.TutorialSuggestion, error)
	List() ([]domain.TutorialSuggestion, error)
	FindByID(id int) (domain.TutorialSuggestion, error)
	Update(tutorialSuggestion domain.TutorialSuggestion) (domain.TutorialSuggestion, error)
	Delete(id int) error
}

type tutorialSuggestionService struct {
	repo repositories.TutorialSuggestionRepository
}

func NewTutorialSuggestionService(repo repositories.TutorialSuggestionRepository) *tutorialSuggestionService {
	return &tutorialSuggestionService{
		repo: repo,
	}
}

func (s *tutorialSuggestionService) Create(tutorialSuggestion domain.TutorialSuggestion) (domain.TutorialSuggestion, error) {
	created, err := s.repo.Create(tutorialSuggestion)
	if err != nil {
		return domain.TutorialSuggestion{}, err
	}

	return created, err
}

func (s *tutorialSuggestionService) List() ([]domain.TutorialSuggestion, error) {
	list, err := s.repo.List()
	if err != nil {
		return []domain.TutorialSuggestion{}, err
	}

	return list, err
}

func (s *tutorialSuggestionService) FindByID(id int) (domain.TutorialSuggestion, error) {
	found, err := s.repo.FindByID(id)
	if err != nil {
		return domain.TutorialSuggestion{}, err
	}

	return found, nil
}

func (s *tutorialSuggestionService) Update(tutorialSuggestion domain.TutorialSuggestion) (domain.TutorialSuggestion, error) {
	updated, err := s.repo.Update(tutorialSuggestion)
	if err != nil {
		return domain.TutorialSuggestion{}, err
	}

	return updated, nil
}

func (s *tutorialSuggestionService) Delete(id int) error {
	if err := s.repo.Delete(id); err != nil {
		return err
	}

	return nil
}
