package main

import (
	"authservice/app"
)

func main() {
	config := app.NewConfig(":3001")

	app := app.NewApplication(config)

	app.Run()
}
