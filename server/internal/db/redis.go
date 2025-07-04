package DB

import (
	"context"
	"fmt"
	"log"

	"github.com/redis/go-redis/v9"
)

type RedisCreds struct {
	URL      string
	Password string
}

func ConnectRedis(ctx context.Context, redisCreds *RedisCreds) *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:     redisCreds.URL,
		Password: redisCreds.Password,
		DB:       0,
	})

	pong, err := client.Ping(ctx).Result()
	if err != nil {
		log.Fatal("Error connecting to Redis:", err)
	}
	fmt.Println("Connected to Redis:", pong)
	return client
}
