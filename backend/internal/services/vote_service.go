package services

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/repositories"
)

type VoteService struct {
	repo repositories.VoteRepository
}

func NewVoteService(repo repositories.VoteRepository) *VoteService {
	return &VoteService{repo: repo}
}

func (s *VoteService) CreateVote(vote *domain.Vote) (*domain.Vote, error) {
	return s.repo.Create(vote)
}

func (s *VoteService) GetSummary() (*domain.VoteSummary, error) {
	return s.repo.GetSummary()
}
