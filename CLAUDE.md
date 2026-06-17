Ringkasan Routing API
Semua routing utama di bawah ini di-prefix oleh /api di file 

main.py
. Ada juga route static file /static untuk menampilkan gambar/aset yang diupload.

1. User & Authentication Route (/api/user)
Mengatur registrasi, login, dan profil pengguna.

POST /api/user/register
Deskripsi: Registrasi pengguna baru.
Content-Type: application/json
Request Body:
json
{
  "username": "petani_hebat",    // string (min: 3, max: 50, Required)
  "email": "petani@gmail.com",   // string (Format email, Required)
  "password": "password123",     // string (min: 6, Required)
  "role": "petani"               // string/enum: "petani" atau "admin" (Optional, default: "petani")
}
Response: Data user terdaftar.
POST /api/user/login
Deskripsi: Login untuk mendapatkan JWT token.
Content-Type: application/json
Request Body:
json
{
  "email": "petani@gmail.com",   // string (Required)
  "password": "password123"      // string (Required)
}
Response (200 OK):
json
{
  "access_token": "eyJhbGciOi...", 
  "token_type": "bearer"
}
GET /api/user/me
Deskripsi: Mendapatkan profil user yang sedang login.
Headers: Authorization: Bearer <access_token>
Response (200 OK):
json
{
  "id": "uuid-string-user-id",
  "email": "petani@gmail.com",
  "username": "petani_hebat",
  "password": "hashed_password",
  "role": "petani",
  "created_at": "2026-06-17T03:40:27Z"
}
GET /api/user/all
Deskripsi: Mengambil daftar semua user (Tanpa proteksi admin di level route, namun memanggil UserService).
Query Parameters:
skip (number, default: 0)
limit (number, default: 100)
Response (200 OK): Array of UserResponse.
2. Admin Route (/api/admin)
Hanya dapat diakses oleh user dengan role "admin".

GET /api/admin/getuser
Deskripsi: Mengambil semua user (khusus Admin).
Headers: Authorization: Bearer <access_token>
Query Parameters:
skip (number, default: 0, minimum: 0)
limit (number, default: 100, minimum: 1)
Response (200 OK): Array of UserResponse (seperti struktur di /api/user/me).
PATCH /api/admin/promote/{user_id}
Deskripsi: Mengubah role user lain menjadi admin.
Headers: Authorization: Bearer <access_token>
Path Parameters:
user_id (string, Required)
Response (200 OK):
json
{
  "status": "success",
  "message": "User role updated to admin"
}
3. Article Route (/api/article)
Mengelola artikel/berita edukasi seputar pinang.

POST /api/article/
Deskripsi: Membuat artikel baru (Bisa disertai upload gambar).
Headers: Authorization: Bearer <access_token>
Content-Type: multipart/form-data
Request Body (Form Data):
judul (string, min: 5, max: 100, Required)
isi (string, min: 20, Required)
file (File/Binary, Gambar artikel, Optional)
Response (201 Created):
json
{
  "id": "uuid-article",
  "user_id": "uuid-creator",
  "username": "admin_hebat",
  "judul": "Cara Budidaya Pinang Unggul",
  "isi": "Isi lengkap artikel minimal 20 karakter...",
  "gambar": "uploads/articles/nama_gambar.jpg", // path gambar
  "tanggal": "2026-06-17T03:40:27Z",
  "updated_at": "2026-06-17T03:40:27Z"
}
GET /api/article/
Deskripsi: Mendapatkan daftar semua artikel.
Query Parameters:
skip (number, default: 0)
limit (number, default: 100, max: 100)
Response (200 OK): Array of ArticleResponse.
GET /api/article/{article_id}
Deskripsi: Mendapatkan detail satu artikel.
Path Parameters:
article_id (string, Required)
Response (200 OK): Objek ArticleResponse.
PUT /api/article/{article_id}
Deskripsi: Memperbarui artikel yang sudah dibuat.
Headers: Authorization: Bearer <access_token>
Content-Type: application/json
Path Parameters:
article_id (string, Required)
Request Body:
json
{
  "judul": "Judul Baru",      // string (Optional)
  "isi": "Konten baru...",     // string (Optional)
  "gambar": "url/path/baru"    // string (Optional)
}
Response (200 OK): Objek ArticleResponse yang diperbarui.
DELETE /api/article/{article_id}
Deskripsi: Menghapus artikel.
Headers: Authorization: Bearer <access_token>
Path Parameters:
article_id (string, Required)
Response (200 OK): Pesan status penghapusan.
4. Pinang Route (/api/pinang)
Mencatat klasifikasi kualitas pinang hasil dari scan AI.

