This is a simple full stack application displaying dog breeds.

## 🧰 Prerequisites

- Node.js (v18+ recommended)
- Python 3.9+
- `pip` for Python dependencies
- `npm` or `yarn` for frontend dependencies

## ✅ Getting Started

Clone the repository, set up the backend and frontend, and run both:

# Clone the repo
git clone https://github.com/yourusername/olive.git
cd olive

# --- Backend ---
cd backend
python3 -m venv venv
source venv/bin/activate  # (On Windows: venv\Scripts\activate)
pip install -r requirements.txt
uvicorn main:app --reload  # Backend runs on http://localhost:8000

# --- Frontend (in a separate terminal window) ---
cd ../frontend
npm install
npm run dev  # Frontend runs on http://localhost:5173

________________________________________________________________________________________________

The frontend React app at http://localhost:5173 will call the backend API.

General process:
- quick Google on fastest+simplest React frontend Python backend config -> Vite + FastAPI
- generated a simple file structure and ran Inits for Vite + FastAPI
- Had copilot generate simple base placeholder component for App.tsx and a FastAPI endpoint that simply calls a 3rd party (see first commit)
- Built simple frontend using test data
- Configured frontend to call backend and display data
- Added expected errors to both frontend and server side
- Ensured validity of response, images, and breeds for dogs
- With a simple Copilot prompt: Changed page number input to an actual input field because we don't know how many pages there are
- Was getting 500 internal server errors inconsistently, added error check but coming up on time

Next todos:
- move CSS or use Tailwind
- find total number of pages to better update UI
- add page number to the URL 
- check for titles with URLs in them and clean it up (ex. )
- check for common invalid image URLs like wikipedia from page 1 American Eskimo Dog (Miniature)
- clean up console logs , figured leave them for now to show where i was checking on things
- add cacheing 

