import gradio as gr
import torch
import torch.nn as nn
import torch.nn.functional as F
import timm
import cv2
import numpy as np
from PIL import Image
from torchvision import transforms

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMG_SIZE_LOADER = 518
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

label_mapping = {
    "Banten": 0,
    "Maluku": 1,
    "Nusa Tenggara (sasak)": 2,
    "Papua": 3,
    "Toraja": 4,
    "balinese": 5,
    "batak": 6,
    "dayak": 7,
    "javanese": 8,
    "minangkabau": 9
}

NUM_CLASSES = len(label_mapping)

class CLAHETransform:
    def __init__(self, clip_limit=2.0, tile_grid_size=(8, 8)):
        self.clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)
        
    def __call__(self, img):
        img_np = np.array(img)
        img_lab = cv2.cvtColor(img_np, cv2.COLOR_RGB2Lab)
        l, a, b = cv2.split(img_lab)
        l_clahe = self.clahe.apply(l)
        img_lab_clahe = cv2.merge((l_clahe, a, b))
        img_rgb_clahe = cv2.cvtColor(img_lab_clahe, cv2.COLOR_Lab2RGB)
        return Image.fromarray(img_rgb_clahe)

final_test_transform = transforms.Compose([
    CLAHETransform(),
    transforms.Resize((IMG_SIZE_LOADER, IMG_SIZE_LOADER)),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
])

class SingleDINOv2Model(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.backbone = timm.create_model(
            "vit_base_patch14_dinov2", 
            pretrained=False, 
            num_classes=num_classes, 
            img_size=IMG_SIZE_LOADER
        )
    def forward(self, x):
        return self.backbone(x)

print("Memuat Model DINOv2...")
model_dino = SingleDINOv2Model(num_classes=NUM_CLASSES).to(DEVICE)

DINO_MODEL_PATH = "best_dinov2_standalone.pth"

model_dino.load_state_dict(torch.load(DINO_MODEL_PATH, map_location=DEVICE))
model_dino.eval()

def predict_building(image):
    if image is None:
        return None

    image_tensor = final_test_transform(image.convert('RGB')).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        logits = model_dino(image_tensor)
        probs = F.softmax(logits, dim=1)[0]

    result = {label_mapping[i]: prob.item() for i, prob in enumerate(probs)}
    return result

interface = gr.Interface(
    fn=predict_building,
    inputs=gr.Image(type="pil", label="Upload Foto Bangunan"),
    outputs=gr.Label(num_top_classes=3, label="Hasil Prediksi"),
    title="AksaNusa: Prediksi Bangunan Tradisional",
    description="Upload gambar bangunan tradisional untuk diprediksi oleh AI kami (berbasis DINOv2 Transformer)."
)

if __name__ == "__main__":
    interface.launch()