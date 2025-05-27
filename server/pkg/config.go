package config

import (
	"log"
	"os"
)

func getEnvVariable(key string) string {
	envVal := os.Getenv(key)
	if envVal == "" {
		log.Fatalf("env for %s is required", key)
	}
	return envVal
}
