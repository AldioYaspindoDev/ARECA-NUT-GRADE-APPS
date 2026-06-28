# ArecaNut Mobile - User Manual

## Kata Pengantar
Puji dan syukur dipanjatkan kepada Allah SWT atas segala rahmat-Nya sehingga buku panduan pengguna / manual book ini dapat diselesaikan. Buku panduan ini merupakan bagian dari pelaksanaan penggunaan Aplikasi ArecaNut Mobile.

ArecaNut Mobile adalah aplikasi yang digunakan untuk membantu dalam proses pemindaian, analisis, dan penentuan kualitas (grade) biji pinang secara otomatis menggunakan teknologi pengolahan citra (image processing) dan kecerdasan buatan, mulai dari proses pengambilan gambar (kamera/upload), analisis tingkat kekeringan dan persentase kualitas, hingga menampilkan estimasi harga acuan yang dibuat untuk memfasilitasi para petani, pengepul, dan pelaku industri pinang.

Aplikasi ArecaNut Mobile ini masih dapat dikembangkan lagi sesuai kebutuhan yang nantinya dapat diimplementasikan lebih luas di ekosistem agribisnis.

Buku Manual Aplikasi ArecaNut Mobile ini mempunyai peranan penting bagi pengguna, terutama sebagai acuan dalam operasional sistem. Secara umum buku panduan ini terbagi atas proses Login/Register User, Pemindaian Biji Pinang, Riwayat Scan, dan Pantauan Harga Acuan, yang berisikan penjelasan dan panduan untuk memudahkan pengguna sistem aplikasi.

Akhir kata, semoga buku panduan ini dapat digunakan sebagaimana mestinya.

---

## 1. Penjelasan Aplikasi Apa
**ArecaNut Mobile** adalah aplikasi mobile cerdas yang dirancang khusus untuk memindai, menganalisis, dan menentukan kualitas (*grade*) dari biji pinang secara otomatis. Dengan memanfaatkan teknologi pengolahan citra dan kecerdasan buatan di sisi server, aplikasi ini membantu pengguna untuk mendapatkan estimasi *grade*, tingkat kekeringan, persentase kualitas, dan harga acuan yang akurat hanya dengan mengunggah atau memfoto biji pinang. Selain fungsi utamanya, aplikasi ini juga menyediakan fitur riwayat pemindaian, artikel edukasi terkait budidaya pinang, dan pantauan harga pasar terkini.

## 2. Penjelasan Aplikasi Dibangun Dengan Apa Saja
Aplikasi mobile ini dibangun menggunakan ekosistem pengembangan modern untuk memastikan performa yang optimal, antarmuka yang responsif, dan skalabilitas tinggi:

| Komponen | Teknologi | Keterangan |
|---|---|---|
| **Framework & Runtime** | **React Native & Expo** | Memungkinkan pembuatan aplikasi lintas platform (Android & iOS) dengan basis kode tunggal (TypeScript/JavaScript). |
| **Bahasa Pemrograman** | **TypeScript** | Memberikan pengetikan statis (*static typing*) sehingga meminimalkan *bug* dan membuat kode lebih mudah dipelihara. |
| **Navigasi** | **React Navigation** | Menggunakan *Native Stack* dan *Bottom Tabs* untuk transisi antar halaman (*screens*) yang mulus. |
| **Akses Perangkat** | **Expo Image Picker** | Digunakan untuk meminta izin dan mengakses galeri atau kamera perangkat pengguna untuk mengambil gambar pinang. |
| **Penyimpanan Lokal** | **Expo Secure Store / Async Storage** | Digunakan untuk menyimpan kredensial (Token JWT) secara aman di perangkat. |
| **Networking** | **Axios** | Melakukan HTTP *requests* ke backend (API) untuk mengirim data gambar, mengambil artikel, riwayat, harga, dan proses autentikasi. |
| **Desain & UI** | **Shopify Restyle & Reanimated** | Sistem *styling* dengan tema (*theme-based*) dan dukungan animasi 60fps untuk antarmuka yang interaktif. |

## 3. Alur Program Beserta UI nya
Berikut adalah alur penggunaan aplikasi mulai dari pengguna membuka aplikasi hingga mendapatkan hasil analisis:

### 3.1. Autentikasi (Login & Register)
- **Register Page**: Pengguna baru dapat mendaftar dengan memasukkan data diri (nama, email, dan password).
- **Login Page**: Pengguna harus masuk menggunakan email dan password agar dapat menggunakan fitur utama aplikasi.
- Setelah *login* berhasil, token autentikasi akan disimpan dan pengguna langsung diarahkan ke Halaman Utama.

