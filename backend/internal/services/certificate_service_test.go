package services

// import (
// 	"PeaBackEnd/internal/domain"
// 	"fmt"
// 	"mime/multipart"
// 	"testing"
// 	"time"
// )

// var FixedTime = time.Date(2026, time.June, 14, 12, 0, 0, 0, time.UTC)

// type MockCertificateRepository struct {
// }

// func NewMockCertificateRepository() *MockCertificateRepository {
// 	return &MockCertificateRepository{}
// }

// func (r *MockCertificateRepository) Create(certificate domain.Certificate) (domain.Certificate, error) {

// 	return domain.Certificate{
// 		ID:        1,
// 		Name:      certificate.Name,
// 		Free:      certificate.Free,
// 		PDFPath:   certificate.PDFPath,
// 		CreatedAt: FixedTime,
// 	}, nil

// }

// func (r *MockCertificateRepository) List() ([]domain.Certificate, error) {
// 	var certificates []domain.Certificate

// 	for i := range 5 {
// 		certificates = append(certificates, domain.Certificate{
// 			ID:        i,
// 			Name:      fmt.Sprintf("Name %d", i),
// 			Free:      false,
// 			PDFPath:   fmt.Sprintf("certificates/certificate_%d", i),
// 			CreatedAt: FixedTime,
// 		})

// 	}

// 	return certificates, nil
// }

// func (r *MockCertificateRepository) FindByID(id int) (domain.Certificate, error) {
// 	return domain.Certificate{
// 		ID:        id,
// 		Name:      "testing",
// 		Free:      false,
// 		PDFPath:   "certificates/certificate_test",
// 		CreatedAt: FixedTime,
// 	}, nil
// }

// func (r *MockCertificateRepository) Update(certificate domain.Certificate) (domain.Certificate, error) {
// 	return certificate, nil
// }

// func (r *MockCertificateRepository) Delete(id int) error {
// 	return nil
// }

// type MockFileStorage struct {
// 	DeletedPath string
// 	SavedPath   string
// }

// func NewMockFileStorage() *MockFileStorage {
// 	return &MockFileStorage{
// 		SavedPath: "certificates/certificate_test",
// 	}
// }

// func (s *MockFileStorage) Save(
// 	file *multipart.FileHeader,
// 	folder string,
// 	maxSize int64,
// 	allowedExtensions []string,
// 	allowedMimeTypes []string,
// ) (string, error) {
// 	if file != nil {
// 		s.SavedPath = folder + "/" + file.Filename
// 	}
// 	return s.SavedPath, nil
// }

// func (s *MockFileStorage) Delete(path string) error {
// 	s.DeletedPath = path
// 	return nil
// }

// func TestCreateCertificate(t *testing.T) {

// 	repo := NewMockCertificateRepository()
// 	storage := NewMockFileStorage()
// 	service := NewCertificateService(repo, storage)

// 	certificate := domain.Certificate{
// 		Name: "testing",
// 		Free: false,
// 	}

// 	created, err := service.Create(certificate, nil)

// 	if err != nil {
// 		t.Fatal(err)
// 	}

// 	if created.ID != 1 {
// 		t.Errorf(
// 			"expected ID 1, got %d instead",
// 			created.ID,
// 		)
// 	}

// 	if created.PDFPath != "certificates/certificate_test" {
// 		t.Errorf(
// 			"expected PDFPath 'certificates/certificate_test', got %s instead",
// 			created.PDFPath,
// 		)
// 	}

// 	if created.Name != "testing" {
// 		t.Errorf(
// 			"expected name 'testing', got %s instead",
// 			created.Name,
// 		)
// 	}

// 	if created.Free != false {
// 		t.Error(
// 			"expected free to be flase",
// 		)
// 	}

// 	if !created.CreatedAt.Equal(FixedTime) {
// 		t.Errorf(
// 			"expected certificate time to be %v, got %v instead",
// 			FixedTime, certificate.CreatedAt,
// 		)
// 	}
// }

// func TestListCertificate(t *testing.T) {

// 	repo := NewMockCertificateRepository()
// 	storage := NewMockFileStorage()
// 	service := NewCertificateService(repo, storage)

// 	certificates, err := service.List()

// 	if err != nil {
// 		t.Fatal(err)
// 	}

// 	if len(certificates) != 5 {
// 		t.Error(
// 			"expected certificates list to be of size 5",
// 		)
// 	}

// 	for i, certificate := range certificates {
// 		if certificate.ID != i {
// 			t.Errorf(
// 				"expected certificate number %d id to be %d, got %d instead",
// 				i, i, certificate.ID,
// 			)
// 		}

