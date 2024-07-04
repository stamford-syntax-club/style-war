package common

import (
	"net/http"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

func ExtractUserId(c *gin.Context) string {
	claims := jwt.ExtractClaims(c)
	userId := claims["sub"].(string)
	if userId == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": "missing userId",
		})
		return ""
	}

	return userId
}
