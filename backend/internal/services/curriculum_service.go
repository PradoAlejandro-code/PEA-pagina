package services

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories"
	"PeaBackEnd/internal/repositories/models"
	"PeaBackEnd/internal/storage"
	"mime/multipart"
)

type CurriculumService interface {
	Create(curriculum domain.Curriculum, file *multipart.FileHeader) (domain.Curriculum, error)
	List() ([]domain.Curriculum, error)
	FindByID(id int) (domain.Curriculum, error)
	Update(curriculum domain.Curriculum) (domain.Curriculum, error)
	Delete(id int) error
	UpdateFile(id int, file *multipart.FileHeader) (string, error)
}

type curriculumService struct {
	repo    repositories.CurriculumRepository
	storage storage.FileStorage
}

func NewCurriculumService(repo repositories.CurriculumRepository, storage storage.FileStorage) *curriculumService {
	return &curriculumService{
		repo:    repo,
		storage: storage,
	}
}

func (s *curriculumService) Create(curriculum domain.Curriculum, file *multipart.FileHeader) (domain.Curriculum, error) {
	path, err := s.storage.Save(file, storage.CurriculumFolder, storage.MaxImageSize, storage.ImageExtensions, storage.ImageMimeTypes)

	if err != nil {
		return domain.Curriculum{}, err
	}

	curriculum.ImagePath = path

	created, err := s.repo.Create(curriculum)

	if err != nil {
		_ = s.storage.Delete(path)
		return domain.Curriculum{}, err
	}

	return created, nil
}

func (s *curriculumService) List() ([]domain.Curriculum, error) {
	list, err := s.repo.List()
	if err != nil {
		return []domain.Curriculum{}, err
	}

	return list, nil
}

func (s *curriculumService) FindByID(id int) (domain.Curriculum, error) {
	found, err := s.repo.FindByID(id)
	if err != nil {
		return domain.Curriculum{}, err
	}
	return found, nil
}

func (s *curriculumService) Update(curriculum domain.Curriculum) (domain.Curriculum, error) {
	var updatableFields = []string{
		string(models.CurriculumMajor),
		string(models.CurriculumInstitute),
	}

	updated, err := s.repo.Update(curriculum, updatableFields)
	if err != nil {
		return domain.Curriculum{}, err
	}

	return updated, err
}

func (s *curriculumService) Delete(id int) error {
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

func (s *curriculumService) UpdateFile(id int, file *multipart.FileHeader) (string, error) {
	var patchPath = []string{
		string(models.CurriculumImagePath),
	}

	found, err := s.repo.FindByID(id)
	if err != nil {
		return "", err
	}

	newPath, err := s.storage.Save(file, storage.CurriculumFolder, storage.MaxImageSize, storage.ImageExtensions, storage.ImageMimeTypes)

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
