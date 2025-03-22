import google.generativeai as genai
from typing import List, Dict
import os
import json
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure Gemini API
GOOGLE_API_KEY = "AIzaSyCf6FRVXJiHhP3trsCO6yIHyLoXr4uQ3kg"
genai.configure(api_key=GOOGLE_API_KEY)

class VocabularyManager:
    def __init__(self):
        self.word_list: List[Dict] = []  # List of dictionaries containing words and their status
        self.deleted_words: List[str] = []  # Track deleted words
        self.topic: str = ""

    def generate_vocabulary(self, topic: str, num_words: int = 20) -> List[str]:
        """
        Generate vocabulary words related to a specific topic using Gemini API.
        Focuses on uncommon but useful words (between 7000-30000 most common words).
        
        Args:
            topic (str): The topic to generate vocabulary for
            num_words (int): Number of words to generate
        
        Returns:
            List[str]: List of generated vocabulary words
        """
        try:
            self.topic = topic
            # Initialize Gemini model
            model = genai.GenerativeModel('models/gemini-1.5-pro')
            
            # Craft the prompt
            prompt = f"""You're Lexicon Finder. For the topic '{topic}', extract and list exactly {num_words} vocabulary words.
            Requirements:
            1. Each word must be uncommon - beyond the most common 7000 words but within the most common 30000 words in English
            2. Words should be verifiable using Google Ngram Viewer frequency data
            3. Avoid rare idioms or phrases
            4. All words must be directly related to {topic}
            5. Include a mix of:
               - Technical terms specific to {topic}
               - Related verbs
               - Related adjectives
               - Related nouns
            
            Format: Return ONLY a comma-separated list of words, with no additional text or explanations."""

            # Generate response
            response = model.generate_content(prompt)
            
            # Process the response
            words = [word.strip() for word in response.text.split(',')]
            
            # Ensure we have exactly the requested number of words
            if len(words) > num_words:
                words = words[:num_words]
            
            # Convert to list of dictionaries with word status
            self.word_list = [
                {
                    "id": i,
                    "word": word,
                    "deleted": False
                }
                for i, word in enumerate(words)
            ]
            
            # Save to JSON
            self.save_to_json()
            
            # Return only the words
            return [word["word"] for word in self.word_list]

        except Exception as e:
            return []

    def save_to_json(self) -> str:
        """Save the current vocabulary list to a JSON file."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"vocabulary_{self.topic.lower().replace(' ', '_')}_{timestamp}.json"
        
        data = {
            "topic": self.topic,
            "timestamp": timestamp,
            "total_words": len(self.word_list),
            "active_words": len(self.get_active_words()),
            "deleted_words": len(self.deleted_words),
            "words": self.word_list
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return filename

    def get_active_words(self) -> List[Dict]:
        """Get list of words that haven't been deleted."""
        return [word for word in self.word_list if not word["deleted"]]

def generate_words(topic: str, num_words: int = 20) -> str:
    """Generate vocabulary words for a topic and return as comma-separated string."""
    manager = VocabularyManager()
    words = manager.generate_vocabulary(topic)
    return ", ".join(words)

def delete_words(topic: str, word_ids: List[int]) -> str:
    """Delete specific words by their IDs and return updated list."""
    manager = VocabularyManager()
    words = manager.generate_vocabulary(topic)
    
    # Delete specified words
    for word_id in word_ids:
        if 0 <= word_id < len(manager.word_list):
            manager.word_list[word_id]["deleted"] = True
            manager.deleted_words.append(manager.word_list[word_id]["word"])
    
    # Save updated list
    manager.save_to_json()
    
    # Return remaining words
    active_words = [word["word"] for word in manager.word_list if not word["deleted"]]
    return ", ".join(active_words)

if __name__ == "__main__":
    # Example of generating words
    result = generate_words("Gaming")
    print(result)
