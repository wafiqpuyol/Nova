package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"sync"

	DB "github.com/wafiqpuyol/nova-server/internal/db"
	"github.com/wafiqpuyol/nova-server/pkg/config"
)

func startHealthCheckServer(wg *sync.WaitGroup, port string) {
	defer wg.Done()
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "Ready")
	})

	log.Printf("Health check server listening at %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("failed to start Health Check server: %v", err)
	}

}

func main() {
	ctx := context.Background()
	var wg sync.WaitGroup

	env := config.GetEnvVariable()
	DB.ConnectDatabase(env.DB_URL)
	DB.ConnectRedis(ctx, &DB.Creds{
		Pssword: env.REDIS_PASSWORD,
		URL:     env.REDIS_URL,
	})
	wg.Add(2)
	go startHealthCheckServer(&wg, env.REST_API_PORT)

	wg.Wait()
}
