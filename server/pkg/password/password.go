package password

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"regexp"

	"golang.org/x/crypto/argon2"
)

type Config struct {
	Memory      uint32
	Iterations  uint32
	Parallelism uint8
	SaltLength  uint32
	KeyLength   uint32
}

type IManager interface {
	Hash(password string) (string, error)
	ValidatePassword(password string) error
}

type Manager struct {
	config *Config
}

func DefaultConfig() *Config {
	return &Config{
		Memory:      64 * 1024, // 64 MB
		Iterations:  3,
		Parallelism: 2,
		SaltLength:  16,
		KeyLength:   32,
	}
}

func NewManager(config *Config) IManager {
	if config == nil {
		config = DefaultConfig()
	}
	return &Manager{config: config}
}

func (s *Manager) Hash(password string) (string, error) {
	if err := s.ValidatePassword(password); err != nil {
		return "", err
	}

	// Generate a random salt
	salt, err := s.generateSalt()
	if err != nil {
		return "", fmt.Errorf("failed to generate salt: %w", err)
	}

	// Generate the hash
	hash := argon2.IDKey(
		[]byte(password),
		salt,
		s.config.Iterations,
		s.config.Memory,
		s.config.Parallelism,
		s.config.KeyLength,
	)

	// Encode the hash in the format: $argon2id$v=19$m=memory,t=iterations,p=parallelism$salt$hash
	encodedSalt := base64.RawStdEncoding.EncodeToString(salt)
	encodedHash := base64.RawStdEncoding.EncodeToString(hash)

	return fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version,
		s.config.Memory,
		s.config.Iterations,
		s.config.Parallelism,
		encodedSalt,
		encodedHash,
	), nil
}

func (m *Manager) ValidatePassword(password string) error {
	if len(password) < 8 {
		return ErrPasswordTooShort
	}

	if len(password) > 128 {
		return ErrPasswordTooLong
	}

	// Check for at least one lowercase letter
	if matched, _ := regexp.MatchString(`[a-z]`, password); !matched {
		return ErrPasswordMissingLowercase
	}

	// Check for at least one uppercase letter
	if matched, _ := regexp.MatchString(`[A-Z]`, password); !matched {
		return ErrPasswordMissingUppercase
	}

	// Check for at least one digit
	if matched, _ := regexp.MatchString(`\d`, password); !matched {
		return ErrPasswordMissingDigit
	}

	// Check for at least one special character
	if matched, _ := regexp.MatchString(`[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]`, password); !matched {
		return ErrPasswordMissingSpecial
	}

	return nil
}

func (m *Manager) generateSalt() ([]byte, error) {
	salt := make([]byte, m.config.SaltLength)
	_, err := rand.Read(salt)
	if err != nil {
		return nil, err
	}
	return salt, nil
}

var (
	ErrPasswordTooShort         = errors.New("password must be at least 8 characters long")
	ErrPasswordTooLong          = errors.New("password must be no more than 128 characters long")
	ErrPasswordMissingLowercase = errors.New("password must contain at least one lowercase letter")
	ErrPasswordMissingUppercase = errors.New("password must contain at least one uppercase letter")
	ErrPasswordMissingDigit     = errors.New("password must contain at least one digit")
	ErrPasswordMissingSpecial   = errors.New("password must contain at least one special character")
	ErrPasswordTooCommon        = errors.New("password is too common")
	ErrInvalidHashFormat        = errors.New("invalid hash format")
	ErrUnsupportedHashType      = errors.New("unsupported hash type")
	ErrIncompatibleVersion      = errors.New("incompatible hash version")
)
