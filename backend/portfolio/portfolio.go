// package portfolio

// type Preference struct {
// 	Stock string `json:"stock"`
// }

// type Portfolio struct {
// 	Balance int `json:"balance"`
// 	Experience string `json:"experience"`
// 	Preference string `json:"preference"`
// 	Stock string `json:"stock"`
// }

package portfolio

type Preference struct {
	Stock string `json:"stock"`
}

type Portfolio struct {
	Balance               int     `json:"balance"`
	Experience            string  `json:"experience"`
	Preference            string  `json:"preference"`
	Stock                 string  `json:"stock"`
	Liquidity             float64 `json:"liquidity"`
	RiskBearing           string  `json:"risk_bearing"`
	MinimumFreezingPeriod int     `json:"minimum_freezing_period"`
}
