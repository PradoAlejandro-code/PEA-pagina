package handlers

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/services"
	"PeaBackEnd/internal/transport/http/dto"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type TutoringHandler struct {
	service services.TutoringService
}

func NewTutoringHandler(service services.TutoringService) *TutoringHandler {
	return &TutoringHandler{
		service: service,
	}
}

func toResponseTutoring(tutoring domain.Tutoring) dto.TutoringResponse {
	var tutors []dto.TutorResponse
	for _, tutor := range tutoring.Tutors {
		tutors = append(tutors, toResponseTutor(tutor))
	}
	return dto.TutoringResponse{
		ID:        tutoring.ID,
		ImagePath: tutoring.ImagePath,
		Major:     tutoring.Major,
		Subject:   tutoring.Subject,
		Place:     tutoring.Place,
		Date:      tutoring.Date,
		Tutors:    tutors,
	}
}

func (h *TutoringHandler) Create(c *gin.Context) {
	var req dto.CreateTutoringRequest

	err := c.ShouldBind(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	file, err := c.FormFile("img")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "img file is required"})
		return
	}

	var tutors []domain.Tutor

	for _, id := range req.TutorIDs {
		tutors = append(tutors, domain.Tutor{ID: id})
	}

	tutoring := domain.Tutoring{
		Major:   req.Major,
		Subject: req.Subject,
		Place:   req.Place,
		Date:    req.Date,
		Tutors:  tutors,
	}

	created, err := h.service.Create(tutoring, file)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, toResponseTutoring(created))
}

func (h *TutoringHandler) List(c *gin.Context) {
	tutorings, err := h.service.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var res []dto.TutoringResponse

	for _, Tutoring := range tutorings {
		res = append(res, toResponseTutoring(Tutoring))
	}

	c.JSON(http.StatusOK, res)
}

func (h *TutoringHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req dto.UpdateTutoringRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	var tutors []domain.Tutor

	for _, id := range req.TutorIDs {
		tutors = append(tutors, domain.Tutor{ID: id})
	}

	Tutoring := domain.Tutoring{
		ID:      id,
		Major:   req.Major,
		Subject: req.Subject,
		Place:   req.Place,
		Date:    req.Date,
		Tutors:  tutors,
	}

	updated, err := h.service.Update(Tutoring)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := toResponseTutoring(updated)

	c.JSON(http.StatusOK, res)
}

func (h *TutoringHandler) FindByID(c *gin.Context) {
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

	res := toResponseTutoring(found)

	c.JSON(http.StatusOK, res)
}

func (h *TutoringHandler) Delete(c *gin.Context) {
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

func (h *TutoringHandler) UpdateFile(c *gin.Context) {
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

	res := dto.UpdateFileTutoringResponse{
		NewPath: newPath,
	}

	c.JSON(http.StatusOK, res)
}
