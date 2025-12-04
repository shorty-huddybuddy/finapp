package gemini

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

// GeminiAPIEndpoint is the endpoint for the Gemini API (replace with your actual API key).
func QueryGemini(prompt string) (string, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("GEMINI_API_KEY environment variable is not set")
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		log.Printf("Error creating Gemini client: %v", err)
		return "", fmt.Errorf("failed to create Gemini client: %v", err)
	}
	defer client.Close()

	// Try gemini-pro as fallback if gemini-1.5-flash is not available
	model := client.GenerativeModel("gemini-pro")
	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{genai.Text(`
            You are a helpful financial assistant. Provide accurate, clear, and actionable financial advice.
        `)},
	}

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		log.Printf("Error generating content from Gemini: %v", err)

		// Fallback response in development mode when Gemini API fails
		if os.Getenv("APP_ENV") == "development" {
			log.Println("⚠️  Using fallback mock response due to Gemini API error")
			return getMockFinancialAdvice(prompt), nil
		}

		return "", fmt.Errorf("failed to generate content: %v", err)
	}

	if resp == nil || len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		log.Println("⚠️  Empty response from Gemini, using fallback")
		if os.Getenv("APP_ENV") == "development" {
			return getMockFinancialAdvice(prompt), nil
		}
		return "", fmt.Errorf("empty response from Gemini API")
	}

	str := fmt.Sprintf("%v", resp.Candidates[0].Content.Parts[0])

	return str, nil

}

// func main() {
// 	text, err := QueryGemini("hello")
// 	fmt.Println(text, err)

// }

// const GeminiAPIEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyD5A5-Zjv-_xVmon23WVAAQPZYcsV0iqCo"

// // GeminiRequest defines the request structure for the Gemini API.
// type GeminiRequest struct {
// 	Prompt struct {
// 		Parts []struct {
// 			Text string `json:"text"`
// 		} `json:"parts"`
// 	} `json:"contents"`
// }

// // GeminiResponse defines the response structure from the Gemini API.
// type GeminiResponse struct {
// 	Candidates []struct {
// 		Output string `json:"output"`
// 	} `json:"candidates"`
// }

// // QueryGemini sends a query to the Gemini API and retrieves the response.
// func QueryGemini(prompt string) (string, error) {
// 	// Create the request payload.
// 	requestPayload := map[string]interface{}{
// 		"contents": []map[string]interface{}{
// 			{
// 				"parts": []map[string]interface{}{
// 					{"text": prompt},
// 				},
// 			},
// 		},
// 	}

// 	// Marshal the payload to JSON.
// 	requestBody, err := json.Marshal(requestPayload)
// 	if err != nil {
// 		return "", fmt.Errorf("failed to marshal request body: %v", err)
// 	}

// 	// Send the HTTP POST request.
// 	resp, err := http.Post(GeminiAPIEndpoint, "application/json", bytes.NewBuffer(requestBody))
// 	if err != nil {
// 		return "", fmt.Errorf("Gemini API request failed: %v", err)
// 	}
// 	defer resp.Body.Close()

// 	// Read and parse the response body.
// 	responseBody, err := ioutil.ReadAll(resp.Body)
// 	if err != nil {
// 		return "", fmt.Errorf("failed to read response body: %v", err)
// 	}

// 	var geminiResp GeminiResponse
// 	if err := json.Unmarshal(responseBody, &geminiResp); err != nil {
// 		return "", fmt.Errorf("failed to parse Gemini API response: %v", err)
// 	}

// 	// Check if there are any candidates in the response.
// 	if len(geminiResp.Candidates) == 0 {
// 		return "", fmt.Errorf("no candidates returned in Gemini response")
// 	}

// 	return geminiResp.Candidates[0].Output, nil

// getMockFinancialAdvice provides fallback responses when Gemini API is unavailable

func getMockFinancialAdvice(prompt string) string {
	// Check if this is for investment planning (expects JSON array)
	if strings.Contains(prompt, "investment recommendation") || strings.Contains(prompt, "Investment Preference") {
		return `[
  {
    "investment_option": "S&P 500 Index Fund (VOO)",
    "allocation": "40%",
    "liquidity": "high",
    "risk": "medium"
  },
  {
    "investment_option": "Total Bond Market (BND)",
    "allocation": "30%",
    "liquidity": "high",
    "risk": "low"
  },
  {
    "investment_option": "International Stocks (VXUS)",
    "allocation": "20%",
    "liquidity": "high",
    "risk": "medium"
  },
  {
    "investment_option": "High-Yield Savings Account",
    "allocation": "10%",
    "liquidity": "very high",
    "risk": "very low"
  }
]`
	}

	// Default response for portfolio analysis or other queries
	return `Based on your financial profile, here are my recommendations:

**Investment Strategy:**
- Diversify your portfolio across different asset classes
- Consider a balanced approach with 60% stocks and 40% bonds
- Focus on low-cost index funds for long-term growth

**Risk Management:**
- Maintain an emergency fund covering 6 months of expenses
- Review and rebalance your portfolio quarterly
- Consider your risk tolerance and investment horizon

**Next Steps:**
1. Start with broad market index funds
2. Set up automatic monthly contributions
3. Monitor your investments regularly but avoid emotional decisions

Note: This is a demonstration response. The Gemini API should now work with your configured API key.`
}
