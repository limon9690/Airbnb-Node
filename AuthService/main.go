package main

import (
	"authservice/app"
	env "authservice/config/env"
)

func main() {
	env.Load()

	config := app.NewConfig()
	app := app.NewApplication(config)

	app.Run()
}
