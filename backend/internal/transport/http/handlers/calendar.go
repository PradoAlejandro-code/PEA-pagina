package handlers

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/services"
	"PeaBackEnd/internal/transport/http/dto"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type CalendarHandler struct {
	service services.Calendar
}

func NewCalender(service services.Calendar) *CalendarHandler {
	return &CalendarHandler{
		service: service,
	}
}

func toDomainCalendar(req dto.CreateCalendarRequest) domain.Calendar {
	// Se ignoran errores de parseo asumiendo que ShouldBindJSON ya validó el formato RFC3339
	startDate, _ := time.Parse(time.RFC3339, req.StartDate)
	endDate, _ := time.Parse(time.RFC3339, req.EndDate)

	return domain.Calendar{
		Title:     req.Title,
		StartDate: startDate,
		EndDate:   endDate,
		Style: domain.Style{
			BgColor:        req.Style.BgColor,
			TextColor:      req.Style.TextColor,
			Underline:      req.Style.Underline,
			UnderlineColor: req.Style.UnderlineColor,
			IsBold:         req.Style.IsBold,
		},
	}
}

func toResponseCalendar(calendar domain.Calendar) dto.CalendarResponse {
	return dto.CalendarResponse{
		ID:        calendar.ID,
		Title:     calendar.Title,
		StartDate: calendar.StartDate.Format(time.RFC3339),
		EndDate:   calendar.EndDate.Format(time.RFC3339),
		Style: dto.StyleDTO{
			BgColor:        calendar.Style.BgColor,
			TextColor:      calendar.Style.TextColor,
			Underline:      calendar.Style.Underline,
			UnderlineColor: calendar.Style.UnderlineColor,
			IsBold:         calendar.Style.IsBold,
		},
	}
}

func (h *CalendarHandler) Create(c *gin.Context) {
	var req dto.CreateCalendarRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body: " + err.Error()})
		return
	}

	calendar := toDomainCalendar(req)

	created, err := h.service.Create(calendar)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, toResponseCalendar(created))
}

func (h *CalendarHandler) List(c *gin.Context) {
	calendars, err := h.service.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := make([]dto.CalendarResponse, 0) // Instanciado en 0 para evitar devolver null en JSON

	for _, calendar := range calendars {
		res = append(res, toResponseCalendar(calendar))
	}

	c.JSON(http.StatusOK, res)
}

func (h *CalendarHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req dto.UpdateCalendarRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body: " + err.Error()})
		return
	}

	startDate, _ := time.Parse(time.RFC3339, req.StartDate)
	endDate, _ := time.Parse(time.RFC3339, req.EndDate)

	calendar := domain.Calendar{
		ID:        id,
		Title:     req.Title,
		StartDate: startDate,
		EndDate:   endDate,
		Style: domain.Style{
			BgColor:        req.Style.BgColor,
			TextColor:      req.Style.TextColor,
			Underline:      req.Style.Underline,
			UnderlineColor: req.Style.UnderlineColor,
			IsBold:         req.Style.IsBold,
		},
	}

	updated, err := h.service.Update(calendar)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, toResponseCalendar(updated))
}

func (h *CalendarHandler) FindByID(c *gin.Context) {
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

	c.JSON(http.StatusOK, toResponseCalendar(found))
}

func (h *CalendarHandler) Delete(c *gin.Context) {
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
