package services

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories"
	"PeaBackEnd/internal/repositories/models"
	"PeaBackEnd/internal/storage"
	"mime/multipart"
)

type TutorialService interface {
	Create(tutorial domain.Tutorial, file *multipart.FileHeader) (domain.Tutorial, error)
	List() ([]domain.Tutorial, error)
	FindByID(id int) (domain.Tutorial, error)
	Update(tutorial domain.Tutorial) (domain.Tutorial, error)
	Delete(id int) error
	UpdateFile(id int, file *multipart.FileHeader) (string, error)
}

type tutorialService struct {
	repo    repositories.TutorialRepository
	storage storage.FileStorage
}

func NewTutorialService(repo repositories.TutorialRepository, storage storage.FileStorage) *tutorialService {
	return &tutorialService{
		repo:    repo,
		storage: storage,
	}
}

func (s *tutorialService) Create(tutorial domain.Tutorial, file *multipart.FileHeader) (domain.Tutorial, error) {
	path, err := s.storage.Save(file, storage.TutorialFolder, storage.MaxVideoSize, storage.VideoExtensions, storage.VideoMimeTypes)

	if err != nil {
		return domain.Tutorial{}, err
	}

	tutorial.VideoPath = path

	created, err := s.repo.Create(tutorial)

	if err != nil {
		_ = s.storage.Delete(path)
		return domain.Tutorial{}, err
	}

	return created, nil
}

func (s *tutorialService) List() ([]domain.Tutorial, error) {
	list, err := s.repo.List()
	if err != nil {
		return []domain.Tutorial{}, err
	}

	return list, nil
}

func (s *tutorialService) FindByID(id int) (domain.Tutorial, error) {
	found, err := s.repo.FindByID(id)
	if err != nil {
		return domain.Tutorial{}, err
	}
	return found, nil
}

func (s *tutorialService) Update(tutorial domain.Tutorial) (domain.Tutorial, error) {
	updatableFields := []string{
		string(models.TutorialName),
	}

	updated, err := s.repo.Update(tutorial, updatableFields)
	if err != nil {
		return domain.Tutorial{}, err
	}

	return updated, nil
}

func (s *tutorialService) Delete(id int) error {
	found, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	if err := s.repo.Delete(id); err != nil {
		return err
	}

	if err := s.storage.Delete(found.VideoPath); err != nil {
		return err
	}

	return nil
}

func (s *tutorialService) UpdateFile(id int, file *multipart.FileHeader) (string, error) {
	patchPath := []string{
		string(models.TutorialVideoPath),
	}

	found, err := s.repo.FindByID(id)
	if err != nil {
		return "", err
	}

	newPath, err := s.storage.Save(file, storage.TutorialFolder, storage.MaxVideoSize, storage.VideoExtensions, storage.VideoMimeTypes)

	if err != nil {
		return "", err
	}

	oldPath := found.VideoPath
	found.VideoPath = newPath

	updated, err := s.repo.Update(found, patchPath)
	if err != nil {
		_ = s.storage.Delete(newPath)
		return "", err
	}

	if err := s.storage.Delete(oldPath); err != nil {
		return "", err
	}

	return updated.VideoPath, nil
}
