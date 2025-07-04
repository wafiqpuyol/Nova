package service

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/wafiqpuyol/nova-server/internal/model"
	"github.com/wafiqpuyol/nova-server/internal/repository"
	"github.com/wafiqpuyol/nova-server/pkg/password"
	"github.com/wafiqpuyol/nova-server/pkg/types"
)

type IAuthService interface {
	Signup(req *types.SignupPayload) (*types.AuthResponse, error)
}

type authService struct {
	authRepository  repository.IAuthRepository
	passwordManager password.IManager
}

func NewAuthService(authRepository repository.IAuthRepository) IAuthService {
	return &authService{
		authRepository:  authRepository,
		passwordManager: password.NewManager(nil),
	}
}

func (s *authService) Signup(req *types.SignupPayload) (*types.AuthResponse, error) {
	// Check user already exist or not
	_, err := s.authRepository.GetUserByEmail(req.Email)
	if err != nil && !errors.Is(err, repository.ErrUserNotFound) {
		return &types.AuthResponse{
			Data:   nil,
			Status: 400,
			OK:     false,
		}, ErrUserAlreadyExists
	}

	hashedPassword, err := s.passwordManager.Hash(req.Password)
	if err != nil {
		return &types.AuthResponse{
			Data:   nil,
			Status: 401,
			OK:     false,
		}, fmt.Errorf("Failed to hash the password: %w", err)
	}

	user := &model.User{
		Id:             uuid.New().String(),
		Username:       &req.Username,
		Email:          &req.Email,
		HashedPassword: &hashedPassword,
	}

	userId, err := s.authRepository.Create(user)
	if err != nil {
		return &types.AuthResponse{
			Data:   userId,
			Status: 500,
			OK:     false,
		}, fmt.Errorf("Failed to create user at AuthService: %w", err)
	}

	return &types.AuthResponse{
		Data:   userId,
		Status: 201,
		OK:     true,
	}, nil
}

var (
	ErrUserAlreadyExists = errors.New("user already exists")
)
