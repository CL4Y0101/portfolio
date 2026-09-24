type ProjectCopy = {
  subtitle: string;
  description: string;
  role: string;
  primaryContribution: string;
  problem: string;
  solution: string;
  responsibilities: string[];
  highlights: string[];
  challenges: Array<{ title: string; description: string }>;
  screenshotCaptions: string[];
  linkLabels: string[];
};

export const projectCopyId: Record<string, ProjectCopy> = {
  kandu: {
    subtitle: "Platform multi-kampus untuk mahasiswa internasional di Korea Selatan.",
    description: "Pengembangan web produksi yang mencakup pengalaman kampus yang dapat digunakan ulang, informasi berbasis Firebase, otomasi data, dan deployment Linux.",
    role: "Pengembang Web — Frontend & Backend",
    primaryContribution: "Membangun dan memelihara pengalaman kampus yang dapat digunakan ulang, integrasi backend, alur data otomatis, dan lingkungan deployment produksi.",
    problem: "Mahasiswa internasional membutuhkan informasi kampus yang mudah digunakan dan konsisten, sementara setiap universitas memiliki data serta kebutuhan berbeda.",
    solution: "KandU menggunakan pola multi-kampus yang dapat digunakan ulang sehingga fitur bersama dapat melayani berbagai universitas tanpa situs terpisah untuk masing-masing kampus.",
    responsibilities: [
      "Mengembangkan antarmuka web dan fungsi backend dengan Next.js serta React.",
      "Berkontribusi pada pola routing dan situs yang dapat digunakan ulang di berbagai kampus.",
      "Mengintegrasikan menu, pengumuman, peta, jadwal, dan informasi mahasiswa berbasis Firebase.",
      "Menggunakan data kampus yang dihasilkan oleh crawler Python dan pipeline otomasi.",
      "Memelihara lingkungan produksi dan beta pada infrastruktur Linux.",
      "Mendukung alur rilis berbasis GitHub dan debugging produksi.",
    ],
    highlights: [
      "Arsitektur yang dapat digunakan ulang mendukung berbagai universitas dan konteks kampus.",
      "Data Firebase dan pipeline pengumpulan otomatis menyediakan informasi kampus terkini.",
      "Lingkungan beta terpisah mendukung pengujian sebelum rilis produksi.",
      "Pekerjaan deployment meliputi Nginx, proses Node.js, PM2, dan Oracle Cloud.",
    ],
    challenges: [
      { title: "Konsistensi multi-kampus", description: "Menjaga perilaku produk bersama tetap dapat digunakan ulang sambil mengakomodasi informasi dan route tiap kampus." },
      { title: "Integrasi data", description: "Menghubungkan data aplikasi berbasis Firebase dengan hasil pipeline pengumpulan kampus berbasis Python." },
      { title: "Rilis yang aman", description: "Memelihara lingkungan beta dan produksi terpisah melalui alur pengiriman berbasis GitHub serta debugging operasional." },
    ],
    screenshotCaptions: ["Pengalaman pencarian kampus di produksi", "Lingkungan beta terpisah untuk pengembangan dan pengujian"],
    linkLabels: ["Lihat Produksi", "Lihat Beta"],
  },
  greenpoint: {
    subtitle: "Operasional bank sampah, saldo, transaksi, dan laporan dalam satu produk.",
    description: "Sistem full-stack yang dibangun bersama tim untuk mengelola nasabah, kategori sampah, setoran, saldo, penarikan, dan laporan administrasi.",
    role: "Pengembangan full-stack dalam tim",
    primaryContribution: "Berkontribusi pada alur nasabah dan admin, integrasi API, data relasional, pelaporan, serta klien Flutter.",
    problem: "Tim bank sampah perlu mencatat persetujuan nasabah, nilai material, transaksi setoran, saldo, penarikan, dan laporan tanpa catatan manual yang terpisah-pisah.",
    solution: "GreenPoint menyatukan alur nasabah dan administrasi dalam satu produk digital, dengan tahapan web dan mobile yang berkembang seiring proyek.",
    responsibilities: [
      "Mengerjakan alur pendaftaran pengguna dan persetujuan akun.",
      "Mengimplementasikan pengelolaan jenis sampah dan transaksi setoran.",
      "Mengerjakan saldo, alur penarikan, dan kontrol administrasi.",
      "Mendukung laporan keuangan dan operasional, termasuk keluaran Excel/PDF.",
      "Berkontribusi pada aplikasi web, integrasi API, lapisan basis data, dan klien Flutter.",
    ],
    highlights: [
      "Alur pendaftaran nasabah dan persetujuan admin.",
      "Pengelolaan kategori sampah, setoran, saldo, dan penarikan.",
      "Pelaporan keuangan dan operasional dengan keluaran Excel/PDF.",
      "Satu produk yang berkembang melalui beberapa tahap basis data dan deployment.",
    ],
    challenges: [
      { title: "Evolusi produk", description: "Arsitektur basis data berkembang dari MySQL ke tahap PostgreSQL/Supabase mengikuti kebutuhan produk dan deployment." },
      { title: "Integritas alur", description: "Persetujuan nasabah, setoran, saldo, dan penarikan memerlukan perubahan status yang jelas pada tampilan pengguna serta admin." },
      { title: "Pelaporan operasional", description: "Data administrasi perlu diolah menjadi laporan nasabah, transaksi, sampah, dan keuangan yang berguna." },
    ],
    screenshotCaptions: ["Tampilan publik produk GreenPoint", "Tahap teknis sebelumnya dari produk GreenPoint yang sama"],
    linkLabels: ["Demo Langsung", "Lihat Repositori"],
  },
  "time-capsule": {
    subtitle: "Ruang 3D interaktif untuk menyimpan dan mengunjungi kembali kenangan bersama.",
    description: "Pengalaman Next.js multibahasa yang menggabungkan dunia Three.js, linimasa, galeri foto, pesan publik, audio, pengaturan tema, dan percakapan karakter berbantuan AI.",
    role: "Pengembang Web",
    primaryContribution: "Membangun pengalaman Next.js multibahasa, dunia 3D interaktif, alur antarmuka pendukung, dan persiapan deployment.",
    problem: "Galeri biasa tidak sepenuhnya menghadirkan rasa menjelajahi momen, orang, dan pesan bersama.",
    solution: "Proyek ini mengubah kenangan menjadi dunia 3D interaktif; objek membuka linimasa, galeri, dan papan pesan, sementara karakter memberi titik masuk percakapan.",
    responsibilities: [
      "Membangun pengalaman dengan Next.js, React, TypeScript, dan Zustand.",
      "Mengimplementasikan dunia React Three Fiber dengan penanda dan karakter interaktif.",
      "Membuat varian antarmuka bahasa Indonesia, Inggris, dan Korea.",
      "Menambahkan linimasa, galeri, pesan publik, audio, tema terang/gelap, dan alur penutup.",
      "Mengintegrasikan route obrolan berbantuan AI dan menyiapkan aplikasi Next.js untuk Cloudflare melalui OpenNext.",
    ],
    highlights: [
      "Lingkungan 3D interaktif, bukan grid konten biasa.",
      "Antarmuka tiga bahasa: Indonesia, Inggris, dan Korea.",
      "Pengalaman linimasa, galeri foto, dan pesan publik.",
      "Percakapan berbantuan AI dengan karakter dan pendamping kapsul.",
    ],
    challenges: [
      { title: "Interaksi 3D di React", description: "Menyelaraskan gerakan kamera, objek interaktif, overlay, dan state UI tanpa menghilangkan rasa eksplorasi." },
      { title: "Media dan gerak", description: "Menggabungkan WebGL, transisi GSAP, efek suara, dan musik latar sambil menjaga kontrol pengguna tetap jelas." },
      { title: "Deployment edge", description: "Menyiapkan aplikasi Next.js dengan API route untuk model deployment Cloudflare melalui OpenNext." },
    ],
    screenshotCaptions: ["Dunia kenangan 3D dengan karakter dan penanda interaktif"],
    linkLabels: ["Kunjungi Situs", "Lihat Repositori"],
  },
  "ytmusic-esp32": {
    subtitle: "Metadata media browser dikirim ke layar ESP32 lokal.",
    description: "Prototipe ekstensi Chrome yang sedang dikerjakan untuk membaca metadata YouTube Music dan mengirim judul, artis, progres, durasi, serta status jeda sebagai JSON ke ESP32 di jaringan lokal.",
    role: "Pengembang · Eksperimen",
    primaryContribution: "Membuat prototipe alur data dari status pemutaran YouTube Music di browser ke endpoint HTTP ESP32 lokal.",
    problem: "Informasi media yang diputar di browser tidak langsung tersedia pada layar perangkat keras kecil di luar browser.",
    solution: "Ekstensi Manifest V3 membaca status pemutar YouTube Music lalu mengirim payload ringkas lagu yang sedang diputar ke endpoint HTTP ESP32 pada jaringan yang sama.",
    responsibilities: [
      "Membuat struktur ekstensi Chrome Manifest V3.",
      "Membaca judul, artis, durasi, posisi pemutaran, dan status jeda dari YouTube Music.",
      "Meneruskan data browser melalui background service worker ke endpoint HTTP lokal.",
      "Menandai eksperimen ini secara jelas, terpisah dari pekerjaan produksi yang selesai.",
    ],
    highlights: [
      "Alur data lagu yang sedang diputar dari browser ke perangkat.",
      "Payload HTTP/JSON ringkas untuk perangkat embedded lokal.",
      "Pembaruan status pemutaran berkala untuk layar yang mendekati real-time.",
    ],
    challenges: [
      { title: "Integrasi browser", description: "Struktur halaman YouTube Music dapat berubah, sehingga content script memeriksa beberapa selector dan elemen media." },
      { title: "Pengiriman ke perangkat lokal", description: "Background worker menghubungkan halaman browser aman ke endpoint HTTP perangkat pada jaringan lokal." },
      { title: "Pekerjaan masih berlangsung", description: "Repositori publik saat ini menunjukkan prototipe sisi browser; firmware perangkat dan alur paket lengkap belum dinyatakan selesai." },
    ],
    screenshotCaptions: ["Alur data lagu dari browser ke perangkat"],
    linkLabels: ["Lihat Repositori"],
  },
};
