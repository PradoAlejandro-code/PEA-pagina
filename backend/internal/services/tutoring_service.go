package services

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories"
	"PeaBackEnd/internal/storage"
	"mime/multipart"
)

type TutoringService interface {
	Create(tutoring domain.Tutoring, file *multipart.FileHeader) (domain.Tutoring, error)
	List() ([]domain.Tutoring, error)
	FindByID(id int) (domain.Tutoring, error)
	Update(tutoring domain.Tutoring) (domain.Tutoring, error)
	Delete(id int) error
	UpdateFile(id int, file *multipart.FileHeader) (string, error)
}

type tutoringService struct {
	repo    repositories.TutoringRepository
	storage storage.FileStorage
}

func NewTutoringService(repo repositories.TutoringRepository, storage storage.FileStorage) *tutoringService {
	return &tutoringService{
		repo:    repo,
		storage: storage,
	}
}

func (s *tutoringService) Create(tutoring domain.Tutoring, file *multipart.FileHeader) (domain.Tutoring, error) {
	path, err := s.storage.Save(file, storage.TutoringFolder, storage.MaxImageSize, storage.ImageExtensions, storage.ImageMimeTypes)

	if err != nil {
		return domain.Tutoring{}, err
	}

	tutoring.ImagePath = path

	created, err := s.repo.Create(tutoring)

	if err != nil {
		_ = s.storage.Delete(path)
		return domain.Tutoring{}, err
	}

	return created, nil
}

func (s *tutoringService) List() ([]domain.Tutoring, error) {
	list, err := s.repo.List()
	if err != nil {
		return []domain.Tutoring{}, err
	}

	return list, nil
}

func (s *tutoringService) FindByID(id int) (domain.Tutoring, error) {
	found, err := s.repo.FindByID(id)
	if err != nil {
		return domain.Tutoring{}, err
	}
	return found, nil
}

func (s *tutoringService) Update(tutoring domain.Tutoring) (domain.Tutoring, error) {
	updated, err := s.repo.Update(tutoring)
	if err != nil {
		return domain.Tutoring{}, err
	}

	return updated, nil
}

func (s *tutoringService) Delete(id int) error {
	found, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	if err := s.repo.Delete(id); err != nil {
		return err
	}

	if err := s.storage.Delete(found.ImagePath); err != nil {
		return err
	}

	return nil
}

func (s *tutoringService) UpdateFile(id int, file *multipart.FileHeader) (string, error) {
	found, err := s.repo.FindByID(id)
	if err != nil {
		return "", err
	}

	newPath, err := s.storage.Save(file, storage.TutoringFolder, storage.MaxImageSize, storage.ImageExtensions, storage.ImageMimeTypes)

	if err != nil {
		return "", err
	}

	oldPath := found.ImagePath
	found.ImagePath = newPath

	updated, err := s.repo.Update(found)
	if err != nil {
		_ = s.storage.Delete(newPath)
		return "", err
	}

	if err := s.storage.Delete(oldPath); err != nil {
		return "", err
	}

	return updated.ImagePath, nil
}
