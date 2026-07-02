import tensorflow as tf
import numpy as np

model_path = "backend/cnn_kardiomegali_final_3kelas_new.h5"
model = tf.keras.models.load_model(model_path)

img_array = np.zeros((1, 128, 128, 1))
last_conv_layer_name = "conv2d_last"

try:
    print("Calling model.predict first...")
    model.predict(img_array)
    
    print("Constructing grad_model...")
    grad_model = tf.keras.models.Model(
        inputs=[model.input],
        outputs=[model.get_layer(last_conv_layer_name).output, model.output]
    )
    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        pred_index = tf.argmax(preds[0])
        print("pred_index:", pred_index)
        class_channel = preds[:, pred_index]

    grads = tape.gradient(class_channel, last_conv_layer_output)
    print("grads shape:", grads.shape if grads is not None else None)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    print("pooled_grads shape:", pooled_grads.shape if pooled_grads is not None else None)
    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / (tf.reduce_max(heatmap) + 1e-10)
    print("heatmap shape:", heatmap.shape)
    
except Exception as e:
    import traceback
    print("Error occurred:")
    traceback.print_exc()
