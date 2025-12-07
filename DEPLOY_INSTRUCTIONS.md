# 🚀 Panduan Deploy Service On Call

## Langkah 1: Install Git (Jika Belum Ada)

Download dan install Git dari: https://git-scm.com/download/win

Setelah install, restart terminal/command prompt Anda.

## Langkah 2: Setup Git Repository

Buka terminal di folder project ini, lalu jalankan:

```bash
# Initialize git repository
git init

# Add remote repository
git remote add origin https://github.com/riski2005saputra-stack/SERVICEONCALL.git

# Add all files
git add .

# Commit files
git commit -m "Initial commit - Service On Call website"

# Push to GitHub
git branch -M main
git push -u origin main
```

## Langkah 3: Deploy ke Vercel (GRATIS & MUDAH)

### A. Melalui Website Vercel:

1. Buka https://vercel.com
2. Sign in dengan akun GitHub Anda
3. Klik "Add New" → "Project"
4. Import repository: `riski2005saputra-stack/SERVICEONCALL`
5. Vercel akan otomatis detect Next.js
6. Klik "Deploy"
7. Tunggu 2-3 menit, website Anda akan online!

### B. Melalui Vercel CLI (Alternatif):

```bash
# Install Vercel CLI
npm install -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel --prod
```

## Langkah 4: Custom Domain (Opsional)

Setelah deploy, Anda akan mendapat URL seperti:
- `https://serviceoncall.vercel.app`

Untuk custom domain:
1. Buka dashboard Vercel
2. Pilih project Anda
3. Settings → Domains
4. Tambahkan domain Anda

## 🌐 Link Website Setelah Deploy

Setelah deploy berhasil, website Anda akan tersedia di:
- **Vercel**: https://serviceoncall.vercel.app (atau nama yang Anda pilih)
- **GitHub Pages** (alternatif): https://riski2005saputra-stack.github.io/SERVICEONCALL

## ⚠️ Catatan Penting

1. **File yang TIDAK perlu di-upload:**
   - `node_modules/` (sudah ada di .gitignore)
   - `.next/` (akan di-build otomatis)
   - `.env.local` (jika ada)

2. **Environment Variables:**
   Jika ada API keys atau secrets, tambahkan di Vercel Dashboard:
   - Settings → Environment Variables

3. **Database:**
   Jika menggunakan database, pastikan setup database production di Vercel

## 🔄 Update Website di Masa Depan

Setelah setup awal, untuk update website:

```bash
git add .
git commit -m "Update: deskripsi perubahan"
git push
```

Vercel akan otomatis deploy perubahan Anda!

## 📞 Troubleshooting

**Problem: Git command not found**
- Install Git dari https://git-scm.com/download/win
- Restart terminal

**Problem: Permission denied (GitHub)**
- Setup SSH key atau gunakan Personal Access Token
- Panduan: https://docs.github.com/en/authentication

**Problem: Build failed di Vercel**
- Cek build logs di Vercel dashboard
- Pastikan semua dependencies ada di package.json

## 🎉 Selamat!

Website Service On Call Anda sekarang online dan bisa diakses dari mana saja!
