package main

import (
	"log"

	"PeaBackEnd/internal/config"
	"PeaBackEnd/internal/database"
	"PeaBackEnd/internal/repositories"
	"PeaBackEnd/internal/services"
	"PeaBackEnd/internal/storage"
	httptransport "PeaBackEnd/internal/transport/http"
	"PeaBackEnd/internal/transport/http/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	cfg := config.Load()
	if cfg.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	db, err := database.NewPostgres(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Database connection error: %v", err)
	}

	fileStorage := storage.NewLocalStorage("./media")

	//repositories

	certificateRepository := repositories.NewPostgresCertificateRepository(db)
	curriculumRepository := repositories.NewPostgresCurriculumRepository(db)
	discountRepository := repositories.NewPostgresDiscountRepository(db)
	entrepreneurshipRepository := repositories.NewPostgresEntrepreneurshipRepository(db)
	tutorRepository := repositories.NewPostgresTutorRepository(db)
	tutorialRepository := repositories.NewPostgresTutorialRepository(db)
	tutorialSuggestionRepository := repositories.NewPostgresTutorialSuggestionRepository(db)
	tutoringRepository := repositories.NewPostgresTutoringRepository(db)
	newRepository := repositories.NewPostgresNewRepository(db)

	//services

	certificateService := services.NewCertificateService(certificateRepository, fileStorage)
	curriculumService := services.NewCurriculumService(curriculumRepository, fileStorage)
	discountService := services.NewDiscountService(discountRepository, fileStorage)
	entrepreneurshipService := services.NewEntrepreneurshipService(entrepreneurshipRepository, fileStorage)
	tutorService := services.NewTutorService(tutorRepository)
	tutorialService := services.NewTutorialService(tutorialRepository, fileStorage)
	tutorialSuggestionService := services.NewTutorialSuggestionService(tutorialSuggestionRepository)
	tutoringService := services.NewTutoringService(tutoringRepository, fileStorage)
	newService := services.NewNewService(newRepository, fileStorage)

	//handlers

	certificateHandler := handlers.NewCertificateHandler(certificateService)
	curriculumHandler := handlers.NewCurriculumHandler(curriculumService)
	discountHandler := handlers.NewDiscountHandler(discountService)
	entrepreneurshipHandler := handlers.NewEntrepreneurshipHandler(entrepreneurshipService)
	tutorHandler := handlers.NewTutorHandler(tutorService)
	tutorialHandler := handlers.NewTutorialHandler(tutorialService)
	tutorialSuggestionHandler := handlers.NewTutorialSuggestionHandler(tutorialSuggestionService)
	tutoringHandler := handlers.NewTutoringHandler(tutoringService)
	newHandler := handlers.NewNewHandler(newService)

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	router.Static(
		"/media",
		"./media",
	)

	httptransport.RegisterRoutes(
		router,
		certificateHandler,
		curriculumHandler,
		discountHandler,
		entrepreneurshipHandler,
		tutorHandler,
		tutorialHandler,
		tutorialSuggestionHandler,
		tutoringHandler,
		newHandler,
	)

	httptransport.RegisterPadron(router)(handlers.InitRegistroHandlers(repositories.InitRegistroRepo(db)))

	log.Printf("Local:   http://localhost:8080")
	err = router.Run(":8080")

	if err != nil {
		log.Fatal(err)
	}
}
