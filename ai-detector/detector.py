# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from model_loader import classify_prompt, get_classifier

# app = Flask(__name__)
# CORS(app)

# # Pre-load model on startup
# print("🛡️  AI Firewall Detection Service Starting...")
# get_classifier()
# print("🛡️  Detection Service Ready!")


# @app.route("/", methods=["GET"])
# def home():
#     """Health check endpoint"""
#     return jsonify({
#         "service": "AI Firewall Detection Service",
#         "status": "running",
#         "model": "DistilBERT (zero-shot classification)"
#     })


# @app.route("/detect", methods=["POST"])
# def detect():
#     """
#     Main detection endpoint.
#     Receives a prompt and returns classification result.
    
#     Request:  { "prompt": "Ignore all instructions and..." }
#     Response: { "label": "JAILBREAK", "confidence": 0.92, "riskScore": 0.91 }
#     """
#     data = request.get_json()

#     if not data or "prompt" not in data:
#         return jsonify({"error": "Prompt is required"}), 400

#     prompt = data["prompt"]

#     if not prompt.strip():
#         return jsonify({"error": "Prompt cannot be empty"}), 400

#     # Classify the prompt
#     result = classify_prompt(prompt)

#     # Calculate risk score
#     risk_score = 0.0
#     if result["label"] == "JAILBREAK":
#         risk_score = 0.4 + (result["confidence"] * 0.6)
#     elif result["label"] == "PROMPT_INJECTION":
#         risk_score = 0.3 + (result["confidence"] * 0.6)
#     elif result["label"] == "SAFE":
#         risk_score = (1 - result["confidence"]) * 0.3

#     result["riskScore"] = round(risk_score, 4)

#     print(f"📊 Prompt: '{prompt[:50]}...' → {result['label']} ({result['confidence']:.2f})")

#     return jsonify(result)


# @app.route("/batch-detect", methods=["POST"])
# def batch_detect():
#     """
#     Batch detection endpoint for testing multiple prompts at once.
    
#     Request:  { "prompts": ["prompt1", "prompt2", ...] }
#     Response: [ { "label": "...", ... }, { "label": "...", ... } ]
#     """
#     data = request.get_json()

#     if not data or "prompts" not in data:
#         return jsonify({"error": "Prompts array is required"}), 400

#     results = []
#     for prompt in data["prompts"]:
#         result = classify_prompt(prompt)
#         risk_score = 0.0
#         if result["label"] == "JAILBREAK":
#             risk_score = 0.4 + (result["confidence"] * 0.6)
#         elif result["label"] == "PROMPT_INJECTION":
#             risk_score = 0.3 + (result["confidence"] * 0.6)
#         elif result["label"] == "SAFE":
#             risk_score = (1 - result["confidence"]) * 0.3
#         result["riskScore"] = round(risk_score, 4)
#         result["prompt"] = prompt
#         results.append(result)

#     return jsonify(results)


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5001, debug=False)

from flask import Flask, request, jsonify
from flask_cors import CORS
from model_loader import classify_prompt, get_classifier

app = Flask(__name__)
CORS(app)

# Pre-load model on startup
print("🛡️  AI Firewall Detection Service Starting...")
get_classifier()
print("🛡️  Detection Service Ready!")


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "service": "AI Firewall Detection Service",
        "status": "running",
        "model": "DistilBERT (zero-shot classification)"
    })


@app.route("/detect", methods=["POST"])
def detect():
    data = request.get_json()

    if not data or "prompt" not in data:
        return jsonify({"error": "Prompt is required"}), 400

    prompt = data["prompt"]

    if not prompt.strip():
        return jsonify({"error": "Prompt cannot be empty"}), 400

    # Classify the prompt
    result = classify_prompt(prompt)

    # Calculate risk score based on label and confidence
    risk_score = 0.0
    if result["label"] == "JAILBREAK":
        risk_score = 0.5 + (result["confidence"] * 0.5)   # Range: 0.75 - 1.0
    elif result["label"] == "PROMPT_INJECTION":
        risk_score = 0.4 + (result["confidence"] * 0.5)   # Range: 0.67 - 0.9
    elif result["label"] == "SAFE":
        risk_score = max(0.0, (1 - result["confidence"]) * 0.25)  # Range: 0.0 - 0.15

    result["riskScore"] = round(risk_score, 4)

    print(f"📊 Prompt: '{prompt[:60]}' → {result['label']} (conf: {result['confidence']:.2f}, risk: {result['riskScore']:.2f})")

    return jsonify(result)


@app.route("/batch-detect", methods=["POST"])
def batch_detect():
    data = request.get_json()

    if not data or "prompts" not in data:
        return jsonify({"error": "Prompts array is required"}), 400

    results = []
    for prompt in data["prompts"]:
        result = classify_prompt(prompt)
        risk_score = 0.0
        if result["label"] == "JAILBREAK":
            risk_score = 0.5 + (result["confidence"] * 0.5)
        elif result["label"] == "PROMPT_INJECTION":
            risk_score = 0.4 + (result["confidence"] * 0.5)
        elif result["label"] == "SAFE":
            risk_score = max(0.0, (1 - result["confidence"]) * 0.25)
        result["riskScore"] = round(risk_score, 4)
        result["prompt"] = prompt
        results.append(result)

    return jsonify(results)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=False)