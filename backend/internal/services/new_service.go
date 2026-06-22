package services

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories"
	"PeaBackEnd/internal/repositories/models"
	"PeaBackEnd/internal/storage"
	"mime/multipart"
)

type NewService interface {
	Create(new domain.New, file *multipart.FileHeader) (domain.New, error)
	List() ([]domain.New, error)
	FindByID(id int) (domain.New, error)
	Update(new domain.New) (domain.New, error)
	Delete(id int) error
	UpdateFile(id int, file *multipart.FileHeader) (string, error)
}

type newService struct {
	repo    repositories.NewRepository
	storage storage.FileStorage
}

func NewNewService(repo repositories.NewRepository, storage storage.FileStorage) *newService {
	return &newService{
		repo:    repo,
		storage: storage,
	}
}

func (s *newService) Create(new domain.New, file *multipart.FileHeader) (domain.New, error) {
	path, err := s.storage.Save(file, storage.NewFolder, storage.MaxImageSize, storage.ImageExtensions, storage.ImageMimeTypes)

	if err != nil {
		return domain.New{}, err
	}

	new.ImagePath = path

	created, err := s.repo.Create(new)

	if err != nil {
		_ = s.storage.Delete(path)
		return domain.New{}, err
	}

	return created, nil
}

func (s *newService) List() ([]domain.New, error) {
	list, err := s.repo.List()
	if err != nil {
		return []domain.New{}, err
	}

	return list, err
}

func (s *newService) FindByID(id int) (domain.New, error) {
	found, err := s.repo.FindByID(id)
	if err != nil {
		return domain.New{}, err
	}
	return found, nil
}

func (s *newService) Update(new domain.New) (domain.New, error) {
	updatableFields := []string{
		string(models.NewTitle),
		string(models.NewText),
	}

	updated, err := s.repo.Update(new, updatableFields)
	if err != nil {
		return domain.New{}, err
	}

	return updated, err
}

func (s *newService) Delete(id int) error {
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

func (s *newService) UpdateFile(id int, file *multipart.FileHeader) (string, error) {
	patchPath := []string{
		string(models.NewImagePath),
	}

	found, err := s.repo.FindByID(id)
	if err != nil {
		return "", err
	}

	newPath, err := s.storage.Save(file, storage.NewFolder, storage.MaxImageSize, storage.ImageExtensions, storage.ImageMimeTypes)
	if err != nil {
		return "", err
	}

	oldPath := found.ImagePath
	found.ImagePath = newPath

	updated, err := s.repo.Update(found, patchPath)
	if err != nil {
		_ = s.storage.Delete(newPath)
		return "", err
	}

	if err := s.storage.Delete(oldPath); err != nil {
		return "", err
	}

	return updated.ImagePath, nil
}
