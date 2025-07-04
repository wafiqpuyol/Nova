package handler

import (
	"context"
	"log"

	healthCheckPb "github.com/wafiqpuyol/nova-server/proto/gen/go/healthcheck"
	"gorm.io/gorm"
)

type HealthCheck struct {
	db *gorm.DB
	healthCheckPb.UnimplementedHealthCheckServiceServer
}

func NewHealthCheckHandler(db *gorm.DB) *HealthCheck {
	return &HealthCheck{db: db}
}

func (s *HealthCheck) HealthCheck(ctx context.Context, req *healthCheckPb.HealthCheckRequest) (*healthCheckPb.HealthCheckResponse, error) {
	log.Println("------Hit Health Check Route------")
	return &healthCheckPb.HealthCheckResponse{Status: 200, OK: true}, nil
}
