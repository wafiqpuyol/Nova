package handler

import (
	"context"
	"fmt"
	"log"

	"github.com/wafiqpuyol/nova-server/internal/service"
	types "github.com/wafiqpuyol/nova-server/pkg/types"
	authPb "github.com/wafiqpuyol/nova-server/proto/gen/go/auth"
)

type AuthHandler struct {
	authPb.UnimplementedAuthServiceServer
	authService service.IAuthService
}

func NewAuthHandler(authService service.IAuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (s *AuthHandler) Signup(ctx context.Context, req *authPb.SignUpRequest) (*authPb.SignUpResponse, error) {
	signupPayload := &types.SignupPayload{
		Username: req.Username,
		Email:    req.Email,
		Password: req.Password,
	}

	res, err := s.authService.Signup(signupPayload)
	if err != nil {
		log.Fatalf("Signup failed at SignupHandler, %s", err)
	}

	fmt.Println(*res)

	return &authPb.SignUpResponse{UserId: (*res).Data.(string), Status: res.Status, Message: "user created successfully"}, nil
}
