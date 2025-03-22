import csv
from datetime import datetime
from typing import List, Dict
from Get_Vocabulary import generate_words

class VocabularySelector:
    def __init__(self, topic: str):
        """Initialize with a topic and get words."""
        self.topic = topic
        self.words = [
            {"word": word.strip(), "selected": True}
            for word in generate_words(topic).split(", ")
        ]
    
    def get_all_words(self) -> List[Dict[str, any]]:
        """Get all words with their selection status."""
        return self.words
    
    def get_selected_words(self) -> List[str]:
        """Get only the selected words."""
        return [word["word"] for word in self.words if word["selected"]]
    
    def cross_word(self, word: str) -> bool:
        """Mark a word as not selected (crossed out).
        
        Args:
            word: The word to cross out
            
        Returns:
            bool: True if word was found and crossed out, False otherwise
        """
        for word_dict in self.words:
            if word_dict["word"].lower() == word.lower():
                word_dict["selected"] = False
                return True
        return False
    
    def select_word(self, word: str) -> bool:
        """Mark a word as selected (un-cross it).
        
        Args:
            word: The word to select
            
        Returns:
            bool: True if word was found and selected, False otherwise
        """
        for word_dict in self.words:
            if word_dict["word"].lower() == word.lower():
                word_dict["selected"] = True
                return True
        return False
    
    def save_to_csv(self, filename: str = None) -> str:
        """Save selected words to a CSV file.
        
        Args:
            filename: Optional custom filename. If not provided, will generate one
                     with topic and timestamp.
                     
        Returns:
            str: Path to the saved CSV file
        """
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"vocabulary_{self.topic.lower().replace(' ', '_')}_{timestamp}.csv"
        
        selected_words = self.get_selected_words()
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(["Topic", "Words"])
            writer.writerow([self.topic, ", ".join(selected_words)])
        
        return filename

# Example usage:
def test():
    # Create selector with a topic
    selector = VocabularySelector("Gaming")
    
    # Get initial words
    print(selector.get_selected_words())
    
    # Cross out some words
    selector.cross_word("rendering")
    selector.cross_word("latency")
    
    # Get remaining selected words
    print(selector.get_selected_words())
    
    # Save to CSV
    filename = selector.save_to_csv()
    print(f"Saved to: {filename}")

if __name__ == "__main__":
    test()