POST /api/pinang
Deskripsi: Endpoint scan utama. Menerima data klasifikasi dari scanner AI, melakukan otomatis lookup harga berdasarkan grade, dan mencatatnya ke database history.
Headers: Authorization: Bearer <access_token>
Content-Type: multipart/form-data
Request Body (Form Data):
jenis_pinang (string, Required)
kualitas_pinang (string, Required, format: A / B / C)
tingkat_kekeringan (string, Required)
deskripsi (string, Optional)
persentase (string, Optional)
lokasi (string, Optional)
perangkat (string, Optional)
catatan (string, Optional)
file (File/Binary, Foto pinang yang discan, Optional)
Response (201 Created - Gabungan data pinang, harga, dan history):
json
{
  "pinang_id": "uuid-pinang",
  "grade": "A",
  "jenis_pinang": "Pinang Bulat",
  "tingkat_kekeringan": "Kering 100%",
  "deskripsi": "Kondisi sangat bagus",
  "persentase": "95%",
  "gambar": "uploads/pinang/foto_pinang.jpg",
  "harga_per_kg": "12000",             // Hasil lookup otomatis ke master Harga
  "keterangan_harga": "Harga normal daerah Sumatera",
  "harga_tidak_ditemukan": false,
  "history_id": "uuid-history",       // Otomatis terbuat di tabel History
  "created_at": "2026-06-17T03:40:27Z"
}
GET /api/pinang
Deskripsi: Mendapatkan riwayat data pinang milik user yang login saja.
Headers: Authorization: Bearer <access_token>
Query Parameters:
skip (number, default: 0)
limit (number, default: 100)
Response (200 OK): Array of PinangResponse:
json
[
  {
    "id": "uuid-pinang",
    "user_id": "uuid-user",
    "gambar": "uploads/pinang/foto.jpg",
    "jenis_pinang": "Pinang Bulat",
    "kualitas_pinang": "A",
    "tingkat_kekeringan": "90%",
    "deskripsi": "Bagus",
    "persentase": "92%",
    "created_at": "2026-06-17T03:40:27Z"
  }
]
GET /api/pinang/{pinang_id}
Deskripsi: Mendapatkan detail satu data pinang.
Headers: Authorization: Bearer <access_token>
Path Parameters:
pinang_id (string, Required)
Response (200 OK): Objek PinangResponse.
5. Harga Route (/api/harga)
Mengatur data master acuan harga untuk masing-masing grade pinang.

GET /api/harga/
Deskripsi: Melihat semua daftar harga acuan grade pinang. Dapat diakses oleh siapa saja (Tanpa Auth).
Query Parameters:
skip (number, default: 0)
limit (number, default: 100)
Response (200 OK):
json
[
  {
    "id": "uuid-harga",
    "grade": "A",
    "harga": "12000",
    "keterangan": "Harga grade premium"
  }
]
GET /api/harga/{grade}
Deskripsi: Lookup harga berdasarkan grade tertentu (A/B/C).
Path Parameters:
grade (string, Required, misal: a atau A)
Response (200 OK): Detail harga sesuai grade tersebut.
POST /api/harga/
Deskripsi: Menambah master data harga baru (Khusus Admin).
Headers: Authorization: Bearer <access_token>
Content-Type: application/json
Request Body:
json
{
  "grade": "A",               // string (Required, harus unik)
  "harga": "12000",           // string (Required)
  "keterangan": "Deskripsi"   // string (Optional)
}
Response (201 Created): Objek HargaResponse.
PUT /api/harga/{harga_id}
Deskripsi: Memperbarui harga (Khusus Admin). Grade tidak bisa diganti, hanya harga dan keterangan.
Headers: Authorization: Bearer <access_token>
Content-Type: application/json
Path Parameters:
harga_id (string, Required)
Request Body:
json
{
  "harga": "13500",           // string (Optional)
  "keterangan": "Update harga" // string (Optional)
}
Response (200 OK): Objek HargaResponse terupdate.
DELETE /api/harga/{harga_id}
Deskripsi: Menghapus data acuan harga (Khusus Admin).
Headers: Authorization: Bearer <access_token>
Path Parameters:
harga_id (string, Required)
Response (200 OK): Status penghapusan.
6. History Route (/api/history)
Mencatat riwayat aktivitas scan lengkap beserta lokasinya secara kronologis.

GET /api/history/
Deskripsi: Riwayat seluruh scan milik user yang sedang login (Terbaru duluan).
Headers: Authorization: Bearer <access_token>
Query Parameters:
skip (number, default: 0)
limit (number, default: 100)
Response (200 OK):
json
[
  {
    "id": "uuid-history",
    "user_id": "uuid-user",
    "pinang_id": "uuid-pinang",
    "grade": "A",
    "harga_per_kg": "12000",
    "keterangan_harga": "Normal",
    "lokasi": "Padang, Indonesia",
    "perangkat": "Samsung S21",
    "catatan": "Kualitas bagus sekali",
    "created_at": "2026-06-17T03:40:27Z"
  }
]
GET /api/history/{history_id}
Deskripsi: Detail satu log riwayat scan (Hanya milik user bersangkutan).
Headers: Authorization: Bearer <access_token>
Path Parameters:
history_id (string, Required)
Response (200 OK): Objek HistoryResponse.
Tips Integrasi di React Vite (Axios / Fetch)
Authorization Header: Untuk route yang membutuhkan token, pasang header berikut:
javascript
headers: {
  Authorization: `Bearer ${localStorage.getItem('token')}`
}
Multipart/Form-Data: Saat mengirim foto/file pada endpoint POST /api/pinang dan POST /api/article, jangan lupa gunakan instance FormData:
javascript
const formData = new FormData();
formData.append('jenis_pinang', 'Pinang Bulat');
formData.append('file', fileInput.files[0]); // upload file
// kirim dengan header 'Content-Type': 'multipart/form-data'