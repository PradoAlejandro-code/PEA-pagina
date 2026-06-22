package models

import (
	"PeaBackEnd/internal/domain"
	"time"

	"gorm.io/gorm"
)

type VoteModel struct {
	ID        int            `gorm:"primaryKey;autoIncrement" json:"id"`
	Mesa      string         `gorm:"not null" json:"mesa"`
	PEAVotes  int            `gorm:"not null;default:0" json:"pea_votes"`
	UPLVotes  int            `gorm:"not null;default:0" json:"upl_votes"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (VoteModel) TableName() string {
	return "votes"
}

func (m *VoteModel) ToDomain() *domain.Vote {
	if m == nil {
		return nil
	}
	return &domain.Vote{
		ID:        m.ID,
		Mesa:      m.Mesa,
		PEAVotes:  m.PEAVotes,
		UPLVotes:  m.UPLVotes,
		CreatedAt: m.CreatedAt,
	}
}

func VoteModelFromDomain(v *domain.Vote) *VoteModel {
	if v == nil {
		return nil
	}
	return &VoteModel{
		ID:       v.ID,
		Mesa:     v.Mesa,
		PEAVotes: v.PEAVotes,
		UPLVotes: v.UPLVotes,
	}
}
