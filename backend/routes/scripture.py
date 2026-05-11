from fastapi import APIRouter, HTTPException
import httpx
import os
from datetime import datetime

router = APIRouter()

# 30 classic verses with reflection prompts
VERSES = [
    {"reference": "Psalm 23:1-6", "prompt": "How has God been your shepherd recently? Where do you need His guidance and provision?"},
    {"reference": "John 3:16", "prompt": "What does God's love mean to you personally? How does it change how you see others?"},
    {"reference": "Romans 8:28", "prompt": "Recall a time when God worked something difficult for your good. How did it strengthen your faith?"},
    {"reference": "Philippians 4:13", "prompt": "What challenges are you facing where you need Christ's strength? Where are you relying on your own strength instead?"},
    {"reference": "Isaiah 40:31", "prompt": "What does it mean to 'wait on the Lord' in your current season? How can you renew your strength?"},
    {"reference": "Joshua 1:9", "prompt": "Where do you need courage and strength right now? How does God's presence give you confidence?"},
    {"reference": "Jeremiah 29:11", "prompt": "How does knowing God has plans for your future affect your present decisions? What hope does this give you?"},
    {"reference": "Proverbs 3:5-6", "prompt": "In what areas are you leaning on your own understanding instead of trusting God? What would surrender look like?"},
    {"reference": "Matthew 6:33", "prompt": "What does 'seek first His kingdom' mean in your daily life? What distractions keep you from this focus?"},
    {"reference": "Romans 12:2", "prompt": "How is God transforming your mind? What patterns of thinking need renewal?"},
    {"reference": "Ephesians 2:8-9", "prompt": "How does salvation by grace through faith humble you? How does it motivate you to serve others?"},
    {"reference": "Galatians 5:22-23", "prompt": "Which fruit of the Spirit is most evident in your life? Which do you need to cultivate?"},
    {"reference": "1 Corinthians 13:4-7", "prompt": "How does this description of love challenge you? Where do you see God's love in action?"},
    {"reference": "Matthew 28:19-20", "prompt": "How are you participating in the Great Commission? Where do you need to step out in faith?"},
    {"reference": "Hebrews 11:1", "prompt": "What are you hoping for that you cannot see? How is your faith being tested?"},
    {"reference": "James 1:2-4", "prompt": "What trials are you facing? How might God be using them to develop perseverance?"},
    {"reference": "1 Peter 5:7", "prompt": "What anxieties are you carrying? What does it look like to cast them on God?"},
    {"reference": "Romans 5:8", "prompt": "How does Christ's sacrifice demonstrate God's love? How should this affect how you love others?"},
    {"reference": "John 14:6", "prompt": "What does it mean that Jesus is 'the way, the truth, and the life'? How does this exclusivity comfort or challenge you?"},
    {"reference": "Colossians 3:23", "prompt": "How does working 'for the Lord' change your attitude toward your daily tasks?"},
    {"reference": "Matthew 11:28-30", "prompt": "What burdens are you carrying? How does Jesus offer you rest?"},
    {"reference": "Psalm 46:10", "prompt": "What does 'be still and know that I am God' mean in your busy life? Where do you need to pause?"},
    {"reference": "Isaiah 41:10", "prompt": "What fears are you facing? How does God's promise to uphold you give you confidence?"},
    {"reference": "Psalm 119:105", "prompt": "How is God's Word guiding your decisions? Where do you need more illumination?"},
    {"reference": "2 Timothy 3:16-17", "prompt": "How do you view Scripture? How is it equipping you for good works?"},
    {"reference": "Proverbs 31:25", "prompt": "What does it mean to be clothed with strength and dignity? How does this apply to you?"},
    {"reference": "Micah 6:8", "prompt": "How are you doing justice, loving mercy, and walking humbly with God?"},
    {"reference": "Lamentations 3:22-23", "prompt": "How have you experienced God's faithfulness and compassion recently?"},
    {"reference": "Zephaniah 3:17", "prompt": "How does it feel to know God rejoices over you with singing? How does this affect your self-worth?"},
    {"reference": "Revelation 21:4", "prompt": "How does the promise of no more pain or death give you hope today?"}
]

@router.get("/daily")
async def get_daily_verse():
    """Get the verse of the day based on day of year."""
    # Get day of year (1-366)
    day_of_year = datetime.now().timetuple().tm_yday
    # Select verse based on day of year
    verse_index = (day_of_year - 1) % len(VERSES)
    verse_data = VERSES[verse_index]
    
    # Fetch verse text from Bible API
    reference = verse_data["reference"]
    # Format reference for API (replace spaces with %20, colon with %3A)
    api_reference = reference.replace(" ", "%20").replace(":", "%3A")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"https://bible-api.com/{api_reference}")
            if response.status_code == 200:
                data = response.json()
                verse_text = data.get("text", "Verse text not available")
            else:
                verse_text = f"[{reference}] Unable to fetch verse text"
        except Exception:
            verse_text = f"[{reference}] Unable to fetch verse text"
    
    return {
        "reference": reference,
        "text": verse_text.strip(),
        "reflection_prompt": verse_data["prompt"]
    }
