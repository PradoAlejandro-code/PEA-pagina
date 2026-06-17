package handlers

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/services"
	"PeaBackEnd/internal/transport/http/dto"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type TutorialHandler struct {
	service services.TutorialService
}

func NewTutorialHandler(service services.TutorialService) *TutorialHandler {
	return &TutorialHandler{
		service: service,
	}
}

func toResponseTutorial(tutorial domain.Tutorial) dto.TutorialResponse {
	return dto.TutorialResponse{
		ID:        tutorial.ID,
		Name:      tutorial.Name,
		VideoPath: tutorial.VideoPath,
		CreatedAt: tutorial.CreatedAt,
	}
}

func (h *TutorialHandler) Create(c *gin.Context) {
	var req dto.CreateTutorialRequest

	err := c.ShouldBind(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	file, err := c.FormFile("video")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "video file is required"})
		return
	}

	tutorial := domain.Tutorial{
		Name: req.Name,
	}

	created, err := h.service.Create(tutorial, file)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, toResponseTutorial(created))
}

func (h *TutorialHandler) List(c *gin.Context) {
	tutorials, err := h.service.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var res []dto.TutorialResponse

	for _, Tutorial := range tutorials {
		res = append(res, toResponseTutorial(Tutorial))
	}

	c.JSON(http.StatusOK, res)
}

func (h *TutorialHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req dto.UpdateTutorialRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	Tutorial := domain.Tutorial{
		ID:   id,
		Name: req.Name,
	}

	updated, err := h.service.Update(Tutorial)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := toResponseTutorial(updated)

	c.JSON(http.StatusOK, res)
}

func (h *TutorialHandler) FindByID(c *gin.Context) {
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

	res := toResponseTutorial(found)

	c.JSON(http.StatusOK, res)
}

func (h *TutorialHandler) Delete(c *gin.Context) {
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

func (h *TutorialHandler) UpdateFile(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	file, err := c.FormFile("Video")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Video file is required"})
		return
	}

	newPath, err := h.service.UpdateFile(id, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := dto.UpdateFileTutorialResponse{
		NewPath: newPath,
	}

	c.JSON(http.StatusOK, res)
}
