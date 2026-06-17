package storage

import (
	"errors"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
)

var (
	ImageMimeTypes = []string{
		"image/jpeg",
		"image/png",
		"image/webp",
	}

	PDFMimeTypes = []string{
		"application/pdf",
	}

	VideoMimeTypes = []string{
		"video/mp4",
		"video/quicktime",
		"video/x-msvideo",
	}
)

const (
	CurriculumFolder       = "curriculum"
	CertificateFolder      = "certificates"
	TutorialFolder         = "tutorials"
	DiscountFolder         = "discounts"
	TutoringFolder         = "tutorings"
	EntrepreneurshipFolder = "entrepreneurships"

	MaxImageSize int64 = 10 << 20  // 10 MB
	MaxPDFSize   int64 = 20 << 20  // 20 MB
	MaxVideoSize int64 = 200 << 20 // 200 MB
)

var (
	ImageExtensions = []string{
		".jpg",
		".jpeg",
		".png",
		".webp",
	}

	PDFExtensions = []string{
		".pdf",
	}

	VideoExtensions = []string{
		".mp4",
		".mov",
		".avi",
	}
)

type FileStorage interface {
	Save(
		file *multipart.FileHeader,
		folder string,
		maxSize int64,
		allowedExtensions []string,
		allowedMimeTypes []string,
	) (string, error)

	Delete(path string) error
}

type LocalStorage struct {
	BasePath string
}

func NewLocalStorage(basePath string) *LocalStorage {
	return &LocalStorage{
		BasePath: basePath,
	}
}

func validateContentType(
	file *multipart.FileHeader,
	allowedMimeTypes []string,
) error {

	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	buffer := make([]byte, 512)

	n, err := src.Read(buffer)
	if err != nil && err != io.EOF {
		return err
	}

	contentType := http.DetectContentType(buffer[:n])

	for _, allowed := range allowedMimeTypes {
		if contentType == allowed {
			return nil
		}
	}

	return errors.New("invalid file content type")
}

func validateSize(
	file *multipart.FileHeader,
	maxSize int64,
) error {

	if file.Size > maxSize {
		return errors.New("file exceeds maximum size")
	}

	return nil
}

func validateExtension(
	file *multipart.FileHeader,
	allowedExtensions []string,
) error {

	ext := strings.ToLower(
		filepath.Ext(file.Filename),
	)

	for _, allowedExt := range allowedExtensions {
		if ext == strings.ToLower(allowedExt) {
			return nil
		}
	}

	return errors.New("invalid file extension")
}

func (s *LocalStorage) Save(
	file *multipart.FileHeader,
	folder string,
	maxSize int64,
	allowedExtensions []string,
	allowedMimeTypes []string,
) (string, error) {

	if err := validateSize(file, maxSize); err != nil {
		return "", err
	}

	if err := validateExtension(file, allowedExtensions); err != nil {
		return "", err
	}

	if err := validateContentType(file, allowedMimeTypes); err != nil {
		return "", err
	}

	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	safeName := filepath.Base(file.Filename)

	filename := uuid.New().String() +
		strings.ToLower(filepath.Ext(safeName))

	dir := filepath.Join(s.BasePath, folder)

	err = os.MkdirAll(dir, os.ModePerm)
	if err != nil {
		return "", err
	}

	fullPath := filepath.Join(dir, filename)

	dst, err := os.Create(fullPath)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	_, err = io.Copy(dst, src)
	if err != nil {
		return "", err
	}

	return filepath.Join(folder, filename), nil
}

func (s *LocalStorage) Delete(
	path string,
) error {

	fullPath := filepath.Join(
		s.BasePath,
		path,
	)

	return os.Remove(fullPath)
}
