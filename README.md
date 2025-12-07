# 🔧 Service On Call

Website layanan servis elektronik profesional dengan fitur GPS location tracking.

## 🌟 Fitur Utama

- ✅ Servis AC, Pompa Air, Mesin Cuci, Kulkas, dan Elektronik Lainnya
- 📍 GPS Location Tracking dengan Koordinat Presisi Tinggi
- 📱 Integrasi WhatsApp untuk Pemesanan
- 🎨 Responsive Design (Mobile & Desktop)
- ⚡ Fast Loading dengan Next.js 15
- 🎯 Modern UI dengan Tailwind CSS & shadcn/ui

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### Build untuk Production

```bash
# Build aplikasi
npm run build

# Run production server
npm start
```

## 📦 Tech Stack

- **Framework**: Next.js 15.3.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Prisma (SQLite)
- **Icons**: Lucide React

## 🌐 Deploy

### Deploy ke Vercel (Recommended)

1. Push code ke GitHub
2. Buka [vercel.com](https://vercel.com)
3. Import repository ini
4. Klik Deploy
5. Selesai! Website Anda online dalam 2-3 menit

### Deploy Manual

Jalankan script:
```bash
# Windows
deploy-to-github.bat

# Linux/Mac
chmod +x deploy-to-github.sh
./deploy-to-github.sh
```

## 📱 Fitur GPS Location

Website ini menggunakan Geolocation API untuk mendapatkan lokasi pengguna dengan akurasi tinggi:

- Koordinat presisi 8 desimal (±1.1mm akurasi)
- Integrasi Google Maps
- Reverse geocoding untuk alamat lengkap
- Format alamat Indonesia (Jalan, Kelurahan, Kecamatan, Kota, Provinsi)

## 📞 Kontak

WhatsApp: 0859-2332-0768

## 📄 License

© 2024 Service On Call. All rights reserved.

## 🛠️ Development

Untuk development lebih lanjut, lihat dokumentasi:
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Prisma](https://www.prisma.io/docs)

---

Made with ❤️ by Service On Call Team
