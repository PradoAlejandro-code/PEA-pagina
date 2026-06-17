package http

import (
	"PeaBackEnd/internal/transport/http/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	router *gin.Engine,
	certificateHandler *handlers.CertificateHandler,
	curriculumHandler *handlers.CurriculumHandler,
	discountHandler *handlers.DiscountHandler,
	entrepreneurshipHandler *handlers.EntrepreneurshipHandler,
	tutorHandler *handlers.TutorHandler,
	tutorialHandler *handlers.TutorialHandler,
	tutorialSuggestionHandler *handlers.TutorialSuggestionHandler,
	tutoringHandler *handlers.TutoringHandler,
) {
	certificates := router.Group("/certificates")
	{
		certificates.POST("", certificateHandler.Create)
		certificates.GET("", certificateHandler.List)
		certificates.GET("/:id", certificateHandler.FindByID)
		certificates.PUT("/:id", certificateHandler.Update)
		certificates.DELETE("/:id", certificateHandler.Delete)
		certificates.PATCH("/:id/file", certificateHandler.UpdateFile)
	}

	curriculums := router.Group("/curriculums")
	{
		curriculums.POST("", curriculumHandler.Create)
		curriculums.GET("", curriculumHandler.List)
		curriculums.GET("/:id", curriculumHandler.FindByID)
		curriculums.PUT("/:id", curriculumHandler.Update)
		curriculums.DELETE("/:id", curriculumHandler.Delete)
	}

	discounts := router.Group("/discounts")
	{
		discounts.POST("", discountHandler.Create)
		discounts.GET("", discountHandler.List)
		discounts.GET("/:id", discountHandler.FindByID)
		discounts.PUT("/:id", discountHandler.Update)
		discounts.DELETE("/:id", discountHandler.Delete)
		discounts.PATCH("/:id/file", discountHandler.UpdateFile)
	}

	entrepreneurships := router.Group("/entrepreneurships")
	{
		entrepreneurships.POST("", entrepreneurshipHandler.Create)
		entrepreneurships.GET("", entrepreneurshipHandler.List)
		entrepreneurships.GET("/:id", entrepreneurshipHandler.FindByID)
		entrepreneurships.PUT("/:id", entrepreneurshipHandler.Update)
		entrepreneurships.DELETE("/:id", entrepreneurshipHandler.Delete)
		entrepreneurships.PATCH("/:id/file", entrepreneurshipHandler.UpdateFile)
	}

	tutors := router.Group("/tutors")
	{
		tutors.POST("", tutorHandler.Create)
		tutors.GET("", tutorHandler.List)
		tutors.GET("/:id", tutorHandler.FindByID)
		tutors.PUT("/:id", tutorHandler.Update)
		tutors.DELETE("/:id", tutorHandler.Delete)
	}

	tutorials := router.Group("/tutorials")
	{
		tutorials.POST("", tutorialHandler.Create)
		tutorials.GET("", tutorialHandler.List)
		tutorials.GET("/:id", tutorialHandler.FindByID)
		tutorials.PUT("/:id", tutorialHandler.Update)
		tutorials.DELETE("/:id", tutorialHandler.Delete)
		tutorials.PATCH("/:id/file", tutorialHandler.UpdateFile)
	}

	tutorialSuggestions := router.Group("/tutorial-suggestions")
	{
		tutorialSuggestions.POST("", tutorialSuggestionHandler.Create)
		tutorialSuggestions.GET("", tutorialSuggestionHandler.List)
		tutorialSuggestions.GET("/:id", tutorialSuggestionHandler.FindByID)
		tutorialSuggestions.PUT("/:id", tutorialSuggestionHandler.Update)
		tutorialSuggestions.DELETE("/:id", tutorialSuggestionHandler.Delete)
	}

	tutorings := router.Group("/tutorings")
	{
		tutorings.POST("", tutoringHandler.Create)
		tutorings.GET("", tutoringHandler.List)
		tutorings.GET("/:id", tutoringHandler.FindByID)
		tutorings.PUT("/:id", tutoringHandler.Update)
		tutorings.DELETE("/:id", tutoringHandler.Delete)
		tutorings.PATCH("/:id/file", tutoringHandler.UpdateFile)
	}
}
