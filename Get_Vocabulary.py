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

    def generate_vocabulary(self, topic: str, num_words: int = 50) -> List[Dict]:
        """
        Generate vocabulary words related to a specific topic using Gemini API.
        Focuses on uncommon but useful words (between 7000-30000 most common words).
        
        Args:
            topic (str): The topic to generate vocabulary for
            num_words (int): Number of words to generate (default: 50)
        
        Returns:
            List[Dict]: List of dictionaries containing words and their status
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
            elif len(words) < num_words:
                print(f"Warning: Only generated {len(words)} words instead of requested {num_words}")
            
            # Convert to list of dictionaries with word status
            self.word_list = [
                {
                    "id": i,
                    "word": word,
                    "deleted": False
                }
                for i, word in enumerate(words)
            ]
            
            # Save to JSON immediately after generation
            self.save_to_json()
            
            return self.word_list

        except Exception as e:
            print(f"Error generating vocabulary: {str(e)}")
            return []

### STEP3: Delete words not necessary ###
    def delete_word(self, word_id: int) -> bool:
        """
        Mark a word as deleted by its ID.
        
        Args:
            word_id (int): ID of the word to delete
            
        Returns:
            bool: True if word was found and deleted, False otherwise
        """
        for word_dict in self.word_list:
            if word_dict["id"] == word_id:
                word_dict["deleted"] = True
                self.deleted_words.append(word_dict["word"])
                # Save to JSON after deletion
                self.save_to_json()
                return True
        return False

    def get_active_words(self) -> List[Dict]:
        """
        Get list of words that haven't been deleted.
        
        Returns:
            List[Dict]: List of active (non-deleted) words
        """
        return [word for word in self.word_list if not word["deleted"]]


### STEP4: Save the list as JSON file ###
    def save_to_json(self) -> str:
        """
        Save the current vocabulary list to a JSON file.
        
        Returns:
            str: Path to the saved JSON file
        """
        # Create a timestamp for the filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"vocabulary_{self.topic.lower().replace(' ', '_')}_{timestamp}.json"
        
        # Prepare data structure
        data = {
            "topic": self.topic,
            "timestamp": timestamp,
            "total_words": len(self.word_list),
            "active_words": len(self.get_active_words()),
            "deleted_words": len(self.deleted_words),
            "words": self.word_list
        }
        
        # Save to JSON file
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"\nVocabulary saved to: {filename}")
        return filename

### STEP1: Ask for topic ###
### STEP2: Generate vocabulary ###
def test_generate():
    """Test function to generate vocabulary for a sample topic"""
    manager = VocabularyManager()
    test_topic = input("Enter the topic: ")
    print(f"Generating vocabulary for topic: {test_topic}")
    
    # Generate initial word list
    words = manager.generate_vocabulary(test_topic)
    
    # Print initial list
    print(f"\nGenerated {len(words)} words for topic '{test_topic}':")
    active_words = manager.get_active_words()
    for word in active_words:
        print(f"{word['id']}. {word['word']}")
    
    # Simulate deleting some words (for testing)
    print("\nSimulating deletion of words with IDs 1, 3, 5...")
    for word_id in [1, 3, 5]:
        if manager.delete_word(word_id):
            print(f"Deleted word with ID {word_id}")
    
    # Print remaining words
    print("\nRemaining words after deletion:")
    active_words = manager.get_active_words()
    for word in active_words:
        print(f"{word['id']}. {word['word']}")

if __name__ == "__main__":
    test_generate()  # Run test function instead of asking for input
