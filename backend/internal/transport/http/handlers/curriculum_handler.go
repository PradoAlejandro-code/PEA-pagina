package handlers

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/services"
	"PeaBackEnd/internal/transport/http/dto"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CurriculumHandler struct {
	service services.CurriculumService
}

func NewCurriculumHandler(service services.CurriculumService) *CurriculumHandler {
	return &CurriculumHandler{
		service: service,
	}
}

func toResponseCurriculum(curriculum domain.Curriculum) dto.CurriculumResponse {
	return dto.CurriculumResponse{
		ID:        curriculum.ID,
		Major:     curriculum.Major,
		Institute: curriculum.Institute,
		ImagePath: curriculum.ImagePath,
		CreatedAt: curriculum.CreatedAt,
	}
}

func (h *CurriculumHandler) Create(c *gin.Context) {
	var req dto.CreateCurriculumRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	file, err := c.FormFile("img")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "img file is required"})
		return
	}

	curriculum := domain.Curriculum{
		Major:     req.Major,
		Institute: req.Institute,
	}

	created, err := h.service.Create(curriculum, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, toResponseCurriculum(created))
}

func (h *CurriculumHandler) List(c *gin.Context) {
	list, err := h.service.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var res []dto.CurriculumResponse

	for _, curriculum := range list {
		res = append(res, toResponseCurriculum(curriculum))
	}

	c.JSON(http.StatusOK, res)
}

func (h *CurriculumHandler) FindByID(c *gin.Context) {
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

	res := toResponseCurriculum(found)

	c.JSON(http.StatusOK, res)
}

func (h *CurriculumHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req dto.UpdateCurriculumRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	curriculum := domain.Curriculum{
		ID:        id,
		Major:     req.Major,
		Institute: req.Institute,
	}

	updated, err := h.service.Update(curriculum)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := toResponseCurriculum(updated)

	c.JSON(http.StatusOK, res)
}
func (h *CurriculumHandler) Delete(c *gin.Context) {
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
func (h *CurriculumHandler) UpdateFile(c *gin.Context) {
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

	res := dto.UpdateFileCurriculumResponse{
		ImagePath: newPath,
	}

	c.JSON(http.StatusOK, res)
}