// 		if certificate.Name != fmt.Sprintf("Name %d", i) {
// 			t.Errorf(
// 				"expected certificate number %d name to be %s, got %s instead",
// 				i, fmt.Sprintf("Name %d", i), certificate.Name,
// 			)
// 		}

// 		if certificate.Free != false {
// 			t.Errorf(
// 				"expected certificate number %d to be true",
// 				i,
// 			)
// 		}

// 		if certificate.PDFPath != fmt.Sprintf("certificates/certificate_%d", i) {
// 			t.Errorf(
// 				"expected certificate number %d to be %s, got %s instead instead",
// 				i, fmt.Sprintf("certificates/certificate_%d", i), certificate.PDFPath,
// 			)
// 		}

// 		if !certificate.CreatedAt.Equal(FixedTime) {
// 			t.Errorf(
// 				"expected certificate number %d time to be %v, got %v instead",
// 				i, FixedTime, certificate.CreatedAt,
// 			)
// 		}
// 	}
// }

// func TestFindByIDCertificate(t *testing.T) {

// 	repo := NewMockCertificateRepository()
// 	storage := NewMockFileStorage()
// 	service := NewCertificateService(repo, storage)

// 	id := 1

// 	found, err := service.FindByID(id)

// 	if err != nil {
// 		t.Fatal(err)
// 	}

// 	if found.ID != 1 {
// 		t.Errorf(
// 			"expected ID 1, got %d instead",
// 			found.ID,
// 		)
// 	}

// 	if found.PDFPath != "certificates/certificate_test" {
// 		t.Errorf(
// 			"expected PDFPath 'certificates/certificate_test', got %s instead",
// 			found.PDFPath,
// 		)
// 	}

// 	if found.Name != "testing" {
// 		t.Errorf(
// 			"expected name 'testing', got %s instead",
// 			found.Name,
// 		)
// 	}

// 	if found.Free != false {
// 		t.Error(
// 			"expected free to be flase",
// 		)
// 	}

// 	if !found.CreatedAt.Equal(FixedTime) {
// 		t.Errorf(
// 			"expected certificate time to be %v, got %v instead",
// 			FixedTime, found.CreatedAt,
// 		)
// 	}

// }

// func TestUpdateCertificate(t *testing.T) {

// 	repo := NewMockCertificateRepository()
// 	storage := NewMockFileStorage()
// 	service := NewCertificateService(repo, storage)

// 	certificate := domain.Certificate{
// 		ID:        1,
// 		Name:      "testing",
// 		Free:      false,
// 		PDFPath:   "certificates/certificate_test",
// 		CreatedAt: FixedTime,
// 	}

// 	updated, err := service.Update(certificate)

// 	if err != nil {
// 		t.Fatal(err)
// 	}

// 	if updated.ID != 1 {
// 		t.Errorf(
// 			"expected ID 1, got %d instead",
// 			updated.ID,
// 		)
// 	}

// 	if updated.PDFPath != "certificates/certificate_test" {
// 		t.Errorf(
// 			"expected PDFPath 'certificates/certificate_test', got %s instead",
// 			updated.PDFPath,
// 		)
// 	}

// 	if updated.Name != "testing" {
// 		t.Errorf(
// 			"expected name 'testing', got %s instead",
// 			updated.Name,
// 		)
// 	}

// 	if updated.Free != false {
// 		t.Error(
// 			"expected free to be flase",
// 		)
// 	}

// 	if !updated.CreatedAt.Equal(FixedTime) {
// 		t.Errorf(
// 			"expected certificate time to be %v, got %v instead",
// 			FixedTime, updated.CreatedAt,
// 		)
// 	}

// }

// func TestDeleteCertificate(t *testing.T) {

// 	repo := NewMockCertificateRepository()
// 	storage := NewMockFileStorage()
// 	service := NewCertificateService(repo, storage)

// 	if err := service.Delete(1); err != nil {
// 		t.Fatal(err)
// 	}

// }

// func TestUpdateFileCertificate(t *testing.T) {

// 	repo := NewMockCertificateRepository()
// 	storage := NewMockFileStorage()
// 	service := NewCertificateService(repo, storage)

// 	file := &multipart.FileHeader{
// 		Filename: "certificate.pdf",
// 	}

// 	newPath, err := service.UpdateFile(1, file)

// 	if err != nil {
// 		t.Fatal(err)
// 	}

// 	if newPath != "certificates/certificate.pdf" {
// 		t.Errorf(
// 			"expected certificates/certificate.pdf, got %s instead",
// 			newPath,
// 		)
// 	}

// 	if storage.DeletedPath != "certificates/certificate_test" {
// 		t.Errorf(
// 			"expected old file to be deleted, got %s instead",
// 			storage.DeletedPath,
// 		)
// 	}
// }
