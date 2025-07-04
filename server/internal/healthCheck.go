package internal

import (
	"context"
	"log"

	healthCheckPB "github.com/wafiqpuyol/nova-server/proto/gen/go/healthcheck"
	"gorm.io/gorm"
)

type HealthCheck struct {
	db *gorm.DB
	healthCheckPB.UnimplementedHealthCheckServer
}

func NewHealthCheckService(db *gorm.DB) *HealthCheck {
	return &HealthCheck{db: db}
}

func (s *HealthCheck) HealthCheck(ctx context.Context, req *healthCheckPB.HealthCheckRequest) (*healthCheckPB.HealthCheckResponse, error) {
	log.Println("------Hit Health Check Route------")
	return &healthCheckPB.HealthCheckResponse{Status: 200, OK: true}, nil
}
