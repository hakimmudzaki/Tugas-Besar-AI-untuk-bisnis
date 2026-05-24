# Tugas Besar AI untuk Bisnis

Repositori ini berisi aplikasi AksaNusa / NusaRasa, yaitu aplikasi berbasis AI computer vision untuk mengenali makanan tradisional dan rumah adat Indonesia.

## Isi Repo

- `App.js`, `index.js`, `app.json`, `babel.config.js`, `eas.json`, dan `package.json` adalah bagian utama aplikasi mobile berbasis Expo React Native.
- `src/components/` berisi komponen UI yang dipakai ulang, seperti toggle bahasa dan komponen detail makanan.
- `src/context/` berisi state global untuk bahasa.
- `src/screens/` berisi halaman utama aplikasi, seperti landing page, menu utama, pencarian rumah adat, pencarian makanan, dan chatbot.
- `src/services/` berisi logika akses ke model AI dan layanan pendukung seperti Hugging Face dan Gemini.
- `src/data/` berisi data budaya dan makanan dalam bahasa Indonesia dan Inggris.
- `assets/` dan `foto/` berisi aset gambar yang dipakai aplikasi.
- `model bangunan/` berisi notebook, dataset rumah adat, log training, dan folder Hugging Face untuk model bangunan.
- `model makanan/` berisi notebook, dataset makanan, dan folder Hugging Face untuk model makanan.

## Fitur Utama

- Prediksi makanan tradisional dari gambar.
- Prediksi rumah adat dari gambar.
- Informasi detail budaya dalam bahasa Indonesia dan Inggris.
- Chatbot untuk membantu eksplorasi konten aplikasi.

## Cara Menjalankan Aplikasi Mobile

1. Install dependencies Node.js.

2. Jalankan perintah berikut di root proyek:

	```bash
	npm install
	```

3. Setelah selesai, jalankan aplikasi dengan:

	```bash
	npm start
	```

4. Jika ingin membuka di perangkat tertentu, gunakan salah satu perintah berikut:

	```bash
	npm run android
	npm run ios
	npm run web
	```

5. Untuk menjalankan di ponsel, buka Expo Go lalu pindai QR code yang muncul di terminal atau browser.

## Cara Menjalankan Model Hugging Face Lokal

Jika ingin mencoba service model dari folder Hugging Face, jalankan dari masing-masing folder `hugging face setting`:

1. Masuk ke folder model yang diinginkan, misalnya:

	- `model bangunan/hugging face setting/`
	- `model makanan/hugging face setting/`

2. Install dependensi Python:

	```bash
	pip install -r requirements.txt
	```

3. Pastikan file bobot model seperti `best_dinov2_standalone.pth` atau `best_eva_standalone.pth` tersedia di folder tersebut.

4. Jalankan aplikasi Gradio:

	```bash
	python app.py
	```

## Notebook dan Dataset

- Notebook EDA dan training bisa dibuka langsung dari file `.ipynb` di folder `model bangunan/` dan `model makanan/`.
- Dataset tersimpan di subfolder `Dataset/` dan `DATASETTT/` sesuai kelas masing-masing.
