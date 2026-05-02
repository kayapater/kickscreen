# KickScreen 📺

**KickScreen**, birden fazla Kick.com yayınını aynı anda, tek bir ekranda izlemeni sağlayan modern, hızlı ve açık kaynaklı bir çoklu yayın izleyicisidir. 

Aynı anda 2, 4 hatta 9 yayını birden, hiç kasmadan ve chatler arasında hızlıca geçiş yaparak izleyebilirsin.

![License](https://img.shields.io/github/license/kayapater/kickscreen?style=flat-square)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020?style=flat-square&logo=cloudflare)

## ✨ Özellikler

- **Sınırsız Yayın:** Ekranın yettiği kadar yayını aynı anda aç.
- **Otomatik Grid:** Yayın sayısına göre ekranı kendi ayarlar (1x1, 2x2, 3x3 vb.).
- **Hızlı Chat:** Sağdaki panelden tüm yayınların chatine tek tıkla ulaş.
- **Moderatör Dostu:** Sağ tıkla yayıncıların mod panellerini anında yan sekmede aç.
- **Paylaşılabilir Kurulum:** Eklediğin yayıncılar URL'ye kaydedilir, linki kopyalayıp başkasına atman yeterli.
- **Kolay Ekleme:** Kullanıcı adı veya link yapıştır, kanalın bilgilerini ve canlı yayın durumunu anında gör.

## 🛠️ Neler Kullandım?

Bu projeyi geliştirirken şu araçlardan ve servislerden faydalandım:

- **Frontend:** React 19, TypeScript, Vite ve Tailwind CSS v4.
- **Embed Servisleri:** Yayın ve chat altyapısı için [kick.cx](https://kick.cx) servislerini kullandım.
- **API:** Kanal bilgilerini (avatar, canlılık durumu vb.) çekmek için Kick'in kendi API'sini kullanıyorum.
- **Backend:** API isteklerini proxylemek için Cloudflare Pages Functions (Serverless) kullanıyorum.
- **Deployment:** Kodları GitHub'a attığımda GitHub Actions üzerinden otomatik olarak Cloudflare'e deploy ediliyor.

## 🚀 Yerel Kurulum

Kendi bilgisayarında çalıştırmak istersen:

1. Depoyu klonla:
   ```bash
   git clone https://github.com/kayapater/kickscreen.git
   cd kickscreen
   ```

2. Bağımlılıkları yükle:
   ```bash
   npm install
   ```

3. Çalıştır:
   ```bash
   npm run dev
   ```

## ⚖️ Yasal Uyarı

KickScreen benim tarafımdan geliştirilmiş bağımsız bir projedir ve Kick.com ile resmi bir bağı yoktur. Kick.com markası ve tüm hakları kendi sahiplerine aittir.

## 📄 Lisans

Bu proje [MIT](LICENSE) lisansı ile lisanslanmıştır. Geliştiren: [@kayapater](https://x.com/kayapater)
