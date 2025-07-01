package DB

import (
	"context"
	"fmt"
	"log"

	"github.com/redis/go-redis/v9"
)

type Creds struct {
	URL     string
	Pssword string
}

func ConnectRedis(ctx context.Context, redisCreds *Creds) *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:     redisCreds.URL,
		Password: redisCreds.Pssword,
		DB:       0,
	})

	pong, err := client.Ping(ctx).Result()
	if err != nil {
		log.Fatal("Error connecting to Redis:", err)
	}
	fmt.Println("Connected to Redis:", pong)
}
