import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import os

# ================= PATH SETUP =================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

CLASS_FILE = os.path.join(BASE_DIR, "class_names.txt")
MODEL_PATH = os.path.join(BASE_DIR, "model", "civic_issue_classifier.h5")

# ================= LOAD CLASS NAMES =================
CLASS_NAMES = []

if os.path.exists(CLASS_FILE):
    with open(CLASS_FILE, "r") as f:
        CLASS_NAMES = [line.strip() for line in f.readlines()]
    print(f"[INFO] Loaded {len(CLASS_NAMES)} classes")
else:
    print("[WARNING] class_names.txt not found")

# ================= LOAD MODEL =================
model = None

if os.path.exists(MODEL_PATH):
    try:
        model = load_model(MODEL_PATH)
        print("[INFO] Model loaded successfully")
    except Exception as e:
        print(f"[ERROR] Model load failed: {e}")
else:
    print("[WARNING] Model file not found")

# ================= PREDICTION FUNCTION =================
def predict_image(image_path: str):
    if model is None:
        print("[ERROR] Model not loaded")
        return "unknown", 0.0

    if not CLASS_NAMES:
        print("[ERROR] Class names missing")
        return "unknown", 0.0

    if not os.path.exists(image_path):
        print(f"[ERROR] Image not found: {image_path}")
        return "unknown", 0.0

    try:
        img = Image.open(image_path).convert("RGB")
        img = img.resize((224, 224))

        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # ✅ Predict
        preds = model.predict(img_array, verbose=0)

        # 🔥 Handle binary vs multiclass safely
        if preds.shape[-1] == 1:
            confidence = float(preds[0][0])
            class_index = 1 if confidence > 0.5 else 0
        else:
            class_index = int(np.argmax(preds))
            confidence = float(np.max(preds))

        # 🔒 Prevent index crash
        if class_index >= len(CLASS_NAMES):
            print("[ERROR] Class index out of range")
            return "unknown", confidence

        predicted_class = CLASS_NAMES[class_index]

        return predicted_class, confidence

    except Exception as e:
        print(f"[ERROR] Prediction failed: {e}")
        return "unknown", 0.0