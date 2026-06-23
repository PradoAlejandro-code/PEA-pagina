package main

import (
	"PeaBackEnd/internal/config"
	"PeaBackEnd/internal/database"
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories/models"
	"log"
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

	log.Println("Starting database migrations...")

	err = db.AutoMigrate(
		&domain.Registro{},
		&models.CertificateModel{},
		&models.CurriculumModel{},
		&models.DiscountModel{},
		&models.EntrepreneurshipModel{},
		&models.TutorModel{},
		&models.TutorialModel{},
		&models.TutorialSuggestionModel{},
		&models.TutoringModel{},
		&models.VoteModel{},
		&models.NewModel{},
	)
	if err != nil {
		log.Fatalf("Database migration error: %v", err)
	}

	log.Println("Database migrations completed successfully!")
}
