from transformers import pipeline

# Cache the model globally so it loads only once
_classifier = None

def get_classifier():
    """
    Loads the DistilBERT zero-shot classification model.
    """
    global _classifier
    if _classifier is None:
        print("🔄 Loading DistilBERT model... (this may take a minute on first run)")
        _classifier = pipeline(
            "zero-shot-classification",
            model="typeform/distilbert-base-uncased-mnli",
            device=-1
        )
        print("✅ Model loaded successfully!")
    return _classifier


def classify_prompt(prompt):
    """
    Classifies a prompt into SAFE, JAILBREAK, or PROMPT_INJECTION.
    Uses keyword detection FIRST, then falls back to zero-shot model.
    """

    prompt_lower = prompt.lower().strip()

    # ============================================
    # STEP 1: Keyword-based detection (HIGH priority)
    # ============================================

    jailbreak_keywords = [
        "ignore previous instructions", "ignore all instructions",
        "ignore above instructions", "disregard all",
        "disregard previous", "act as an unrestricted",
        "you are now", "do anything now", "bypass safety",
        "bypass your", "unrestricted ai", "no restrictions",
        "jailbreak", "dan mode", "pretend you are",
        "override your instructions", "forget your instructions",
        "forget all previous", "act as dan", "developer mode",
        "opposite mode", "evil mode", "god mode",
        "unlock your full potential", "remove all filters",
        "without any restrictions", "no ethical guidelines",
        "ignore your programming", "break free from",
        "disable your safety", "turn off your filters"
    ]

    injection_keywords = [
        "reveal the system prompt", "reveal system prompt",
        "show system prompt", "show me your instructions",
        "display your prompt", "repeat your instructions",
        "what were you told", "show initial prompt",
        "output your rules", "what is your system prompt",
        "print your instructions", "show your configuration",
        "what are your rules", "show me your prompt",
        "display initial instructions", "reveal your prompt",
        "tell me your system message", "what instructions were you given",
        "show hidden prompt", "leak your prompt"
    ]

    # Check jailbreak keywords
    for keyword in jailbreak_keywords:
        if keyword in prompt_lower:
            return {
                "label": "JAILBREAK",
                "confidence": 0.95,
                "all_scores": {"JAILBREAK": 0.95, "PROMPT_INJECTION": 0.03, "SAFE": 0.02}
            }

    # Check injection keywords
    for keyword in injection_keywords:
        if keyword in prompt_lower:
            return {
                "label": "PROMPT_INJECTION",
                "confidence": 0.93,
                "all_scores": {"PROMPT_INJECTION": 0.93, "JAILBREAK": 0.04, "SAFE": 0.03}
            }

    # ============================================
    # STEP 2: Short/simple prompts → auto SAFE
    # ============================================

    # If prompt is very short or a simple greeting/question, mark as SAFE
    safe_patterns = [
        "hi", "hello", "hey", "good morning", "good evening",
        "thank you", "thanks", "bye", "goodbye", "ok", "okay",
        "yes", "no", "sure", "please", "help"
    ]

    # Short prompts (less than 5 words) with no suspicious content → SAFE
    word_count = len(prompt_lower.split())

    if prompt_lower in safe_patterns or word_count <= 3:
        return {
            "label": "SAFE",
            "confidence": 0.95,
            "all_scores": {"SAFE": 0.95, "JAILBREAK": 0.03, "PROMPT_INJECTION": 0.02}
        }

    # Common question starters → likely SAFE
    safe_starters = [
        "what is", "what are", "how to", "how do", "how does",
        "explain", "describe", "tell me about", "can you help",
        "who is", "who are", "when did", "when was", "where is",
        "why do", "why does", "why is", "define", "summarize",
        "write a", "create a", "generate a", "list the",
        "compare", "difference between", "what does", "how can"
    ]

    for starter in safe_starters:
        if prompt_lower.startswith(starter):
            return {
                "label": "SAFE",
                "confidence": 0.92,
                "all_scores": {"SAFE": 0.92, "JAILBREAK": 0.05, "PROMPT_INJECTION": 0.03}
            }

    # ============================================
    # STEP 3: Use AI model for ambiguous prompts
    # ============================================

    classifier = get_classifier()

    labels = [
        "a normal safe question or request",
        "a jailbreak attempt trying to bypass AI restrictions and safety",
        "a prompt injection trying to extract system instructions or manipulate behavior"
    ]

    result = classifier(prompt, labels)

    label_map = {
        "a normal safe question or request": "SAFE",
        "a jailbreak attempt trying to bypass AI restrictions and safety": "JAILBREAK",
        "a prompt injection trying to extract system instructions or manipulate behavior": "PROMPT_INJECTION"
    }

    top_label = result["labels"][0]
    top_score = result["scores"][0]
    classified_label = label_map.get(top_label, "SAFE")

    # If model confidence is low and it's not clearly malicious → default to SAFE
    if top_score < 0.6 and classified_label != "SAFE":
        # Check second highest — if SAFE is close, prefer SAFE
        for i, label in enumerate(result["labels"]):
            if label_map.get(label) == "SAFE" and result["scores"][i] > 0.3:
                classified_label = "SAFE"
                top_score = result["scores"][i]
                break

    return {
        "label": classified_label,
        "confidence": round(top_score, 4),
        "all_scores": {
            label_map[label]: round(score, 4)
            for label, score in zip(result["labels"], result["scores"])
        }
    }