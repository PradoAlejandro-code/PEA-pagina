package seed

import (
	"encoding/csv"
	"os"
	"padron/internal/domain"
	"strconv"

	"gorm.io/gorm"
)

func SeedRegistros(db *gorm.DB, csvPath string) error {
	file, err := os.Open(csvPath)
	if err != nil {
		return err
	}
	defer file.Close()

	reader := csv.NewReader(file)

	rows, err := reader.ReadAll()
	if err != nil {
		return err
	}

	return db.Transaction(func(tx *gorm.DB) error {

		for i, row := range rows {

			// Skip header
			if i == 0 {
				continue
			}

			if len(row) != 4 {
				continue
			}

			orden, err := strconv.Atoi(row[0])
			if err != nil {
				return err
			}

			registro := domain.Registro{
				Orden:    orden,
				Apellido: row[1],
				Nombre:   row[2],
				DNI:      row[3],
				Voto:     false,
			}

			if err := tx.Create(&registro).Error; err != nil {
				return err
			}
		}

		return nil
	})
}
