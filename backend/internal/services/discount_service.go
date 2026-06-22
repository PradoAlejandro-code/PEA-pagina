package services

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories"
	"PeaBackEnd/internal/repositories/models"
	"PeaBackEnd/internal/storage"
	"mime/multipart"
)

type DiscountService interface {
	Create(discount domain.Discount, file *multipart.FileHeader) (domain.Discount, error)
	List() ([]domain.Discount, error)
	FindByID(id int) (domain.Discount, error)
	Update(discount domain.Discount) (domain.Discount, error)
	Delete(id int) error
	UpdateFile(id int, file *multipart.FileHeader) (string, error)
}

type discountService struct {
	repo    repositories.DiscountRepository
	storage storage.FileStorage
}

func NewDiscountService(repo repositories.DiscountRepository, storage storage.FileStorage) *discountService {
	return &discountService{
		repo:    repo,
		storage: storage,
	}
}

func (s *discountService) Create(discount domain.Discount, file *multipart.FileHeader) (domain.Discount, error) {
	path, err := s.storage.Save(file, storage.DiscountFolder, storage.MaxImageSize, storage.ImageExtensions, storage.ImageMimeTypes)

	if err != nil {
		return domain.Discount{}, err
	}

	discount.ImagePath = path

	created, err := s.repo.Create(discount)

	if err != nil {
		_ = s.storage.Delete(path)
		return domain.Discount{}, err
	}

	return created, nil
}

func (s *discountService) List() ([]domain.Discount, error) {
	list, err := s.repo.List()
	if err != nil {
		return []domain.Discount{}, err
	}

	return list, err
}

func (s *discountService) FindByID(id int) (domain.Discount, error) {
	found, err := s.repo.FindByID(id)
	if err != nil {
		return domain.Discount{}, err
	}
	return found, nil
}

func (s *discountService) Update(discount domain.Discount) (domain.Discount, error) {
	updatableFields := []string{
		string(models.DiscountName),
		string(models.DiscountCategory),
		string(models.DiscountDescription),
		string(models.DiscountRequirements),
	}

	updated, err := s.repo.Update(discount, updatableFields)
	if err != nil {
		return domain.Discount{}, err
	}

	return updated, err
}

func (s *discountService) Delete(id int) error {
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

func (s *discountService) UpdateFile(id int, file *multipart.FileHeader) (string, error) {
	patchPath := []string{
		string(models.DiscountImagePath),
	}

	found, err := s.repo.FindByID(id)
	if err != nil {
		return "", err
	}

	newPath, err := s.storage.Save(file, storage.DiscountFolder, storage.MaxImageSize, storage.ImageExtensions, storage.ImageMimeTypes)

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
