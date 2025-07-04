package config

import (
	"log"

	"github.com/spf13/viper"
)

type ENV struct {
	DB_URL          string
	REST_API_PORT   string
	REDIS_URL       string
	REDIS_PASSWORD  string
	GRPC_SERVER_URL string
	GATEWAY_URL     string
}

func GetEnvVariable() *ENV {
	viper.SetConfigFile(".env")
	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("While reading env %s", err)
	}
	return &ENV{
		DB_URL:          viper.GetString("DB_URL"),
		REST_API_PORT:   viper.GetString("REST_API_PORT"),
		REDIS_URL:       viper.GetString("REDIS_URL"),
		REDIS_PASSWORD:  viper.GetString("REDIS_PASSWORD"),
		GRPC_SERVER_URL: viper.GetString("GRPC_SERVER_URL"),
		GATEWAY_URL:     viper.GetString("GATEWAY_URL"),
	}
}
