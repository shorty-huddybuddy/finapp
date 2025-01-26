package gemini

import (
	"context"
	"fmt"
	"log"
	"os"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

// GeminiAPIEndpoint is the endpoint for the Gemini API (replace with your actual API key).
func QueryGemini(prompt string) (string, error) {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey((os.Getenv("GEMINI_API_KEY"))))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-1.5-flash")
	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{genai.Text(`
            
        `)},
	}

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		log.Fatal(err)
	}

	// text := resp.Candidates[0].Content.Parts[0]

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
