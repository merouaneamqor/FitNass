import requests
from bs4 import BeautifulSoup
import csv
import json
import time
import random

# Base URL
BASE_URL = "https://www.clubs.ma/casablanca?page="

# Headers to mimic a browser request
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

# Function to scrape club data
def scrape_clubs(page=1):
    url = f"{BASE_URL}{page}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        # Add a small delay to avoid overloading the server
        time.sleep(random.uniform(1, 3))
    except requests.exceptions.RequestException as e:
        print(f"Error fetching page {page}: {e}")
        return []

    soup = BeautifulSoup(response.content, "html.parser")
    clubs = []

    for club in soup.find_all("li", itemprop="itemListElement"):
        club_data = {}
        
        # Basic information
        club_data["name"] = club.find("h3", itemprop="name").text.strip() if club.find("h3", itemprop="name") else "N/A"
        print(f"Scraping club: {club_data['name']}")  # Show progress
        
        # Check if verified
        club_data["verified"] = bool(club.select_one(".verified-check"))
        
        # Check if top partner
        club_data["is_top_partner"] = "top-partner" in club.get("class", [])
        
        # Club type
        type_elem = club.select_one(".locality strong")
        club_data["type"] = type_elem.text.strip() if type_elem else "N/A"
        
        # Address components
        address_elem = club.find("span", itemprop="address")
        if address_elem:
            club_data["address"] = address_elem.text.strip()
            
            # Extract quarter/neighborhood
            quarter_elem = address_elem.select_one("a[title*='Quartier'], a[title*='quartier']")
            club_data["quarter"] = quarter_elem.text.strip() if quarter_elem else "N/A"
            
            # Extract city
            city_elem = address_elem.select_one("a[title*='Casablanca'], a[title*='casablanca']")
            club_data["city"] = city_elem.text.strip() if city_elem else "N/A"
        else:
            club_data["address"] = "N/A"
            club_data["quarter"] = "N/A"
            club_data["city"] = "N/A"
        
        # Phone
        phone_elem = club.find("span", class_="club-phone")
        club_data["phone"] = phone_elem.text.strip() if phone_elem else "N/A"
        
        # Description
        desc_elem = club.find("p", itemprop="description")
        club_data["description"] = desc_elem.text.strip() if desc_elem else "N/A"
        
        # Image URL
        img_elem = club.select_one("img[itemprop='image']")
        if img_elem:
            club_data["image_url"] = img_elem.get("src") or img_elem.get("data-src", "N/A")
        else:
            club_data["image_url"] = "N/A"
        
        # Club URL
        url_elem = club.select_one("a[itemprop='url']")
        club_data["url"] = "https://www.clubs.ma" + url_elem.get("href") if url_elem and url_elem.get("href") else "N/A"
        
        # Rating
        rating_input = club.select_one(".rating-input")
        club_data["rating"] = float(rating_input.get("value", 0)) if rating_input else 0
        
        # Badges/Tags
        badge_elem = club.select_one(".badge-partner-1")
        club_data["special_badge"] = badge_elem.text.strip() if badge_elem else "N/A"
        
        # Sports/Activities
        activities = []
        for sport in club.select(".club-sports a.badge"):
            activities.append(sport.text.strip())
        club_data["activities"] = activities if activities else []
        
        # Contact and free trial availability
        club_data["has_contact_form"] = bool(club.select_one("a[href*='#contact']"))
        club_data["offers_free_trial"] = bool(club.select_one("a[href*='#essai']"))
        
        clubs.append(club_data)

    return clubs

# Scrape multiple pages (detect last page dynamically)
all_clubs = []
page = 1
max_pages = 26  # Safety limit to avoid infinite loops

print(f"Starting to scrape clubs data from {BASE_URL}...")
while page <= max_pages:
    print(f"Scraping page {page}...")
    clubs = scrape_clubs(page)
    if not clubs:
        print(f"No more clubs found on page {page}. Stopping.")
        break
    all_clubs.extend(clubs)
    print(f"Found {len(clubs)} clubs on page {page}.")
    page += 1

print(f"Total clubs scraped: {len(all_clubs)}")

# Save data to CSV
csv_fields = ["name", "type", "address", "quarter", "city", "phone", "rating", 
              "verified", "is_top_partner", "special_badge", "description", 
              "image_url", "url", "activities", "has_contact_form", "offers_free_trial"]

with open("clubs.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(file, fieldnames=csv_fields)
    writer.writeheader()
    
    # Convert lists to strings for CSV
    for club in all_clubs:
        if "activities" in club and isinstance(club["activities"], list):
            club["activities"] = ", ".join(club["activities"])
        writer.writerow(club)

# Save data to JSON for more complete data preservation
with open("clubs.json", "w", encoding="utf-8") as file:
    json.dump(all_clubs, file, ensure_ascii=False, indent=4)

print("Scraping completed! Data saved to clubs.csv and clubs.json locally.")
