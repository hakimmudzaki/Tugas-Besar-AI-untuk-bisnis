import gradio as gr
import torch
import torch.nn as nn
import torch.nn.functional as F
import ttach as tta
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
    0: "Ayam Bakar", 1: "Ayam Betutu", 2: "Ayam Goreng", 
    3: "Ayam Pop", 4: "Bakso", 5: "Coto Makassar", 
    6: "Gado Gado", 7: "Gudeg", 8: "Nasi Goreng", 
    9: "Pempek", 10: "Rawon", 11: "Rendang", 
    12: "Sate Madura", 13: "Sate Padang", 14: "Soto"
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

class Model224Wrapper(nn.Module):
    def __init__(self, model):
        super().__init__()
        self.model = model
    def forward(self, x_518):
        x_224 = F.interpolate(x_518, size=(224, 224), mode='bilinear', align_corners=False)
        return self.model(x_224)

class SingleDINOv2Model(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.backbone = timm.create_model("vit_base_patch14_dinov2", pretrained=False, num_classes=num_classes, img_size=IMG_SIZE_LOADER)
    def forward(self, x):
        return self.backbone(x)

class SingleEvaModel(nn.Module):
    def __init__(self, num_classes, img_size=224):
        super().__init__()
        self.backbone = timm.create_model("eva02_base_patch14_224", pretrained=False, num_classes=num_classes, img_size=img_size)
    def forward(self, x):
        return self.backbone(x)

final_test_transform = transforms.Compose([
    CLAHETransform(),
    transforms.Resize((IMG_SIZE_LOADER, IMG_SIZE_LOADER)),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
])

print("Memuat Model DINOv2 & EVA...")
model_dino_base = SingleDINOv2Model(num_classes=NUM_CLASSES).to(DEVICE)
model_eva224_base = SingleEvaModel(num_classes=NUM_CLASSES, img_size=224).to(DEVICE)

DINO_MODEL_PATH = "best_dinov2_standalone.pth"
EVA224_MODEL_PATH = "best_eva_standalone.pth"

model_dino_base.load_state_dict(torch.load(DINO_MODEL_PATH, map_location=DEVICE))
model_eva224_base.load_state_dict(torch.load(EVA224_MODEL_PATH, map_location=DEVICE))

tta_transforms = tta.Compose([tta.HorizontalFlip(), tta.Rotate90(angles=[0, 90, 180, 270])])
tta_model_dino = tta.ClassificationTTAWrapper(model_dino_base, tta_transforms).to(DEVICE)
tta_model_eva224 = tta.ClassificationTTAWrapper(Model224Wrapper(model_eva224_base), tta_transforms).to(DEVICE)

tta_model_dino.eval()
tta_model_eva224.eval()

def predict_food(image):
    image_tensor = final_test_transform(image.convert('RGB')).unsqueeze(0).to(DEVICE)
    
    with torch.no_grad():
        logits_dino = tta_model_dino(image_tensor)
        logits_eva224 = tta_model_eva224(image_tensor)
        
        avg_logits = (logits_dino + logits_eva224) / 2.0
        probs = F.softmax(avg_logits, dim=1)[0]
    
    result = {label_mapping[i]: prob.item() for i, prob in enumerate(probs)}
    return result

interface = gr.Interface(
    fn=predict_food,
    inputs=gr.Image(type="pil", label="Upload Foto Makanan"),
    outputs=gr.Label(num_top_classes=3, label="Hasil Prediksi"),
    title="AksaNusa: Prediksi Makanan Tradisional (DINOv2 + EVA)",
    description="Upload gambar makanan tradisional untuk diprediksi oleh ensemble model AI kami."
)

if __name__ == "__main__":
    interface.launch()