import os
import json
import requests
from pathlib import Path
import time
from PIL import Image
from io import BytesIO
from bs4 import BeautifulSoup
import urllib.parse

def scrape_images(word, max_images=1):
    """Scrape images for a given word using direct request."""
    # Create search URL for the word
    query = urllib.parse.quote(f"{word} gaming term")
    search_url = f"https://www.bing.com/images/search?q={query}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
    }
    
    try:
        # Make request to Bing Images
        response = requests.get(search_url, headers=headers)
        response.raise_for_status()
        
        # Parse HTML and extract image URLs
        soup = BeautifulSoup(response.text, 'html.parser')
        image_urls = []
        
        # Find image elements (Bing specific)
        for img in soup.find_all('img', class_='mimg'):
            src = img.get('src')
            if src and not src.startswith('data:'):
                image_urls.append(src)
                if len(image_urls) >= max_images:
                    break
        
        # If no images found with class 'mimg', try all images
        if not image_urls:
            for img in soup.find_all('img'):
                src = img.get('src')
                if src and not src.startswith('data:'):
                    image_urls.append(src)
                    if len(image_urls) >= max_images:
                        break
        
        return image_urls[:max_images]
        
    except Exception as e:
        print(f"Error scraping images for word '{word}': {str(e)}")
        return []

def download_image(url, filepath):
    """Download an image from URL and save it as JPG."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'image/webp,*/*',
            'Referer': 'https://www.bing.com/'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Convert image to JPG using PIL
        img = Image.open(BytesIO(response.content))
        if img.mode in ('RGBA', 'LA'):
            # Remove alpha channel
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1])
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Save as JPG
        img.save(filepath, 'JPEG', quality=85)
        return True
        
    except Exception as e:
        print(f"Error downloading image from {url}: {str(e)}")
        return False

def main():
    # Test with just 2 words first
    words = ["permadeath", "leaderboard"]
    
    # Create output directory
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    output_dir = Path("vocabulary_images") / timestamp
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Dictionary to store word -> image path mappings
    image_data = {}
    
    print(f"Processing {len(words)} words...")
    
    for word in words:
        print(f"\nScraping images for '{word}'...")
        image_urls = scrape_images(word, max_images=1)
        
        if image_urls:
            word_paths = []
            for i, url in enumerate(image_urls):
                filename = f"{word}_{i+1}.jpg"
                filepath = output_dir / filename
                
                if download_image(url, filepath):
                    word_paths.append(str(filepath))
                    print(f"Saved image to {filepath}")
            
            image_data[word] = word_paths
        else:
            print(f"No images found for '{word}'")
            image_data[word] = []
    
    # Save image data to JSON
    json_path = output_dir / "image_data.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(image_data, f, indent=2, ensure_ascii=False)
    
    print(f"\nImage data saved to: {json_path}")

if __name__ == "__main__":
    main()