package DB

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDatabase(connString string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(connString), &gorm.Config{})
	fmt.Println("🚀 Successfully connected to the database!")
	return db, err
}
