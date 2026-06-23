package main

import (
	"PeaBackEnd/internal/config"
	"PeaBackEnd/internal/database"
	"PeaBackEnd/internal/seed"
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

	if err := seed.SeedRegistros(db, "data/padron.csv"); err != nil {
		log.Fatal(err)
	}

	log.Println("Database seed completed successfully!")
}
