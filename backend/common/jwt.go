package common

import (
	"log"
	"os"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

func NewJWTMiddleware() *jwt.GinJWTMiddleware {
	jwtAuth := &jwt.GinJWTMiddleware{
		Realm:       "style-wars",
		Key:         []byte(os.Getenv("JWT_SECRET")),
		TokenLookup: "query:token, header:Authorization",
		Unauthorized: func(c *gin.Context, code int, message string) {
			c.JSON(code, gin.H{
				"code":    code,
				"message": message,
			})
		},
		SigningAlgorithm: "HS256",
	}
	if err := jwtAuth.MiddlewareInit(); err != nil {
		log.Fatalf("JWT Middleware initialization failed: %v", err)
	}

	return jwtAuth
}

func NewOptionalJWTMiddleware() *jwt.GinJWTMiddleware {
	jwtAuth := &jwt.GinJWTMiddleware{
		Realm:         "style-wars",
		Key:           []byte(os.Getenv("JWT_SECRET")),
		TokenLookup:   "query:token, header:Authorization",
		DisabledAbort: true,
		Unauthorized: func(c *gin.Context, code int, message string) {
			c.Next()
		},
		SigningAlgorithm: "HS256",
	}
	if err := jwtAuth.MiddlewareInit(); err != nil {
		log.Fatalf("JWT Middleware initialization failed: %v", err)
	}

	return jwtAuth
}

func ExtractUserId(c *gin.Context) string {
	claims := jwt.ExtractClaims(c)
	if userId, ok := claims["sub"].(string); ok && userId != "" {
		return userId
	}

	return ""
}
