from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
import logging
import traceback
from typing import Dict, Any, Union

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Allow frontend on port 5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/data")
async def get_data(page: int = Query(1)):
    # Validate page parameter
    if page < 1:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": "error",
                "message": "Page number must be greater than 0"
            }
        )
    
    # Call the external API with a timeout
    try:
        logger.info(f"Requesting data for page {page}")
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(f"https://interview-api-olive.vercel.app/api/dogs?page={page}")
                response.raise_for_status()  # Raise exception for HTTP error responses
                
                # Try to parse JSON response
                try:
                    data = response.json()
                except Exception as json_error:
                    logger.error(f"JSON parsing error: {str(json_error)}")
                    return JSONResponse(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        content={
                            "status": "error",
                            "message": f"Failed to parse response as JSON: {str(json_error)}"
                        }
                    )
                
                # Check if response is an array of objects
                if not isinstance(data, list):
                    logger.error(f"Invalid response format: {type(data)}")
                    return JSONResponse(
                        status_code=status.HTTP_200_OK,
                        content={
                            "status": "error",
                            "message": "Response from external API is not an array"
                        }
                    )
                
                if not all(isinstance(item, dict) for item in data):
                    logger.error("Response items are not all objects")
                    return JSONResponse(
                        status_code=status.HTTP_200_OK,
                        content={
                            "status": "error",
                            "message": "Response from external API contains non-object items"
                        }
                    )
                
                logger.info(f"Successfully retrieved {len(data)} items for page {page}")
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={
                        "status": "success",
                        "data": data
                    }
                )
            
            except httpx.TimeoutException as e:
                logger.error(f"Request timeout: {str(e)}")
                return JSONResponse(
                    status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                    content={
                        "status": "error",
                        "message": f"External API request timed out after 10 seconds"
                    }
                )
            
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error {e.response.status_code}: {str(e)}")
                return JSONResponse(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    content={
                        "status": "error",
                        "message": f"External API returned error: {e.response.status_code} {e.response.reason_phrase}"
                    }
                )
            
            except httpx.RequestError as e:
                logger.error(f"Request error: {str(e)}")
                return JSONResponse(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    content={
                        "status": "error",
                        "message": f"Failed to connect to external API: {str(e)}"
                    }
                )
    
    except Exception as e:
        # Catch any other unexpected errors
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": "error", 
                "message": "An internal server error occurred. Please try again later."
            }
        )
