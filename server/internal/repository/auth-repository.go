package repository

import (
	"errors"
	"fmt"

	"github.com/wafiqpuyol/nova-server/internal/model"
	"gorm.io/gorm"
)

type IAuthRepository interface {
	GetUserByEmail(email string) (*model.User, error)
	Create(user *model.User) (string, error)
}

type authRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) IAuthRepository {
	return &authRepository{db: db}
}

func (s *authRepository) GetUserByEmail(email string) (*model.User, error) {
	var user model.User

	err := s.db.Table("User").Where("email = ?", email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}
	return &user, nil
}

func (s *authRepository) Create(user *model.User) (string, error) {
	if err := s.db.Table("User").Create(user).Error; err != nil {
		return "", fmt.Errorf("failed to create user: %w", err)
	}
	return user.Id, nil
}

var (
	ErrUserNotFound = errors.New("user not found")
	ErrUserExists   = errors.New("user already exists")
)
