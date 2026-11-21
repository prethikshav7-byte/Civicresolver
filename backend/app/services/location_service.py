from typing import List, Dict, Any, Optional
from backend.app.database.connection import local_store

COIMBATORE_LOCALITIES_GEO = [
    {
        "name": "Gandhipuram",
        "display_name": "Gandhipuram, Central Zone, Coimbatore 641012, Tamil Nadu",
        "lat": 11.0168,
        "lng": 76.9558,
        "ward": 70,
        "zone": "Central Zone",
        "landmarks": ["Central Bus Stand", "Cross Cut Road", "GP Signal", "Bharathiyar Road"]
    },
    {
        "name": "RS Puram",
        "display_name": "R.S. Puram, West Zone, Coimbatore 641002, Tamil Nadu",
        "lat": 11.0089,
        "lng": 76.9464,
        "ward": 23,
        "zone": "West Zone",
        "landmarks": ["DB Road", "Cowley Brown Road", "Diwan Bahadur Road", "Post Office"]
    },
    {
        "name": "Peelamedu",
        "display_name": "Peelamedu, North Zone, Coimbatore 641004, Tamil Nadu",
        "lat": 11.0284,
        "lng": 77.0035,
        "ward": 38,
        "zone": "North Zone",
        "landmarks": ["PSG Tech", "Avinashi Road", "Fun Republic Mall", "Airport Corridor"]
    },
    {
        "name": "Singanallur",
        "display_name": "Singanallur, East Zone, Coimbatore 641005, Tamil Nadu",
        "lat": 10.9998,
        "lng": 77.0253,
        "ward": 55,
        "zone": "East Zone",
        "landmarks": ["Singanallur Lake", "Trichy Road", "Singanallur Bus Stand", "Boat House"]
    },
    {
        "name": "Ukkadam",
        "display_name": "Ukkadam, South Zone, Coimbatore 641001, Tamil Nadu",
        "lat": 10.9934,
        "lng": 76.9602,
        "ward": 84,
        "zone": "South Zone",
        "landmarks": ["Periyakulam Lake", "Ukkadam Flyover", "Fish Market", "Palakkad Road"]
    },
    {
        "name": "Race Course",
        "display_name": "Race Course, Central Zone, Coimbatore 641018, Tamil Nadu",
        "lat": 11.0065,
        "lng": 76.9733,
        "ward": 72,
        "zone": "Central Zone",
        "landmarks": ["Thomas Park", "Jogging Track", "Collectorate", "Gopalapuram"]
    },
    {
        "name": "Saravanampatti",
        "display_name": "Saravanampatti, North Zone, Coimbatore 641035, Tamil Nadu",
        "lat": 11.0797,
        "lng": 76.9997,
        "ward": 38,
        "zone": "North Zone",
        "landmarks": ["CHIL SEZ IT Park", "Sathy Road", "KGISL Campus", "Kumaraguru College"]
    },
    {
        "name": "Saibaba Colony",
        "display_name": "Saibaba Colony, West Zone, Coimbatore 641011, Tamil Nadu",
        "lat": 11.0280,
        "lng": 76.9421,
        "ward": 23,
        "zone": "West Zone",
        "landmarks": ["NSR Road", "Saibaba Temple", "Mettupalayam Road"]
    },
    {
        "name": "Ramanathapuram",
        "display_name": "Ramanathapuram, East Zone, Coimbatore 641045, Tamil Nadu",
        "lat": 11.0012,
        "lng": 76.9856,
        "ward": 55,
        "zone": "East Zone",
        "landmarks": ["Trichy Road", "Sungam Bypass", "All India Radio"]
    }
]

class LocationService:
    @staticmethod
    def search_locations(query: str) -> List[Dict[str, Any]]:
        q = query.lower().strip()
        matches = []
        for loc in COIMBATORE_LOCALITIES_GEO:
            if (q in loc["name"].lower() or 
                q in loc["display_name"].lower() or 
                any(q in lm.lower() for lm in loc["landmarks"])):
                matches.append(loc)
        
        # If no specific match, return top localities in Coimbatore
        if not matches:
            return COIMBATORE_LOCALITIES_GEO[:5]
        return matches

    @staticmethod
    def reverse_geocode(lat: float, lng: float) -> Dict[str, Any]:
        """Finds closest verified Coimbatore locality or landmark for coordinates."""
        closest = None
        min_dist = float('inf')
        for loc in COIMBATORE_LOCALITIES_GEO:
            d = (loc["lat"] - lat) ** 2 + (loc["lng"] - lng) ** 2
            if d < min_dist:
                min_dist = d
                closest = loc
        
        if closest and min_dist < 0.005:  # Within ~5 km
            return {
                "address": f"Near {closest['landmarks'][0]}, {closest['name']}, Coimbatore, Tamil Nadu",
                "locality_name": closest["name"],
                "ward_number": closest["ward"],
                "zone": closest["zone"],
                "lat": lat,
                "lng": lng
            }
        
        return {
            "address": f"Coimbatore Corporation, Lat: {lat:.4f}, Lng: {lng:.4f}, Tamil Nadu",
            "locality_name": "Coimbatore Urban",
            "ward_number": 70,
            "zone": "Central Zone",
            "lat": lat,
            "lng": lng
        }
