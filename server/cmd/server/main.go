package main

import (
	"context"
	"log"
	"net"
	"sync"

	DB "github.com/wafiqpuyol/nova-server/internal/db"
	"github.com/wafiqpuyol/nova-server/internal/handler"
	"github.com/wafiqpuyol/nova-server/internal/repository"
	"github.com/wafiqpuyol/nova-server/internal/service"
	healthCheckPb "github.com/wafiqpuyol/nova-server/proto/gen/go/healthcheck"
	authPb "github.com/wafiqpuyol/nova-server/proto/gen/go/auth"

	"github.com/wafiqpuyol/nova-server/pkg/config"
	"google.golang.org/grpc"
	"gorm.io/gorm"
)

// func startHealthCheckServer(wg *sync.WaitGroup, port string) {
// 	defer wg.Done()
// 	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
// 		w.WriteHeader(http.StatusOK)
// 		fmt.Fprintf(w, "Ready")
// 	})

// 	log.Printf("Health check server listening at %s", port)
// 	if err := http.ListenAndServe(":"+port, nil); err != nil {
// 		log.Fatalf("Failed to start Health Check server: %v", err)
// 	}

// }

func startGRPCServer(wg *sync.WaitGroup, db *gorm.DB, url string) {
	defer wg.Done()

	listener, err := net.Listen("tcp", url)
	if err != nil {
		log.Fatalf("Failed to start the gRPC Server at %s: %v", url, err)
	}

	grpcServer := grpc.NewServer()
	/* ---------------- Repository Layer ---------------- */
	authRepo := repository.NewAuthRepository(db)

	/* ---------------- Service Layer ---------------- */
	authService := service.NewAuthService(authRepo)

	/* ---------------- Handler Layer ---------------- */
	authHandler := handler.NewAuthHandler(authService)
	authPb.RegisterAuthServiceServer(grpcServer, authHandler)

	healthCheckService := handler.NewHealthCheckHandler(db)
	healthCheckPb.RegisterHealthCheckServiceServer(grpcServer, healthCheckService)

	log.Printf("gRPC server listening at %v", listener.Addr())
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve %v", err)
	}
}

func main() {
	ctx := context.Background()
	var wg sync.WaitGroup

	env := config.GetEnvVariable()
	db, err := DB.ConnectDatabase(env.DB_URL)
	if err != nil {
		log.Fatalf("Failed to db: %s", err)
	}
	DB.ConnectRedis(ctx, &DB.RedisCreds{
		Password: env.REDIS_PASSWORD,
		URL:      env.REDIS_URL,
	})

	wg.Add(1)
	// go startHealthCheckServer(&wg, env.REST_API_PORT)
	go startGRPCServer(&wg, db, env.GRPC_SERVER_URL)
	wg.Wait()
}
