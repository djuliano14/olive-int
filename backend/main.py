from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx

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
        return {
            "status": "error",
            "message": "Page number must be greater than 0"
        }
    
    # Call the external API
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"https://interview-api-olive.vercel.app/api/dogs?page={page}")
            response.raise_for_status()  # Raise exception for HTTP error responses
            data = response.json()
            
            # Check if response is an array of objects
            if not isinstance(data, list) or not all(isinstance(item, dict) for item in data):
                return {
                    "status": "error",
                    "message": "Response from external API is not an array of objects"
                }
            
            return {
                "status": "success",
                "data": data
            }
        except httpx.HTTPStatusError as e:
            return {
                "status": "error",
                "message": f"External API error: {str(e)}"
            }
        except Exception as e:
            return {
                "status": "error", 
                "message": f"An error occurred: {str(e)}"
            }
