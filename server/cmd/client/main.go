// ./cmd/client/main.go

package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/wafiqpuyol/nova-server/pkg/config"
	authPb "github.com/wafiqpuyol/nova-server/proto/gen/go/auth"
	healthCheckPb "github.com/wafiqpuyol/nova-server/proto/gen/go/healthcheck"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func main() {
	env := config.GetEnvVariable()
	// Set up a connection to the order server.
	conn, err := grpc.NewClient(env.GRPC_SERVER_URL, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("could not connect to order service: %v", err)
	}
	defer conn.Close()

	// Register gRPC server endpoint
	// Note: Make sure the gRPC server is running properly and accessible
	mux := runtime.NewServeMux()
	if err = healthCheckPb.RegisterHealthCheckServiceHandler(context.Background(), mux, conn); err != nil {
		log.Fatalf("failed to register the health_check server: %v", err)
	}
	if err = authPb.RegisterAuthServiceHandler(context.Background(), mux, conn); err != nil {
		log.Fatalf("failed to register the health_check server: %v", err)
	}

	// start listening to requests from the gateway server
	fmt.Println("API gateway server is running on " + env.GATEWAY_URL)
	if err = http.ListenAndServe(env.GATEWAY_URL, mux); err != nil {
		log.Fatal("gateway server closed abruptly: ", err)
	}
}
