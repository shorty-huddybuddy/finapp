package handlers

import (
	"backend/services"
	"os"

	"github.com/gofiber/fiber/v2"
)

type response_price struct {
	Price float64 `json:"price"`
}

func PriceHandler(c *fiber.Ctx) error {

	var priceFetcher = services.NewRealTimePriceFetcher(os.Getenv("FINHUB_API_KEY"))
	ticker := c.Query("ticker")
	category := c.Query("category")
	price_val, err := priceFetcher.GetCurrentPrice(ticker, category)
	if err != nil {

	}
	
	resp := response_price{Price: price_val}
	return c.JSON(resp)

}
