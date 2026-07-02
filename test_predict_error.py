import os
import cv2
import numpy as np
import tensorflow as tf

model_path = "backend/cnn_kardiomegali_final_3kelas_new.h5"
model = tf.keras.models.load_model(model_path)

temp_img_path = "src/assets/hero.png"

def make_gradcam_heatmap(img_array, model, last_conv_layer_name="conv2d_last"):
    img_tensor = tf.convert_to_tensor(img_array, dtype=tf.float32)
    with tf.GradientTape() as tape:
        x = img_tensor
        last_conv_layer_output = None
        for layer in model.layers:
            x = layer(x)
            if layer.name == last_conv_layer_name:
                last_conv_layer_output = x
                tape.watch(last_conv_layer_output)
        
        preds = x
        pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]

    grads = tape.gradient(class_channel, last_conv_layer_output)
    if grads is None:
        raise ValueError("Gradients are None. Tape failed to track.")
        
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / (tf.reduce_max(heatmap) + 1e-10)
    return heatmap.numpy()

try:
    img_raw = cv2.imread(temp_img_path, cv2.IMREAD_GRAYSCALE)
    img_resized = cv2.resize(img_raw, (128, 128), interpolation=cv2.INTER_AREA)
    img_array = np.expand_dims(np.expand_dims(img_resized, axis=-1), axis=0)

    predictions = model.predict(img_array)[0]
    pred_class = int(np.argmax(predictions))
    prediction_prob = float(predictions[pred_class])
    print("prediction_prob:", prediction_prob)
    print("pred_class:", pred_class)

    heatmap = make_gradcam_heatmap(img_array, model, last_conv_layer_name="conv2d_last")
    print("heatmap shape:", heatmap.shape)
    
except Exception as e:
    import traceback
    traceback.print_exc()
