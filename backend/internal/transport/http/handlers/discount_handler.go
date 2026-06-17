package handlers

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/services"
	"PeaBackEnd/internal/transport/http/dto"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type DiscountHandler struct {
	service services.DiscountService
}

func NewDiscountHandler(service services.DiscountService) *DiscountHandler {
	return &DiscountHandler{
		service: service,
	}
}

func toResponseDiscount(discount domain.Discount) dto.DiscountResponse {
	return dto.DiscountResponse{
		ID:           discount.ID,
		Name:         discount.Name,
		Category:     discount.Category,
		Description:  discount.Description,
		Requirements: discount.Requirements,
		ImagePath:    discount.ImagePath,
		CreatedAt:    discount.CreatedAt,
	}
}

func (h *DiscountHandler) Create(c *gin.Context) {
	var req dto.CreateDiscountRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	file, err := c.FormFile("img")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "img file is required"})
		return
	}

	discount := domain.Discount{
		Name:         req.Name,
		Category:     req.Category,
		Description:  req.Description,
		Requirements: req.Requirements,
	}

	created, err := h.service.Create(discount, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, toResponseDiscount(created))
}

func (h *DiscountHandler) List(c *gin.Context) {
	list, err := h.service.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var res []dto.DiscountResponse

	for _, discount := range list {
		res = append(res, toResponseDiscount(discount))
	}

	c.JSON(http.StatusOK, res)
}

func (h *DiscountHandler) FindByID(c *gin.Context) {
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

	res := toResponseDiscount(found)

	c.JSON(http.StatusOK, res)
}

func (h *DiscountHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req dto.UpdateDiscountRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	discount := domain.Discount{
		ID:           id,
		Name:         req.Name,
		Category:     req.Category,
		Description:  req.Description,
		Requirements: req.Requirements,
	}

	updated, err := h.service.Update(discount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := toResponseDiscount(updated)

	c.JSON(http.StatusOK, res)
}
func (h *DiscountHandler) Delete(c *gin.Context) {
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
func (h *DiscountHandler) UpdateFile(c *gin.Context) {
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

	res := dto.UpdateFileDiscountResponse{
		ImagePath: newPath,
	}

	c.JSON(http.StatusOK, res)
}
