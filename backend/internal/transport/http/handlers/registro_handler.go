package handlers

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type PatchVotoRequest struct {
	Voto bool `json:"voto"`
}

func InitRegistroHandlers(
	save repositories.SaveRegistroRepo,
	list repositories.ListRegistroRepo,
	find repositories.FindRegistroRepo,
	update repositories.UpdateRegistroRepo,
	delete repositories.DeleteRegistroRepo,
	count repositories.CountRegistroRepo,
	patchVoto repositories.PatchVotoRegistroRepo,
) (
	gin.HandlerFunc,
	gin.HandlerFunc,
	gin.HandlerFunc,
	gin.HandlerFunc,
	gin.HandlerFunc,
	gin.HandlerFunc,
	gin.HandlerFunc,
) {

	createHandler := func(c *gin.Context) {
		registro := &domain.Registro{}

		if err := c.ShouldBindJSON(registro); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		created, err := save(registro)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusCreated, created)
	}

	listHandler := func(c *gin.Context) {
		voto := c.DefaultQuery("voto", "todos")

		registros, err := list(voto)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, registros)
	}

	findHandler := func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid id",
			})
			return
		}

		registro, err := find(id)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, registro)
	}

	updateHandler := func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid id",
			})
			return
		}

		registro := &domain.Registro{}

		if err := c.ShouldBindJSON(registro); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		registro.ID = id

		updated, err := update(registro)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, updated)
	}

	deleteHandler := func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid id",
			})
			return
		}

		if err := delete(id); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.Status(http.StatusNoContent)
	}

	countHandler := func(c *gin.Context) {
		voto := c.DefaultQuery("voto", "todos")

		total, err := count(voto)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"cantidad": total,
		})
	}

	patchVotoHandler := func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid id",
			})
			return
		}

		var req PatchVotoRequest

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		registro := &domain.Registro{
			ID:   id,
			Voto: req.Voto,
		}

		updated, err := patchVoto(registro)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, updated)
	}

	return createHandler, listHandler, findHandler, updateHandler, deleteHandler, countHandler, patchVotoHandler
}
