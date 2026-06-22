package services

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories"
	"PeaBackEnd/internal/repositories/models"
	"PeaBackEnd/internal/storage"
	"mime/multipart"
)

type EntrepreneurshipService interface {
	Create(entrepreneurship domain.Entrepreneurship, file *multipart.FileHeader) (domain.Entrepreneurship, error)
	List() ([]domain.Entrepreneurship, error)
	FindByID(id int) (domain.Entrepreneurship, error)
	Update(entrepreneurship domain.Entrepreneurship) (domain.Entrepreneurship, error)
	Delete(id int) error
	UpdateFile(id int, file *multipart.FileHeader) (string, error)
}

type entrepreneurshipService struct {
	repo    repositories.EntrepreneurshipRepository
	storage storage.FileStorage
}

func NewEntrepreneurshipService(repo repositories.EntrepreneurshipRepository, storage storage.FileStorage) *entrepreneurshipService {
	return &entrepreneurshipService{
		repo:    repo,
		storage: storage,
	}
}

func (s *entrepreneurshipService) Create(entrepreneurship domain.Entrepreneurship, file *multipart.FileHeader) (domain.Entrepreneurship, error) {
	path, err := s.storage.Save(file, storage.EntrepreneurshipFolder, storage.MaxImageSize, storage.ImageExtensions, storage.ImageMimeTypes)

	if err != nil {
		return domain.Entrepreneurship{}, err
	}

	entrepreneurship.ImagePath = path

	created, err := s.repo.Create(entrepreneurship)

	if err != nil {
		_ = s.storage.Delete(path)
		return domain.Entrepreneurship{}, err
	}

	return created, nil
}

func (s *entrepreneurshipService) List() ([]domain.Entrepreneurship, error) {
	list, err := s.repo.List()
	if err != nil {
		return []domain.Entrepreneurship{}, err
	}

	return list, err
}

func (s *entrepreneurshipService) FindByID(id int) (domain.Entrepreneurship, error) {
	found, err := s.repo.FindByID(id)
	if err != nil {
		return domain.Entrepreneurship{}, err
	}
	return found, nil
}

func (s *entrepreneurshipService) Update(entrepreneurship domain.Entrepreneurship) (domain.Entrepreneurship, error) {
	updatableFields := []string{
		string(models.EntrepreneurshipName),
		string(models.EntrepreneurshipContactURL),
	}

	updated, err := s.repo.Update(entrepreneurship, updatableFields)
	if err != nil {
		return domain.Entrepreneurship{}, err
	}

	return updated, err
}

func (s *entrepreneurshipService) Delete(id int) error {
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

func (s *entrepreneurshipService) UpdateFile(id int, file *multipart.FileHeader) (string, error) {
	patchPath := []string{
		string(models.EntrepreneurshipImagePath),
	}

	found, err := s.repo.FindByID(id)
	if err != nil {
		return "", err
	}

	newPath, err := s.storage.Save(file, storage.EntrepreneurshipFolder, storage.MaxImageSize, storage.ImageExtensions, storage.ImageMimeTypes)
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
