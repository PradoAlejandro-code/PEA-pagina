package handlers

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/transport/http/dto"
	"bytes"
	"encoding/json"
	"fmt"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

var FixedTime = time.Date(
	2026,
	time.June,
	14,
	12,
	0,
	0,
	0,
	time.UTC,
)

type MockCertificateService struct{}

func NewMockCertificateService() *MockCertificateService {
	return &MockCertificateService{}
}

func (s *MockCertificateService) Create(
	certificate domain.Certificate,
	file *multipart.FileHeader,
) (domain.Certificate, error) {

	certificate.ID = 1
	certificate.PDFPath = "certificates/certificate_test.pdf"
	certificate.CreatedAt = FixedTime

	return certificate, nil
}

func (s *MockCertificateService) List() ([]domain.Certificate, error) {

	return []domain.Certificate{
		{
			ID:        0,
			Name:      "Certificate 0",
			Free:      false,
			PDFPath:   "certificates/certificate_0.pdf",
			CreatedAt: FixedTime,
		},
		{
			ID:        1,
			Name:      "Certificate 1",
			Free:      false,
			PDFPath:   "certificates/certificate_1.pdf",
			CreatedAt: FixedTime,
		},
		{
			ID:        2,
			Name:      "Certificate 2",
			Free:      false,
			PDFPath:   "certificates/certificate_2.pdf",
			CreatedAt: FixedTime,
		},
	}, nil
}

func (s *MockCertificateService) FindByID(
	id int,
) (domain.Certificate, error) {

	return domain.Certificate{
		ID:        id,
		Name:      "testing",
		Free:      false,
		PDFPath:   "certificates/certificate_test.pdf",
		CreatedAt: FixedTime,
	}, nil
}

func (s *MockCertificateService) Update(
	certificate domain.Certificate,
) (domain.Certificate, error) {
	updated := domain.Certificate{
		ID:        1,
		Name:      certificate.Name,
		Free:      certificate.Free,
		PDFPath:   "certificates/certificate_test.pdf",
		CreatedAt: FixedTime,
	}
	return updated, nil
}

func (s *MockCertificateService) Delete(
	id int,
) error {

	return nil
}

func (s *MockCertificateService) UpdateFile(
	id int,
	file *multipart.FileHeader,
) (string, error) {

	if file != nil {
		return "certificates/" + file.Filename, nil
	}

	return "certificates/certificate_test.pdf", nil
}

func TestCreateCertificateHandler(t *testing.T) {

	gin.SetMode(gin.TestMode)

	service := NewMockCertificateService()

	handler := NewCertificateHandler(service)

	router := gin.New()

	router.POST(
		"/certificates",
		handler.Create,
	)

	body := &bytes.Buffer{}

	writer := multipart.NewWriter(body)

	if err := writer.WriteField("name", "Testing Certificate"); err != nil {
		t.Fatal(err)
	}
	if err := writer.WriteField("free", "true"); err != nil {
		t.Fatal(err)
	}

	part, err := writer.CreateFormFile(
		"pdf",
		"certificate.pdf",
	)

	if err != nil {
		t.Fatal(err)
	}

	_, err = part.Write(
		[]byte("fake pdf content"),
	)

	if err != nil {
		t.Fatal(err)
	}

	writer.Close()

	req := httptest.NewRequest(
		http.MethodPost,
		"/certificates",
		body,
	)

	req.Header.Set(
		"Content-Type",
		writer.FormDataContentType(),
	)

	recorder := httptest.NewRecorder()

	router.ServeHTTP(
		recorder,
		req,
	)

	var response dto.CertificateResponse

	err = json.Unmarshal(
		recorder.Body.Bytes(),
		&response,
	)

	if err != nil {
		t.Fatal(err)
	}

	if recorder.Code != http.StatusCreated {
		t.Errorf(
			"expected status 201, got %d",
			recorder.Code,
		)
	}

	if response.ID != 1 {
		t.Errorf(
			"expected id 1, got %d",
			response.ID,
		)
	}

	if response.Name != "Testing Certificate" {
		t.Errorf(
			"expected Testing Certificate, got %s",
			response.Name,
		)
	}
}

func TestCreateCertificateHandler_MissingFile(t *testing.T) {

	gin.SetMode(gin.TestMode)

	service := NewMockCertificateService()

	handler := NewCertificateHandler(service)

	router := gin.New()

	router.POST(
		"/certificates",
		handler.Create,
	)

	body := &bytes.Buffer{}

	writer := multipart.NewWriter(body)

	if err := writer.WriteField("name", "Testing Certificate"); err != nil {
		t.Fatal(err)
	}

	if err := writer.WriteField("free", "true"); err != nil {
		t.Fatal(err)
	}

	writer.Close()

	req := httptest.NewRequest(
		http.MethodPost,
		"/certificates",
		body,
	)

	req.Header.Set(
		"Content-Type",
		writer.FormDataContentType(),
	)

	recorder := httptest.NewRecorder()

	router.ServeHTTP(
		recorder,
		req,
	)

	if recorder.Code != http.StatusBadRequest {
		t.Errorf(
			"expected status 400, got %d",
			recorder.Code,
		)
	}
}

func TestListCertificateHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	service := NewMockCertificateService()
	handler := NewCertificateHandler(service)

	router := gin.New()
	router.GET("/certificates", handler.List)
	body := &bytes.Buffer{}
	req := httptest.NewRequest(http.MethodGet, "/certificates", body)
	req.Header.Set("Content-Type", "application/json")
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, req)

	var res []dto.CertificateResponse

	err := json.Unmarshal(recorder.Body.Bytes(), &res)

	if err != nil {
		t.Fatal(err)
	}

	if recorder.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d",
			recorder.Code,
		)
	}

	if len(res) != 3 {
		t.Errorf(
			"expected size of res 3, got %d instead",
			len(res),
		)
	}

	for i, certificate := range res {

		if certificate.ID != i {
			t.Errorf(
				"expected id %d, got %d instead",
				i, certificate.ID,
			)
		}
		if certificate.Name != fmt.Sprintf("Certificate %d", i) {
			t.Errorf(
				"expected name Certificate %s, got %s instead",
				fmt.Sprintf("Certificate %d", i), certificate.Name,
			)
		}

		if certificate.Free != false {
			t.Error(
				"expected free false",
			)
		}

		if certificate.PDFPath != fmt.Sprintf("certificates/certificate_%d.pdf", i) {
			t.Errorf(
				"expected pdfpath to be %s, got %s instead",
				fmt.Sprintf("certificates/certificate_%d.pdf", i), certificate.PDFPath,
			)
		}

		if !certificate.CreatedAt.Equal(FixedTime) {
			t.Errorf(
				"expected createdat to be %v, got %v instead",
				FixedTime, certificate.CreatedAt,
			)
		}
	}
}

func TestFindByIDCertificateHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	service := NewMockCertificateService()
	handler := NewCertificateHandler(service)

	router := gin.New()
	router.GET("/certificates/:id", handler.FindByID)
	req := httptest.NewRequest(http.MethodGet, "/certificates/1", nil)
	recorder := httptest.NewRecorder()

	router.ServeHTTP(recorder, req)

	var res dto.CertificateResponse

	err := json.Unmarshal(recorder.Body.Bytes(), &res)

	if err != nil {
		t.Fatal(err)
	}

	if recorder.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d",
			recorder.Code,
		)
	}

	if res.ID != 1 {
		t.Errorf(
			"expected id 1, got %d instead",
			res.ID,
		)
	}

	if res.Name != "testing" {
		t.Errorf(
			"expected name testing, got %s instead",
			res.Name,
		)
	}

	if res.Free != false {
		t.Error(
			"expected free false",
		)
	}

	if res.PDFPath != "certificates/certificate_test.pdf" {
		t.Errorf(
			"expected pdfpath certificates/certificate_test.pdf, got %s instead",
			res.PDFPath,
		)
	}

	if !res.CreatedAt.Equal(FixedTime) {
		t.Errorf(
			"expected createdat %v, got %v instead",
			FixedTime, res.CreatedAt,
		)
	}
}

func TestFindByIDCertificateHandler_BadID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	service := NewMockCertificateService()
	handler := NewCertificateHandler(service)

	router := gin.New()
	router.GET("/certificates/:id", handler.FindByID)
	req := httptest.NewRequest(http.MethodGet, "/certificates/abc", nil)
	recorder := httptest.NewRecorder()

	router.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusBadRequest {
		t.Errorf(
			"expected status 400, got %d instead",
			recorder.Code,
		)
	}
}

func TestUpdateCertificateHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	service := NewMockCertificateService()
	handler := NewCertificateHandler(service)

	router := gin.New()
	router.PUT("/certificates/:id", handler.Update)

	reqBody := dto.UpdateCertificateRequest{
		Name: "updated name",
		Free: true,
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		t.Fatal(err)
	}

	req := httptest.NewRequest(http.MethodPut, "/certificates/1", bytes.NewBuffer(body))
	recorder := httptest.NewRecorder()

	router.ServeHTTP(recorder, req)

	var res dto.CertificateResponse
	if err := json.Unmarshal(recorder.Body.Bytes(), &res); err != nil {
		t.Fatal(err)
	}

	if recorder.Code != http.StatusOK {
		t.Errorf(
			"expected status 200, got %d instead",
			recorder.Code,
		)
	}

	if res.ID != 1 {
		t.Errorf(
			"expected id 1, got %d instead",
			res.ID,
		)
	}

	if res.Name != "updated name" {
		t.Errorf(
			"expected name updated name, got %s instead",
			res.Name,
		)
	}

	if res.Free != true {
		t.Error(
			"expected free true",
		)
	}

	if res.PDFPath != "certificates/certificate_test.pdf" {
		t.Errorf(
			"expected pdfpath certificates/certificate_test.pdf, got %s instead",
			res.PDFPath,
		)
	}

	if !res.CreatedAt.Equal(FixedTime) {
		t.Errorf(
			"expected createdat %v, got %v instead",
			FixedTime, res.CreatedAt,
		)
	}

}

