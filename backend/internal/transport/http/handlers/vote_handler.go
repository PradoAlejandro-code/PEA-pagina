package handlers

import (
	"PeaBackEnd/internal/domain"
	"PeaBackEnd/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type VoteHandler struct {
	service *services.VoteService
}

func NewVoteHandler(service *services.VoteService) *VoteHandler {
	return &VoteHandler{service: service}
}

type CreateVoteRequest struct {
	PEAVotes int `json:"pea_votes"`
	UPLVotes int `json:"upl_votes"`
}

func (h *VoteHandler) Create(c *gin.Context) {
	var req CreateVoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	username := c.MustGet(gin.AuthUserKey).(string)

	vote := &domain.Vote{
		Mesa:     username, // The user submitting the vote is the mesa
		PEAVotes: req.PEAVotes,
		UPLVotes: req.UPLVotes,
	}

	createdVote, err := h.service.CreateVote(vote)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create vote"})
		return
	}

	c.JSON(http.StatusCreated, createdVote)
}

func (h *VoteHandler) GetSummary(c *gin.Context) {
	summary, err := h.service.GetSummary()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get vote summary"})
		return
	}

	c.JSON(http.StatusOK, summary)
}
