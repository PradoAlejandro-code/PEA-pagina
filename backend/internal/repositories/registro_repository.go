package repositories

import (
	"PeaBackEnd/internal/domain"
	"errors"

	"gorm.io/gorm"
)

type SaveRegistroRepo func(registro *domain.Registro) (*domain.Registro, error)
type ListRegistroRepo func(voto string) (*[]domain.Registro, error)
type FindRegistroRepo func(id int) (*domain.Registro, error)
type UpdateRegistroRepo func(registro *domain.Registro) (*domain.Registro, error)
type DeleteRegistroRepo func(id int) error
type CountRegistroRepo func(voto string) (int64, error)
type PatchVotoRegistroRepo func(registro *domain.Registro) (*domain.Registro, error)

func InitRegistroRepo(db *gorm.DB) (SaveRegistroRepo, ListRegistroRepo, FindRegistroRepo, UpdateRegistroRepo, DeleteRegistroRepo, CountRegistroRepo, PatchVotoRegistroRepo) {

	save := func(registro *domain.Registro) (*domain.Registro, error) {
		if err := db.Create(registro).Error; err != nil {
			return nil, err
		}
		return registro, nil
	}

	list := func(voto string) (*[]domain.Registro, error) {
		list := []domain.Registro{}

		query := db.Model(&domain.Registro{})
		switch voto {
		case "no":
			query = query.Where("voto = ?", false)
		case "si":
			query = query.Where("voto = ?", true)
		case "todos":

		default:
			return nil, errors.New("invalid query")
		}

		if err := query.Find(&list).Error; err != nil {
			return nil, err
		}

		return &list, nil
	}

	find := func(id int) (*domain.Registro, error) {
		registro := &domain.Registro{}
		if err := db.First(registro, id).Error; err != nil {
			return nil, err
		}

		return registro, nil
	}

	update := func(registro *domain.Registro) (*domain.Registro, error) {
		if err := db.Model(registro).Where("id = ?", registro.ID).Select("*").Updates(registro).Error; err != nil {
			return nil, err
		}

		return registro, nil
	}

	delete := func(id int) error {
		return db.Delete(&domain.Registro{}, id).Error
	}

	count := func(voto string) (int64, error) {
		var total int64

		query := db.Model(&domain.Registro{})

		switch voto {
		case "si":
			query = query.Where("voto = ?", true)
		case "no":
			query = query.Where("voto = ?", false)
		case "todos":
		default:
			return 0, errors.New("invalid query")
		}

		if err := query.Count(&total).Error; err != nil {
			return 0, err
		}

		return total, nil
	}

	patchVoto := func(registro *domain.Registro) (*domain.Registro, error) {
		if err := db.Model(registro).Where("id = ?", registro.ID).Select("voto").Updates(registro).Error; err != nil {
			return nil, err
		}

		return registro, nil
	}

	return save, list, find, update, delete, count, patchVoto
}
