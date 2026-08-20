"""
FastAPI Backend Setup for Marine Data Platform
This script demonstrates the backend API structure that would be implemented.
"""

import json
from datetime import datetime, timedelta
import random

# Mock data generators for the marine platform
def generate_ocean_data():
    """Generate mock ocean parameters data"""
    base_date = datetime.now() - timedelta(days=30)
    data = []
    
    for i in range(30):
        date = base_date + timedelta(days=i)
        data.append({
            "date": date.isoformat(),
            "temperature": round(random.uniform(18.5, 24.2), 1),
            "salinity": round(random.uniform(34.5, 36.8), 1),
            "chlorophyll": round(random.uniform(0.8, 3.2), 2)
        })
    
    return data

def generate_fish_data():
    """Generate mock fish distribution data"""
    species = [
        "Atlantic Cod", "Bluefin Tuna", "Haddock", "Mackerel", 
        "Sardine", "Anchovy", "Sea Bass", "Flounder"
    ]
    
    data = []
    for species_name in species:
        data.append({
            "species": species_name,
            "abundance": random.randint(50, 500),
            "region": random.choice(["North Atlantic", "Mediterranean", "Baltic Sea"])
        })
    
    return data

def generate_biodiversity_data():
    """Generate mock biodiversity breakdown"""
    return {
        "pelagic": random.randint(120, 180),
        "benthic": random.randint(80, 140),
        "crustaceans": random.randint(60, 100),
        "others": random.randint(40, 80)
    }

def generate_ai_predictions():
    """Generate mock AI prediction results"""
    return [
        {
            "type": "otolith_classification",
            "species": "Atlantic Cod",
            "confidence": 0.94,
            "timestamp": datetime.now().isoformat()
        },
        {
            "type": "dna_sequence_match",
            "species": "Bluefin Tuna",
            "confidence": 0.87,
            "timestamp": (datetime.now() - timedelta(hours=2)).isoformat()
        }
    ]

# Generate and save mock data
if __name__ == "__main__":
    print("Generating mock marine data...")
    
    ocean_data = generate_ocean_data()
    fish_data = generate_fish_data()
    biodiversity_data = generate_biodiversity_data()
    ai_predictions = generate_ai_predictions()
    
    print(f"Generated {len(ocean_data)} ocean data points")
    print(f"Generated {len(fish_data)} fish species records")
    print(f"Generated biodiversity breakdown: {biodiversity_data}")
    print(f"Generated {len(ai_predictions)} AI predictions")
    
    print("\nBackend API would serve this data through endpoints:")
    print("GET /api/ocean-data")
    print("GET /api/fish-data") 
    print("GET /api/biodiversity-data")
    print("GET /api/ai-predictions")
    print("POST /api/predict-otolith")
    print("POST /api/predict-dna")
