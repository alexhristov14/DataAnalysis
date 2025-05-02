from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
from data import load_data, five_number_summary, get_feature_data_method, generate_feature_analysis_data, get_features, correlation_matrix, missing_values_summary, data_types_summary, unique_values_summary, categorical_summary, numerical_summary

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        with open(f"./uploads/{file.filename}", "wb") as f:
            shutil.copyfileobj(file.file, f)
        return JSONResponse(content={"filename": file.filename}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    

@app.get("/api/uploads/{filename}")
async def get_file(filename: str):
    try:        
        df = load_data(f"./uploads/{filename}")

        if df.empty:
            return JSONResponse(content={"error": "File is empty or not found"}, status_code=404)
    
        features = get_features(df)
        five_num_summary = five_number_summary(df).to_dict(orient="records")
        correlation = correlation_matrix(df).to_dict(orient="records")
        missing_values = missing_values_summary(df).to_dict(orient="records")

        return JSONResponse(content={
            "features": features,
            "five_number_summary": five_num_summary,
            "correlation": correlation,
            "missing_values": missing_values,
        }, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    

@app.get("/api/feature_data/{filename}/{feature}")
async def get_feature_data(filename: str, feature: str):
    try:
        df = load_data(f"./uploads/{filename}")

        if df.empty:
            return JSONResponse(content={"error": "File is empty or not found"}, status_code=404)
        
        feature_data = generate_feature_analysis_data(df, feature).to_dict(orient="records")

        return JSONResponse(content={'feature_data': feature_data})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
@app.get("/api/feature_data/{filename}/{feature}/{data}")
async def get_specific_feature_data(filename: str, feature: str, data: str):
    try:
        df = load_data(f"./uploads/{filename}")

        if df.empty:
            return JSONResponse(content={"error": "File is empty or not found"}, status_code=404)
        
        result = get_feature_data_method(df, feature, data)
        result = result.to_dict() if data == 'unique' else result
        
        return JSONResponse(content={"result": result})

    except Exception as e:    
        return JSONResponse(content={"error": str(e)}, status_code=500)
    