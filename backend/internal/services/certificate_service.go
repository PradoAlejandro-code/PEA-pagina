package services

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories"
	"PeaBackEnd/internal/storage"
	"mime/multipart"
)

type CertificateService interface {
	Create(certificate domain.Certificate, file *multipart.FileHeader) (domain.Certificate, error)
	List() ([]domain.Certificate, error)
	FindByID(id int) (domain.Certificate, error)
	Update(certificate domain.Certificate) (domain.Certificate, error)
	Delete(int) error
	UpdateFile(id int, file *multipart.FileHeader) (string, error)
}

type certificateService struct {
	repo    repositories.CertificateRepository
	storage storage.FileStorage
}

func NewCertificateService(repo repositories.CertificateRepository, storage storage.FileStorage) *certificateService {
	return &certificateService{
		repo:    repo,
		storage: storage,
	}
}

func (s *certificateService) Create(certificate domain.Certificate, file *multipart.FileHeader) (domain.Certificate, error) {
	path, err := s.storage.Save(file, storage.CertificateFolder, storage.MaxPDFSize, storage.PDFExtensions, storage.VideoMimeTypes)

	if err != nil {
		return domain.Certificate{}, err
	}

	certificate.PDFPath = path

	created, err := s.repo.Create(certificate)

	if err != nil {
		_ = s.storage.Delete(path)
		return domain.Certificate{}, err
	}

	return created, nil
}

func (s *certificateService) List() ([]domain.Certificate, error) {
	list, err := s.repo.List()
	if err != nil {
		return []domain.Certificate{}, err
	}

	return list, nil
}

func (s *certificateService) FindByID(id int) (domain.Certificate, error) {
	found, err := s.repo.FindByID(id)
	if err != nil {
		return domain.Certificate{}, err
	}

	return found, nil
}

func (s *certificateService) Update(certificate domain.Certificate) (domain.Certificate, error) {
	updated, err := s.repo.Update(certificate)
	if err != nil {
		return domain.Certificate{}, err
	}

	return updated, nil
}

func (s *certificateService) Delete(id int) error {
	found, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	if err := s.repo.Delete(id); err != nil {
		return err
	}

	if err := s.storage.Delete(found.PDFPath); err != nil {
		return err
	}

	return nil
}

func (s *certificateService) UpdateFile(id int, file *multipart.FileHeader) (string, error) {
	found, err := s.repo.FindByID(id)
	if err != nil {
		return "", err
	}

	newPath, err := s.storage.Save(file, storage.CertificateFolder, storage.MaxPDFSize, storage.PDFExtensions, storage.VideoMimeTypes)

	if err != nil {
		return "", err
	}

	oldPath := found.PDFPath
	found.PDFPath = newPath

	updated, err := s.repo.Update(found)
	if err != nil {
		_ = s.storage.Delete(newPath)
		return "", err
	}

	if err := s.storage.Delete(oldPath); err != nil {
		return "", err
	}

	return updated.PDFPath, nil
}