func TestUpdateCertificateHandler_BadID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	service := NewMockCertificateService()
	handler := NewCertificateHandler(service)

	router := gin.New()
	router.PUT("/certificates/:id", handler.Update)

	reqBody := dto.UpdateCertificateRequest{
		Name: "updated name",
		Free: true,
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		t.Fatal(err)
	}

	req := httptest.NewRequest(http.MethodPut, "/certificates/abc", bytes.NewBuffer(body))
	recorder := httptest.NewRecorder()

	router.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusBadRequest {
		t.Errorf(
			"expected status 400, got %d instead",
			recorder.Code,
		)
	}
}

func TestUpdateCertificateHandler_BadRequest(t *testing.T) {
	gin.SetMode(gin.TestMode)
	service := NewMockCertificateService()
	handler := NewCertificateHandler(service)

	router := gin.New()
	router.PUT("/certificates/:id", handler.Update)

	badJSON := []byte(`{invalid json}`)

	req := httptest.NewRequest(http.MethodPut, "/certificates/1", bytes.NewBuffer(badJSON))
	recorder := httptest.NewRecorder()

	router.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusBadRequest {
		t.Errorf(
			"expected status 400, got %d instead",
			recorder.Code,
		)
	}
}

func TestDeleteCertificateHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	service := NewMockCertificateService()
	handler := NewCertificateHandler(service)

	router := gin.New()
	router.DELETE("/certificates/:id", handler.Delete)
	req := httptest.NewRequest(http.MethodDelete, "/certificates/1", nil)
	recorder := httptest.NewRecorder()

	router.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusOK {
		t.Errorf(
			"expected status 200, got %d instead",
			recorder.Code,
		)
	}
}

func TestDeleteCertificateHandler_BadID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	service := NewMockCertificateService()
	handler := NewCertificateHandler(service)

	router := gin.New()
	router.DELETE("/certificates/:id", handler.Delete)
	req := httptest.NewRequest(http.MethodDelete, "/certificates/abc", nil)
	recorder := httptest.NewRecorder()

	router.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusBadRequest {
		t.Errorf(
			"expected status 400, got %d instead",
			recorder.Code,
		)
	}
}

func TestUpdateFileCertificateHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	service := NewMockCertificateService()
	handler := NewCertificateHandler(service)

	router := gin.New()
	router.PATCH("/certificates/:id/file", handler.UpdateFile)

	body := bytes.NewBuffer(nil)

	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("pdf", "certificate.pdf")
	if err != nil {
		t.Fatal(err)
	}

	if _, err := part.Write([]byte("fake pdf content")); err != nil {
		t.Fatal(err)
	}

	writer.Close()

	req := httptest.NewRequest(http.MethodPatch, "/certificates/1/file", body)
	req.Header.Set(
		"Content-Type",
		writer.FormDataContentType(),
	)
	recorder := httptest.NewRecorder()

	router.ServeHTTP(recorder, req)

	var res dto.UpdateFileCertificateResponse

	err = json.Unmarshal(recorder.Body.Bytes(), &res)

	if err != nil {
		t.Fatal(err)
	}

	if recorder.Code != http.StatusOK {
		t.Errorf(
			"expected status 200, got %d instead",
			recorder.Code,
		)
	}

	if res.NewPath != "certificates/certificate.pdf" {
		t.Errorf(
			"expected certificates/certificate.pdf, got %s",
			res.NewPath,
		)
	}
}

func TestUpdateFileCertificateHandler_MissingFile(t *testing.T) {
	gin.SetMode(gin.TestMode)
	service := NewMockCertificateService()
	handler := NewCertificateHandler(service)

	router := gin.New()
	router.PATCH("/certificates/:id/file", handler.UpdateFile)

	body := bytes.NewBuffer(nil)

	req := httptest.NewRequest(http.MethodPatch, "/certificates/1/file", body)
	recorder := httptest.NewRecorder()

	router.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusBadRequest {
		t.Errorf(
			"expected code 400, got %d instead",
			recorder.Code,
		)
	}
}

func TestUpdateFileCertificateHandler_BadID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	service := NewMockCertificateService()
	handler := NewCertificateHandler(service)

	router := gin.New()
	router.PATCH("/certificates/:id/file", handler.UpdateFile)

	body := bytes.NewBuffer(nil)
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("pdf", "certificate.pdf")
	if err != nil {
		t.Fatal(err)
	}

	if _, err := part.Write([]byte("fake pdf content")); err != nil {
		t.Fatal(err)
	}
	writer.Close()

	req := httptest.NewRequest(http.MethodPatch, "/certificates/abc/file", body)
	req.Header.Set(
		"Content-Type",
		writer.FormDataContentType(),
	)
	recorder := httptest.NewRecorder()

	router.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusBadRequest {
		t.Errorf(
			"expected status 400, got %d instead",
			recorder.Code,
		)
	}
}
