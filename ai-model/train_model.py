import tensorflow as tf
from tensorflow.keras import layers, models
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 12
print("Loading dataset...")
train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
)

val_ds = tf.keras.preprocessing.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
)

# ================= CLASS NAMES SAVE =================
class_names = train_ds.class_names
print("Classes:", class_names)

with open(os.path.join(BASE_DIR, "class_names.txt"), "w") as f:
    for name in class_names:
        f.write(name + "\n")

# ================= PERFORMANCE BOOST =================
AUTOTUNE = tf.data.AUTOTUNE

train_ds = (
    train_ds
    .cache()
    .shuffle(1000)
    .prefetch(buffer_size=AUTOTUNE)
    .apply(tf.data.experimental.ignore_errors())  # 🔥 prevents crash
)

val_ds = (
    val_ds
    .cache()
    .prefetch(buffer_size=AUTOTUNE)
    .apply(tf.data.experimental.ignore_errors())
)

# ================= MODEL =================
print("Building model...")

model = models.Sequential([
    layers.Input(shape=(224, 224, 3)),
    layers.Rescaling(1./255),

    layers.Conv2D(32, 3, activation="relu"),
    layers.MaxPooling2D(),

    layers.Conv2D(64, 3, activation="relu"),
    layers.MaxPooling2D(),

    layers.Conv2D(128, 3, activation="relu"),
    layers.MaxPooling2D(),

    layers.Conv2D(256, 3, activation="relu"),
    layers.MaxPooling2D(),

    layers.Flatten(),
    layers.Dense(256, activation="relu"),
    layers.Dropout(0.5),

    # ✅ correct for multi-class
    layers.Dense(len(class_names), activation="softmax"),
])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

model.summary()

# ================= TRAIN =================
print("Training started...")

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS
)

# ================= SAVE =================
print("Saving model...")
os.makedirs(os.path.join(BASE_DIR, "model"), exist_ok=True)

model.save(os.path.join(BASE_DIR, "model", "civic_issue_classifier.h5"))

print("TRAINING COMPLETE ✅")