> **DEMO CREDENTIALS (AKSES CEPAT)**  
> Jika Anda atau *tester* ingin mencoba aplikasi yang telah di-hosting tanpa harus membuat akun baru, silakan gunakan kredensial berikut pada halaman Login:
> - **Username / Email**: `diodiodio@gmail.com`
> - **Password**: `dioiwaonen`

### 3.2. Halaman Utama (HomeArecaNut)
Di halaman *Home*, pengguna disajikan antarmuka *dashboard* yang intuitif:
1. **Banner Promosi / Edukasi**: Sebuah *carousel* gambar yang bergeser otomatis/manual di bagian atas.
2. **Menu Utama (Aksi Cepat)**:
   - **Upload**: Membuka galeri perangkat untuk memilih foto biji pinang.
   - **Kamera**: Membuka kamera bawaan untuk memfoto biji pinang secara langsung.
   - **Riwayat**: Jalan pintas untuk melihat seluruh hasil pemindaian sebelumnya.
   - **Harga**: Membuka *popup* (*Modal*) yang menampilkan harga acuan terkini per *grade* pinang (Grade A, B, dst).
3. **Riwayat Terbaru**: Menampilkan *preview* (3 item terakhir) dari pinang yang pernah di-scan oleh pengguna, lengkap dengan tanggal dan estimasi harganya.
4. **Artikel Terkait**: Daftar artikel seputar budidaya atau industri pinang yang bisa dibaca pengguna (*ArticleDetail*).

### 3.3. Proses Pemindaian (Scanning Flow)
1. Pengguna menekan tombol **Kamera** atau **Upload**.
2. Aplikasi meminta izin akses (*Camera/Storage Permission*) jika belum pernah diberikan.
3. Setelah gambar terpilih, muncul layar/indikator *Loading* dengan teks **"Sedang Menganalisis Biji Pinang..."**.
4. Gambar dikirim ke backend. Setelah server merespons, aplikasi otomatis berpindah ke layar **OutputResultScan**.
5. Layar **OutputResultScan** menampilkan:
   - Gambar yang dikirim.
   - **Grade** (Misal: Grade A, B, dsb).
   - **Tingkat Kekeringan** & **Persentase**.
   - **Estimasi Harga per Kg**.
   - Deskripsi analisis.

### 3.4. Navigasi Bawah (Bottom Navigation Bar)
Pengguna dapat berpindah dengan mudah antar menu menggunakan navigasi bawah:
- **Home**: Kembali ke halaman utama.
- **Deteksi (Tengah)**: Tombol pemindai (kamera) cepat.
- **Profile**: Menampilkan detail pengguna dan tombol **Logout** (untuk menghapus sesi/token).

## 4. Target Pasar
Aplikasi ArecaNut Mobile dirancang untuk beberapa segmen pengguna dalam rantai pasok industri pinang:
- **Petani Pinang**: Membantu petani mengetahui secara mandiri kualitas (*grade*) hasil panen mereka serta estimasi harganya sebelum dijual ke pengepul, sehingga menghindari permainan harga sepihak.
- **Pengepul & Tengkulak Kecil**: Mempercepat proses penyortiran dan penentuan harga beli dari petani dengan standar visual AI yang lebih cepat dan objektif.
- **Eksportir & Industri Pengolahan**: Dapat dimanfaatkan sebagai alat *Quality Control* portabel saat mengecek stok pasokan di lapangan.
- **Mahasiswa & Penyuluh Pertanian**: Fitur artikel dan dokumentasi *grade* pinang bisa menjadi media literasi mengenai komoditas ini.

## 5. Kesimpulan
**ArecaNut Mobile** adalah inovasi digital yang menjembatani kesenjangan informasi terkait kualitas dan harga di pasar komoditas pinang. Dengan fondasi teknologi React Native dan Expo, aplikasi ini menawarkan pengalaman (*User Experience*) yang mulus, stabil, dan ramah pengguna lintas platform. Didukung oleh autentikasi yang aman dan fitur inti seperti *AI-driven scanning*, riwayat pencatatan, serta portal edukasi (artikel), **ArecaNut Mobile telah siap (production-ready) untuk diluncurkan** ke publik guna mendigitalisasi dan mengefisienkan proses bisnis para pelaku industri pinang.
