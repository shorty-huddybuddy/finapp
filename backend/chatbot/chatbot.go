package chatbot

import (
	"backend/gemini"
	"backend/portfolio"
	"fmt"
	"os"
	"strings"
)

type RequestBody struct {
	Balance               int     `json:"balance"`
	Experience            string  `json:"experience"`
	Preference            string  `json:"preference"`
	Liquidity             string `json:"liquidity"`
	RiskBearing           string  `json:"risk_bearing"`
	MinimumFreezingPeriod int     `json:"minimum_freezing_period"`
	QueryType             string  `json:"query_type"`
}

func GenerateResponse(req RequestBody) (string, error) {
	// Simulate fetching a user's portfolio
	userPortfolio := portfolio.Portfolio{
		Balance:               req.Balance,
		Experience:            req.Experience,
		Preference:            req.Preference,
		Liquidity:             req.Liquidity,
		RiskBearing:           req.RiskBearing,
		MinimumFreezingPeriod: req.MinimumFreezingPeriod,
	}

	// Load prompt template
	promptBytes, err := os.ReadFile("prompt.txt")
	if err != nil {
		return "", fmt.Errorf("failed to load prompt template: %v", err)
	}

	// Fill prompt template with user's data
	prompt := strings.ReplaceAll(string(promptBytes), "{balance}", fmt.Sprintf("%.2f", userPortfolio.Balance))
	prompt = strings.ReplaceAll(prompt, "{experience}", userPortfolio.Experience)
	prompt = strings.ReplaceAll(prompt, "{preference}", userPortfolio.Preference)
	prompt = strings.ReplaceAll(prompt, "{liquidity}", fmt.Sprintf("%.2f", userPortfolio.Liquidity))
	prompt = strings.ReplaceAll(prompt, "{risk_bearing}", userPortfolio.RiskBearing)
	prompt = strings.ReplaceAll(prompt, "{minimum_freezing_period}", fmt.Sprintf("%d", userPortfolio.MinimumFreezingPeriod))

	// Send the filled prompt to Gemini
	return gemini.QueryGemini(prompt)
}

func Analyze_Portfolio(req map[string]interface{}) (string,error) {
	
	prompt, err := os.ReadFile("analyze_prompt.txt")
	if err != nil {
		return "", fmt.Errorf("failed to load prompt template: %v", err)
	}
	fmt.Println(req)
	prompt = append(prompt, []byte(fmt.Sprintf("%+v", req))...)

	response,err :=  gemini.QueryGemini(string(prompt))
	fmt.Println(response)

	return response,err


}
