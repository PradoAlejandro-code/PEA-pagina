package handlers

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/services"
	"PeaBackEnd/internal/transport/http/dto"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type EntrepreneurshipHandler struct {
	service services.EntrepreneurshipService
}

func NewEntrepreneurshipHandler(service services.EntrepreneurshipService) *EntrepreneurshipHandler {
	return &EntrepreneurshipHandler{
		service: service,
	}
}

func toResponseEntrepreneurship(entrepreneurship domain.Entrepreneurship) dto.EntrepreneurshipResponse {
	return dto.EntrepreneurshipResponse{
		ID:         entrepreneurship.ID,
		Name:       entrepreneurship.Name,
		ImagePath:  entrepreneurship.ImagePath,
		ContactURL: entrepreneurship.ContactURL,
	}
}

func (h *EntrepreneurshipHandler) Create(c *gin.Context) {
	var req dto.CreateEntrepreneurshipRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	file, err := c.FormFile("img")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "img file is required"})
		return
	}

	entrepreneurship := domain.Entrepreneurship{
		Name:       req.Name,
		ContactURL: req.ContactURL,
	}

	created, err := h.service.Create(entrepreneurship, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, toResponseEntrepreneurship(created))
}

func (h *EntrepreneurshipHandler) List(c *gin.Context) {
	list, err := h.service.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var res []dto.EntrepreneurshipResponse

	for _, entrepreneurship := range list {
		res = append(res, toResponseEntrepreneurship(entrepreneurship))
	}

	c.JSON(http.StatusOK, res)
}

func (h *EntrepreneurshipHandler) FindByID(c *gin.Context) {
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

	res := toResponseEntrepreneurship(found)

	c.JSON(http.StatusOK, res)
}

func (h *EntrepreneurshipHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req dto.UpdateEntrepreneurshipRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	entrepreneurship := domain.Entrepreneurship{
		ID:         id,
		Name:       req.Name,
		ContactURL: req.ContactURL,
	}

	updated, err := h.service.Update(entrepreneurship)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := toResponseEntrepreneurship(updated)

	c.JSON(http.StatusOK, res)
}
func (h *EntrepreneurshipHandler) Delete(c *gin.Context) {
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
func (h *EntrepreneurshipHandler) UpdateFile(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	file, err := c.FormFile("img")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "img file is required"})
		return
	}

	newPath, err := h.service.UpdateFile(id, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := dto.UpdateFileEntrepreneurshipResponse{
		ImagePath: newPath,
	}

	c.JSON(http.StatusOK, res)
}
