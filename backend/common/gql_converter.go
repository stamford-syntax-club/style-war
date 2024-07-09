package common

import "encoding/json"

func ConvertGqlDataTo[V any](queryName string, data interface{}) (V, error) {
	var nilVal V
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nilVal, err
	}

	var result map[string]V
	if err := json.Unmarshal(jsonData, &result); err != nil {
		return nilVal, err
	}

	return result[queryName], nil
}
