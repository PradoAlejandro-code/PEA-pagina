package repositories

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories/models"
	"errors"

	"gorm.io/gorm"
)

type CertificateRepository interface {
	Create(certificate domain.Certificate) (domain.Certificate, error)
	List() ([]domain.Certificate, error)
	FindByID(id int) (domain.Certificate, error)
	Update(domain.Certificate) (domain.Certificate, error)
	Delete(id int) error
}

type PostgresCertificateRepository struct {
	db *gorm.DB
}

func NewPostgresCertificateRepository(db *gorm.DB) *PostgresCertificateRepository {
	return &PostgresCertificateRepository{
		db: db,
	}
}

func toModelCertificate(certificate domain.Certificate) models.CertificateModel {
	return models.CertificateModel{
		ID:        certificate.ID,
		Name:      certificate.Name,
		Free:      certificate.Free,
		PDFPath:   certificate.PDFPath,
		CreatedAt: certificate.CreatedAt,
	}
}
func toDomainCertificate(certificateModel models.CertificateModel) domain.Certificate {
	return domain.Certificate{
		ID:        certificateModel.ID,
		Name:      certificateModel.Name,
		Free:      certificateModel.Free,
		PDFPath:   certificateModel.PDFPath,
		CreatedAt: certificateModel.CreatedAt,
	}
}

func (r *PostgresCertificateRepository) Create(certificate domain.Certificate) (domain.Certificate, error) {
	model := toModelCertificate(certificate)

	err := r.db.Create(&model).Error

	if err != nil {
		return domain.Certificate{}, err
	}

	return toDomainCertificate(model), nil
}

func (r *PostgresCertificateRepository) List() ([]domain.Certificate, error) {
	var models []models.CertificateModel
	err := r.db.Find(&models).Error
	if err != nil {
		return []domain.Certificate{}, err
	}

	var list []domain.Certificate

	for _, model := range models {
		list = append(list, toDomainCertificate(model))
	}

	return list, nil
}

func (r *PostgresCertificateRepository) FindByID(id int) (domain.Certificate, error) {
	var model models.CertificateModel
	result := r.db.First(&model)

	if result.Error != nil {
		return domain.Certificate{}, result.Error
	}

	if result.RowsAffected == 0 {
		return domain.Certificate{}, errors.New("not found")
	}

	return toDomainCertificate(model), nil
}

func (r *PostgresCertificateRepository) Update(certificate domain.Certificate) (domain.Certificate, error) {
	updated := toModelCertificate(certificate)

	result := r.db.
		Model(&models.CertificateModel{}).
		Where("id = ?", certificate.ID).
		Updates(updated)

	if result.Error != nil {
		return domain.Certificate{}, result.Error
	}

	if result.RowsAffected == 0 {
		return domain.Certificate{}, errors.New("not found")
	}

	return toDomainCertificate(updated), nil
}

func (r *PostgresCertificateRepository) Delete(id int) error {
	err := r.db.Delete(&domain.Certificate{}, id).Error

	if err != nil {
		return err
	}

	return nil
}
