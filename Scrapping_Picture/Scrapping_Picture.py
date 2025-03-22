import requests
import json
from typing import List, Dict
from datetime import datetime
from pathlib import Path

class ImageScraper:
    def __init__(self):
        """Initialize the scraper with Apify API token."""
        self.api_url = "https://api.apify.com/v2/acts/apify~web-scraper/run-sync-get-dataset-items"
        self.api_token = "apify_api_Y9lxmhv8iGQkYLsdRl2dYWBbVgD5KN43gEmq"

    def scrape_images(self, words: List[str], max_images: int = 1) -> Dict[str, List[str]]:
        """Scrape images for vocabulary words using Apify web-scraper.
        
        Args:
            words: List of words to scrape images for
            max_images: Maximum number of images per word
            
        Returns:
            Dict mapping words to lists of image URLs
        """
        results = {}
        
        for word in words:
            try:
                # Create search URL for the word
                search_url = f"https://www.google.com/search?q={word}+gaming+term&tbm=isch"
                
                # Prepare the API request payload
                payload = {
                    "startUrls": [{"url": search_url}],
                    "runScripts": True,
                    "pageFunction": "async function pageFunction({ request, page, log }) { await page.waitForSelector('img'); const data = await page.$$eval('img', imgs => imgs.map(img => img.src)); return { url: request.url, images: data }; }",
                    "proxyConfiguration": {"useApifyProxy": True}
                }
                
                # Make API request
                response = requests.post(
                    self.api_url,
                    params={"token": self.api_token},
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                response.raise_for_status()
                
                # Extract image URLs from response
                data = response.json()
                image_urls = []
                
                for item in data:
                    if isinstance(item, dict) and "images" in item:
                        image_urls.extend([url for url in item["images"] 
                                        if url and not url.startswith('data:')])
                
                # Filter to keep only image URLs
                image_urls = [url for url in image_urls if url.lower().endswith(('.jpg', '.jpeg', '.png', '.gif'))]
                results[word] = image_urls[:max_images]
                print(f"Found {len(image_urls)} images for '{word}'")
                
            except Exception as e:
                print(f"Error scraping images for word '{word}': {str(e)}")
                results[word] = []
        
        return results
    
    def download_images(self, image_data: Dict[str, List[str]], output_dir: str = "vocabulary_images") -> Dict[str, List[str]]:
        """Download images and convert them to JPG format.
        
        Args:
            image_data: Dictionary mapping words to lists of image URLs
            output_dir: Directory to save images in
            
        Returns:
            Dict mapping words to lists of local file paths
        """
        # Create output directory with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_dir = Path(output_dir) / timestamp
        output_dir.mkdir(parents=True, exist_ok=True)
        
        results = {}
        for word, urls in image_data.items():
            word_paths = []
            for i, url in enumerate(urls):
                try:
                    # Download image
                    response = requests.get(url, timeout=10)
                    response.raise_for_status()
                    
                    # Save as JPG
                    filename = f"{word}_{i+1}.jpg"
                    filepath = output_dir / filename
                    
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                    
                    word_paths.append(str(filepath))
                    print(f"Saved image for '{word}' to {filepath}")
                    
                except Exception as e:
                    print(f"Error downloading image for word '{word}' from {url}: {str(e)}")
            
            results[word] = word_paths
        
        return results

def save_image_data(image_data: Dict[str, List[str]], filename: str = None) -> str:
    """Save image data to JSON file.
    
    Args:
        image_data: Dictionary mapping words to lists of image paths
        filename: Optional custom filename
        
    Returns:
        str: Path to saved JSON file
    """
    if not filename:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"vocabulary_images_{timestamp}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(image_data, f, indent=2, ensure_ascii=False)
    
    print(f"Image data saved to: {filename}")
    return filename

def main():
    # Test with just 2 words first
    words = ["permadeath", "leaderboard"]
    
    print(f"Processing {len(words)} words...")
    
    # Initialize scraper and get images
    scraper = ImageScraper()
    
    # Scrape image URLs
    print("\nScraping images...")
    image_urls = scraper.scrape_images(words, max_images=1)
    
    # Download images as JPG
    print("\nDownloading images...")
    image_paths = scraper.download_images(image_urls)
    
    # Save data to JSON
    save_image_data(image_paths)

if __name__ == "__main__":
    main()