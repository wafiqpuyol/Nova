package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"
)

func startHealthCheckServer(wg *sync.WaitGroup) {

	defer wg.Done()
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "Ready")
	})
	port := ":3002"
	log.Printf("Health check server listening at %s", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatalf("failed to start Health Check server: %v", err)
	}

}

func main() {
	var wg sync.WaitGroup

	wg.Add(2)
	go startHealthCheckServer(&wg)

	wg.Wait()
}
