# Dashboard Statistik Deskriptif - Latihan 1

## 1. Instalasi
Pastikan Python sudah terpasang. Buka terminal/CMD pada folder project ini, lalu jalankan:

```bash
pip install -r requirements.txt
```

## 2. Jalankan Flask
```bash
python app.py
```

Kemudian buka:
http://127.0.0.1:5000

## 3. Isi dashboard
- KPI jumlah data, rata-rata nilai, kehadiran, dan kepuasan
- Tabel statistik deskriptif: mean, median, standar deviasi, minimum, maksimum
- Grafik distribusi Exam Score
- Grafik rata-rata variabel
- Komposisi gender
- Analisis dan keputusan yang dapat diambil
- Preview data

## 4. Keputusan utama dari data
1. Kelompok nilai rendah perlu pendampingan karena masih ada mahasiswa dengan skor < 60.
2. Kehadiran perlu dipantau agar mahasiswa dengan attendance rendah tidak tertinggal.
3. Jadwal belajar perlu dijaga konsisten dan diseimbangkan dengan waktu tidur.
4. Screen time perlu dievaluasi karena pada data ini hubungannya dengan nilai ujian sangat negatif.
5. Kepuasan perlu ditindaklanjuti dengan survei faktor penyebab agar keputusan perbaikan lebih tepat.
6. Data pengeluaran dapat dipakai untuk membuat program literasi atau batas anggaran mahasiswa.

Catatan: korelasi pada dataset latihan menunjukkan pola yang sangat kuat. Korelasi tidak otomatis membuktikan sebab-akibat.
