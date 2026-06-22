package repositories

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories/models"

	"gorm.io/gorm"
)

type VoteRepository interface {
	Create(vote *domain.Vote) (*domain.Vote, error)
	GetSummary() (*domain.VoteSummary, error)
}

type postgresVoteRepository struct {
	db *gorm.DB
}

func NewPostgresVoteRepository(db *gorm.DB) VoteRepository {
	return &postgresVoteRepository{db: db}
}

func (r *postgresVoteRepository) Create(vote *domain.Vote) (*domain.Vote, error) {
	model := models.VoteModelFromDomain(vote)
	if err := r.db.Create(model).Error; err != nil {
		return nil, err
	}
	return model.ToDomain(), nil
}

func (r *postgresVoteRepository) GetSummary() (*domain.VoteSummary, error) {
	var summary domain.VoteSummary
	row := r.db.Model(&models.VoteModel{}).Select("COALESCE(SUM(pea_votes), 0) as pea_total, COALESCE(SUM(upl_votes), 0) as upl_total").Row()

	err := row.Scan(&summary.PEATotal, &summary.UPLTotal)
	if err != nil {
		return nil, err
	}

	return &summary, nil
}
