package handlers

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/services"
	"PeaBackEnd/internal/transport/http/dto"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func toResponseTutorialSuggestion(tutorialSuggestion domain.TutorialSuggestion) dto.TutorialSuggestionResponse {
	return dto.TutorialSuggestionResponse{
		ID:        tutorialSuggestion.ID,
		Text:      tutorialSuggestion.Text,
		CreatedAt: tutorialSuggestion.CreatedAt,
	}
}

type TutorialSuggestionHandler struct {
	service services.TutorialSuggestionService
}

func NewTutorialSuggestionHandler(service services.TutorialSuggestionService) *TutorialSuggestionHandler {
	return &TutorialSuggestionHandler{
		service: service,
	}
}

func (h *TutorialSuggestionHandler) Create(c *gin.Context) {
	var req dto.CreateTutorialSuggestionRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	tutorialSuggestion := domain.TutorialSuggestion{
		Text: req.Text,
	}

	created, err := h.service.Create(tutorialSuggestion)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := toResponseTutorialSuggestion(created)

	c.JSON(http.StatusCreated, res)
}

func (h *TutorialSuggestionHandler) List(c *gin.Context) {
	list, err := h.service.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var res []dto.TutorialSuggestionResponse
	for _, tutorialSuggestion := range list {
		res = append(res, toResponseTutorialSuggestion(tutorialSuggestion))
	}
}

func (h *TutorialSuggestionHandler) FindByID(c *gin.Context) {
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

	res := toResponseTutorialSuggestion(found)
	c.JSON(http.StatusOK, res)
}

func (h *TutorialSuggestionHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req dto.UpdateTutorialSuggestionRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	tutorialSuggestion := domain.TutorialSuggestion{
		ID:   id,
		Text: req.Text,
	}

	updated, err := h.service.Update(tutorialSuggestion)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := toResponseTutorialSuggestion(updated)
	c.JSON(http.StatusOK, res)
}

func (h *TutorialSuggestionHandler) Delete(c *gin.Context) {
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
