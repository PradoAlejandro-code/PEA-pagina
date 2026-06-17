package handlers

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/services"
	"PeaBackEnd/internal/transport/http/dto"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CertificateHandler struct {
	service services.CertificateService
}

func NewCertificateHandler(service services.CertificateService) *CertificateHandler {
	return &CertificateHandler{
		service: service,
	}
}

func toDomainCertificate(req dto.CertificateResponse) domain.Certificate {
	return domain.Certificate{
		ID:        req.ID,
		Name:      req.Name,
		Free:      req.Free,
		PDFPath:   req.PDFPath,
		CreatedAt: req.CreatedAt,
	}
}

func toResponseCertificate(certificate domain.Certificate) dto.CertificateResponse {
	return dto.CertificateResponse{
		ID:        certificate.ID,
		Name:      certificate.Name,
		Free:      certificate.Free,
		PDFPath:   certificate.PDFPath,
		CreatedAt: certificate.CreatedAt,
	}
}

func (h *CertificateHandler) Create(c *gin.Context) {

	var req dto.CreateCertificateRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	file, err := c.FormFile("pdf")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pdf file is required"})
		return
	}

	certificate := domain.Certificate{
		Name: req.Name,
		Free: req.Free,
	}

	created, err := h.service.Create(certificate, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, toResponseCertificate(created))
}

func (h *CertificateHandler) List(c *gin.Context) {
	certificates, err := h.service.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var res []dto.CertificateResponse

	for _, certificate := range certificates {
		res = append(res, toResponseCertificate(certificate))
	}

	c.JSON(http.StatusOK, res)
}

func (h *CertificateHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req dto.UpdateCertificateRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	certificate := domain.Certificate{
		ID:   id,
		Name: req.Name,
		Free: req.Free,
	}

	updated, err := h.service.Update(certificate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := toResponseCertificate(updated)

	c.JSON(http.StatusOK, res)
}

func (h *CertificateHandler) FindByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	found, err := h.service.FindByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := toResponseCertificate(found)

	c.JSON(http.StatusOK, res)
}

func (h *CertificateHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := h.service.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": "deleted successfully"})
}

func (h *CertificateHandler) UpdateFile(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	file, err := c.FormFile("pdf")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pdf file is required"})
		return
	}

	newPath, err := h.service.UpdateFile(id, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := dto.UpdateFileCertificateResponse{
		NewPath: newPath,
	}

	c.JSON(http.StatusOK, res)
}
