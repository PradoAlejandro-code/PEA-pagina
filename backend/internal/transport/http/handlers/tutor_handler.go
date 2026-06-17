package handlers

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/services"
	"PeaBackEnd/internal/transport/http/dto"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func toResponseTutor(tutor domain.Tutor) dto.TutorResponse {
	return dto.TutorResponse{
		ID:   tutor.ID,
		Name: tutor.Name,
	}
}

type TutorHandler struct {
	service services.TutorService
}

func NewTutorHandler(service services.TutorService) *TutorHandler {
	return &TutorHandler{
		service: service,
	}
}

func (h *TutorHandler) Create(c *gin.Context) {
	var req dto.CreateTutorRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	tutor := domain.Tutor{
		Name: req.Name,
	}

	created, err := h.service.Create(tutor)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := toResponseTutor(created)

	c.JSON(http.StatusCreated, res)
}

func (h *TutorHandler) List(c *gin.Context) {
	list, err := h.service.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var res []dto.TutorResponse
	for _, tutor := range list {
		res = append(res, toResponseTutor(tutor))
	}

	c.JSON(http.StatusOK, res)
}

func (h *TutorHandler) FindByID(c *gin.Context) {
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

	res := toResponseTutor(found)
	c.JSON(http.StatusOK, res)
}

func (h *TutorHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req dto.UpdateTutorRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	tutor := domain.Tutor{
		ID:   id,
		Name: req.Name,
	}

	updated, err := h.service.Update(tutor)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := toResponseTutor(updated)
	c.JSON(http.StatusOK, res)
}

func (h *TutorHandler) Delete(c *gin.Context) {
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
