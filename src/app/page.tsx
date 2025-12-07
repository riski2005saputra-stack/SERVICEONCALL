'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Phone, 
  MessageCircle, 
  Home as HomeIcon, 
  Wrench, 
  Clock, 
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  X,
  Calendar,
  MapPin,
  User,
  Mail,
  Locate,
  Loader2
} from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

const services = [
  {
    id: 1,
    title: 'Servis AC',
    description: 'Perbaikan AC split, AC window, AC central',
    icon: '❄️',
    features: ['Cuci AC', 'Isi Freon', 'Perbaikan Komponen']
  },
  {
    id: 2,
    title: 'Pompa Air',
    description: 'Service pompa air sumur, pompa booster',
    icon: '💧',
    features: ['Instalasi Baru', 'Perbaikan', 'Maintenance']
  },
  {
    id: 3,
    title: 'Kipas Angin',
    description: 'Service kipas angin stand, wall, exhaust',
    icon: '🌀',
    features: ['Ganti Bearing', 'Service Motor', 'Perbaikan']
  },
  {
    id: 4,
    title: 'Mesin Cuci',
    description: 'Service mesin cuci top load, front load',
    icon: '🌊',
    features: ['Ganti Sparepart', 'Perbaikan', 'Instalasi']
  },
  {
    id: 5,
    title: 'Elektronik Lain',
    description: 'Kulkas, TV, microwave, dispenser',
    icon: '📺',
    features: ['Diagnosa', 'Perbaikan', 'Sparepart']
  },
  {
    id: 6,
    title: 'Instalasi Listrik',
    description: 'Pemasangan dan perbaikan instalasi listrik',
    icon: '⚡',
    features: ['Instalasi Baru', 'Perbaikan', 'Maintenance']
  }
]

const benefits = [
  {
    icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: 'Cepat & Tepat',
    description: 'Respons cepat dalam 30 menit'
  },
  {
    icon: <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: 'Bergaransi',
    description: 'Garansi 7 hari untuk semua jasa'
  },
  {
    icon: <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: 'Teknisi Profesional',
    description: 'Tim ahli berpengalaman'
  },
  {
    icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: 'Harga Terjangkau',
    description: 'Tarif transparan dan kompetitif'
  }
]

export default function Home() {
  // Force recompile
  const [activeNav, setActiveNav] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [loadingLocation, setLoadingLocation] = useState(false)
  const isMobile = useIsMobile()
  
  const autoplayPlugin = Autoplay({
    delay: 4000,
    stopOnInteraction: true,
  })

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: '',
    service: '',
    address: '',
    locationLink: '',
    locationCoords: { lat: 0, lng: 0 },
    description: '',
    urgent: false,
    preferredDate: '',
    preferredTime: ''
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung oleh browser Anda')
      return
    }

    // Clear lokasi sebelumnya untuk memastikan data fresh
    handleInputChange('locationLink', '')
    handleInputChange('locationCoords', { lat: 0, lng: 0 })
    setLoadingLocation(true)
    
    // Gunakan getCurrentPosition dengan akurasi maksimal
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const locationTime = new Date(position.timestamp)
        
        // Simpan koordinat GPS
        handleInputChange('locationCoords', { lat: latitude, lng: longitude })
        
        try {
          // Menggunakan Nominatim OpenStreetMap dengan zoom level tinggi untuk detail maksimal
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=id`,
            {
              headers: {
                'User-Agent': 'ServisKu-App/1.0'
              }
            }
          )
          const data = await response.json()
          
          if (data && data.address) {
            const addr = data.address
            
            // Format alamat lengkap untuk Indonesia dengan detail maksimal
            const addressComponents: string[] = []
            
            // Nomor rumah dan jalan
            if (addr.house_number) addressComponents.push(`No. ${addr.house_number}`)
            if (addr.road || addr.street) addressComponents.push(addr.road || addr.street)
            
            // RT/RW (jika tersedia dari data)
            if (addr.hamlet) addressComponents.push(addr.hamlet)
            
            // Kelurahan/Desa
            if (addr.village || addr.suburb || addr.neighbourhood) {
              const kelurahan = addr.village || addr.suburb || addr.neighbourhood
              addressComponents.push(`Kel. ${kelurahan}`)
            }
            
            // Kecamatan
            if (addr.city_district || addr.district) {
              const kecamatan = addr.city_district || addr.district
              addressComponents.push(`Kec. ${kecamatan}`)
            }
            
            // Kota/Kabupaten
            if (addr.city || addr.town || addr.county) {
              const kota = addr.city || addr.town || addr.county
              addressComponents.push(kota)
            }
            
            // Provinsi
            if (addr.state) {
              addressComponents.push(addr.state)
            }
            
            // Kode Pos
            if (addr.postcode) {
              addressComponents.push(addr.postcode)
            }
            
            const fullAddress = addressComponents.filter(Boolean).join(', ')
            
            // Buat link Google Maps dengan koordinat GPS yang akurat
            const googleMapsLink = `https://www.google.com/maps?q=${latitude.toFixed(8)},${longitude.toFixed(8)}`
            
            // Format waktu lokasi diambil
            const timeString = locationTime.toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })
            const dateString = locationTime.toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
            
            // Simpan link lokasi
            handleInputChange('locationLink', googleMapsLink)
            
            // Tambahkan info lengkap dengan timestamp dan koordinat presisi tinggi
            const addressWithInfo = accuracy < 50 
              ? `${fullAddress}\n\n📍 Lokasi GPS\n📌 Koordinat: ${latitude.toFixed(8)}, ${longitude.toFixed(8)}\n🎯 Akurasi: ±${Math.round(accuracy)}m\n⏰ Diperbarui: ${dateString} ${timeString}\n🗺️ ${googleMapsLink}`
              : `${fullAddress}\n\n📍 Lokasi GPS\n📌 Koordinat: ${latitude.toFixed(8)}, ${longitude.toFixed(8)}\n⏰ Diperbarui: ${dateString} ${timeString}\n🗺️ ${googleMapsLink}`
            
            handleInputChange('address', addressWithInfo || data.display_name)
          } else {
            // Fallback ke display name atau koordinat
            const googleMapsLink = `https://www.google.com/maps?q=${latitude.toFixed(8)},${longitude.toFixed(8)}`
            const timeString = locationTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            const dateString = locationTime.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
            
            handleInputChange('locationLink', googleMapsLink)
            handleInputChange('address', `${data.display_name || `📍 Lokasi GPS\nKoordinat: ${latitude.toFixed(8)}, ${longitude.toFixed(8)}`}\n\n🎯 Akurasi: ±${Math.round(accuracy)}m\n⏰ Diperbarui: ${dateString} ${timeString}\n🗺️ ${googleMapsLink}`)
          }
          
          setLoadingLocation(false)
        } catch (error) {
          console.error('Error getting address:', error)
          // Fallback dengan koordinat yang akurat dan Google Maps link
          const googleMapsLink = `https://www.google.com/maps?q=${latitude.toFixed(8)},${longitude.toFixed(8)}`
          const timeString = locationTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          const dateString = locationTime.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
          
          handleInputChange('locationLink', googleMapsLink)
          handleInputChange('address', `📍 Lokasi GPS\nKoordinat: ${latitude.toFixed(8)}, ${longitude.toFixed(8)}\n🎯 Akurasi: ±${Math.round(accuracy)}m\n⏰ Diperbarui: ${dateString} ${timeString}\n🗺️ ${googleMapsLink}\n\n(Silakan lengkapi alamat secara manual)`)
          
          setLoadingLocation(false)
        }
      },
      (error) => {
        setLoadingLocation(false)
        let errorMessage = 'Tidak dapat mengakses lokasi'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '❌ Izin lokasi ditolak\n\nSilakan:\n1. Aktifkan GPS di ponsel Anda\n2. Izinkan akses lokasi untuk browser ini\n3. Refresh halaman dan coba lagi'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '❌ Lokasi tidak tersedia\n\nPastikan GPS aktif dan Anda berada di area dengan sinyal GPS yang baik'
            break
          case error.TIMEOUT:
            errorMessage = '⏱️ Waktu pencarian lokasi habis\n\nCoba lagi atau pastikan GPS aktif'
            break
        }
        
        alert(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      }
    )
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Buat pesan dengan link lokasi Google Maps jika tersedia
    let messageText = `Halo, saya ingin memesan layanan servis:\n\n` +
      `👤 Nama: ${formData.name}\n` +
      `📱 Telepon: ${formData.phone}\n` +
      `🏠 Kategori: ${formData.category}\n` +
      `🔧 Layanan: ${formData.service}\n\n` +
      `📍 Alamat: ${formData.address}\n`
    
    // Tambahkan link lokasi GPS jika ada
    if (formData.locationLink && formData.locationCoords.lat !== 0) {
      messageText += `\n🗺️ *Lokasi GPS:*\n${formData.locationLink}\n` +
        `📌 *Koordinat:* ${formData.locationCoords.lat.toFixed(8)}, ${formData.locationCoords.lng.toFixed(8)}\n`
    }
    
    messageText += `\n📝 Deskripsi: ${formData.description || '-'}\n` +
      `📅 Tanggal: ${formData.preferredDate || 'Belum ditentukan'}\n` +
      `⏰ Waktu: ${formData.preferredTime || 'Belum ditentukan'}\n` +
      `🚨 Darurat: ${formData.urgent ? 'Ya' : 'Tidak'}`
    
    const message = encodeURIComponent(messageText)
    
    window.open(`https://wa.me/6285923320768?text=${message}`, '_blank')
    setOrderDialogOpen(false)
    
    // Reset form
    setFormData({
      name: '',
      phone: '',
      category: '',
      service: '',
      address: '',
      locationLink: '',
      locationCoords: { lat: 0, lng: 0 },
      description: '',
      urgent: false,
      preferredDate: '',
      preferredTime: ''
    })
  }

  const openOrderDialog = (serviceName: string = '') => {
    setSelectedService(serviceName)
    setFormData(prev => ({ ...prev, service: serviceName }))
    setOrderDialogOpen(true)
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Halo, saya ingin memesan layanan servis elektronik')
    window.open(`https://wa.me/6285923320768?text=${message}`, '_blank')
  }

  const handlePhoneClick = () => {
    window.open('tel:6285923320768')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-base sm:text-lg">Service On Call</span>
            </div>
            
            {!isMobile && (
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#home" className="text-foreground hover:text-primary transition-colors text-sm sm:text-base">Beranda</a>
                <a href="#services" className="text-foreground hover:text-primary transition-colors text-sm sm:text-base">Layanan</a>
                <a href="#contact" className="text-foreground hover:text-primary transition-colors text-sm sm:text-base">Kontak</a>
              </nav>
            )}

            <div className="flex items-center space-x-1 sm:space-x-2">
              {!isMobile && (
                <>
                  <Button 
                    size="sm" 
                    className="hidden sm:flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                    onClick={handleWhatsAppClick}
                  >
                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="hidden sm:flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                    onClick={handlePhoneClick}
                  >
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Call</span>
                  </Button>
                </>
              )}
              
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="h-9 w-9 p-0"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="border-t bg-white animate-in slide-in-from-top-2">
            <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3">
              <a 
                href="#home" 
                className="block py-2 text-foreground hover:text-primary text-sm sm:text-base transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Beranda
              </a>
              <a 
                href="#services" 
                className="block py-2 text-foreground hover:text-primary text-sm sm:text-base transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Layanan
              </a>
              <a 
                href="#contact" 
                className="block py-2 text-foreground hover:text-primary text-sm sm:text-base transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kontak
              </a>
              <div className="pt-2 sm:pt-3 space-y-2">
                <Button 
                  size="sm" 
                  className="w-full items-center space-x-2 text-xs sm:text-sm h-9 sm:h-10"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full items-center space-x-2 text-xs sm:text-sm h-9 sm:h-10"
                  onClick={handlePhoneClick}
                >
                  <Phone className="w-4 h-4" />
                  <span>Telepon</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section with Carousel */}
      <section id="home" className="relative px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-6">
        <Carousel 
          className="w-full overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl"
          plugins={[autoplayPlugin]}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            <CarouselItem>
              <div className="relative h-[240px] sm:h-[320px] md:h-[420px] lg:h-[500px] bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="absolute inset-0">
                  <img 
                    src="/slider1.jpg" 
                    alt="Servis AC" 
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="relative container mx-auto px-4 sm:px-6 h-full flex items-center">
                  <div className="text-white max-w-[280px] sm:max-w-md md:max-w-lg">
                    <Badge className="mb-2 sm:mb-3 bg-white/20 text-white border-white/30 text-[10px] sm:text-xs px-2 py-0.5">
                      ❄️ Servis AC Profesional
                    </Badge>
                    <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-bold mb-1.5 sm:mb-3 leading-tight">
                      Servis AC Berkualitas
                    </h1>
                    <p className="text-xs sm:text-base md:text-lg mb-3 sm:mb-5 text-white/90 leading-snug sm:leading-relaxed">
                      Perbaikan AC split, window, dan central dengan teknisi berpengalaman
                    </p>
                    <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-3">
                      <Button 
                        size="sm" 
                        className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto h-9 md:h-11 text-xs sm:text-sm md:text-base font-medium"
                        onClick={() => openOrderDialog('Servis AC')}
                      >
                        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                        Pesan Sekarang
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto h-9 md:h-11 text-xs sm:text-sm md:text-base font-medium"
                        onClick={handlePhoneClick}
                      >
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                        Hubungi Kami
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
            
            <CarouselItem>
              <div className="relative h-[240px] sm:h-[320px] md:h-[420px] lg:h-[500px] bg-gradient-to-r from-cyan-600 to-cyan-800">
                <div className="absolute inset-0">
                  <img 
                    src="/slider2.jpg" 
                    alt="Servis Pompa Air" 
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="relative container mx-auto px-4 sm:px-6 h-full flex items-center">
                  <div className="text-white max-w-[280px] sm:max-w-md md:max-w-lg">
                    <Badge className="mb-2 sm:mb-3 bg-white/20 text-white border-white/30 text-[10px] sm:text-xs px-2 py-0.5">
                      💧 Servis Pompa Air
                    </Badge>
                    <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-bold mb-1.5 sm:mb-3 leading-tight">
                      Solusi Pompa Air Anda
                    </h1>
                    <p className="text-xs sm:text-base md:text-lg mb-3 sm:mb-5 text-white/90 leading-snug sm:leading-relaxed">
                      Instalasi dan perbaikan pompa air sumur, booster, dan submersible
                    </p>
                    <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-3">
                      <Button 
                        size="sm" 
                        className="bg-white text-cyan-600 hover:bg-gray-100 w-full sm:w-auto h-9 md:h-11 text-xs sm:text-sm md:text-base font-medium"
                        onClick={() => openOrderDialog('Servis Pompa Air')}
                      >
                        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                        Pesan Sekarang
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-white text-white hover:bg-white hover:text-cyan-600 w-full sm:w-auto h-9 md:h-11 text-xs sm:text-sm md:text-base font-medium"
                        onClick={handlePhoneClick}
                      >
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                        Hubungi Kami
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
            
            <CarouselItem>
              <div className="relative h-[240px] sm:h-[320px] md:h-[420px] lg:h-[500px] bg-gradient-to-r from-green-600 to-green-800">
                <div className="absolute inset-0">
                  <img 
                    src="/slider3.jpg" 
                    alt="Servis Elektronik" 
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="relative container mx-auto px-4 sm:px-6 h-full flex items-center">
                  <div className="text-white max-w-[280px] sm:max-w-md md:max-w-lg">
                    <Badge className="mb-2 sm:mb-3 bg-white/20 text-white border-white/30 text-[10px] sm:text-xs px-2 py-0.5">
                      🌊 Elektronik Lengkap
                    </Badge>
                    <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-bold mb-1.5 sm:mb-3 leading-tight">
                      Servis Semua Elektronik
                    </h1>
                    <p className="text-xs sm:text-base md:text-lg mb-3 sm:mb-5 text-white/90 leading-snug sm:leading-relaxed">
                      Mesin cuci, kulkas, TV, microwave dan semua elektronik rumah tangga
                    </p>
                    <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-3">
                      <Button 
                        size="sm" 
                        className="bg-white text-green-600 hover:bg-gray-100 w-full sm:w-auto h-9 md:h-11 text-xs sm:text-sm md:text-base font-medium"
                        onClick={() => openOrderDialog('Servis Elektronik Lengkap')}
                      >
                        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                        Pesan Sekarang
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-white text-white hover:bg-white hover:text-green-600 w-full sm:w-auto h-9 md:h-11 text-xs sm:text-sm md:text-base font-medium"
                        onClick={handlePhoneClick}
                      >
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                        Hubungi Kami
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </section>

      {/* Benefits Section */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Mengapa Memilih Service On Call?</h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Kami memberikan layanan terbaik dengan teknisi profesional dan harga terjangkau
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-4 sm:p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-primary">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">{benefit.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Layanan Kami</h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Perbaikan semua jenis elektronik rumah tangga dengan teknisi berpengalaman
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service) => (
              <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{service.icon}</div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">{service.description}</p>
                  
                  <div className="space-y-1 sm:space-y-2 mb-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-xs sm:text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 sm:mr-2 flex-shrink-0" />
                        <span className="leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full group-hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-10"
                    onClick={() => openOrderDialog(service.title)}
                  >
                    Pesan Layanan
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
            Butuh Bantuan? Hubungi Kami Sekarang!
          </h2>
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-4">
            Tim kami siap membantu Anda 24/7 untuk semua kebutuhan servis elektronik
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              size="sm" 
              variant="secondary"
              className="text-primary hover:bg-gray-100 text-xs sm:text-sm sm:text-base w-full sm:w-auto h-9 sm:h-10 md:h-12"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              WhatsApp
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-xs sm:text-sm sm:text-base w-full sm:w-auto h-9 sm:h-10 md:h-12"
              onClick={handlePhoneClick}
            >
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Telepon: 0859-2332-0768
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom Navigation for Mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
          <div className="grid grid-cols-4 h-16">
            <button
              onClick={() => setActiveNav('home')}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                activeNav === 'home' ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="text-xs">Beranda</span>
            </button>
            
            <button
              onClick={() => {
                setActiveNav('services')
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                activeNav === 'services' ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <Wrench className="w-5 h-5" />
              <span className="text-xs">Layanan</span>
            </button>
            
            <button
              onClick={handleWhatsAppClick}
              className="flex flex-col items-center justify-center space-y-1 text-green-600"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">WhatsApp</span>
            </button>
            
            <button
              onClick={handlePhoneClick}
              className="flex flex-col items-center justify-center space-y-1 text-blue-600"
            >
              <Phone className="w-5 h-5" />
              <span className="text-xs">Call</span>
            </button>
          </div>
        </div>
      )}

      {/* Spacer for bottom navigation on mobile */}
      {isMobile && <div className="h-16" />}

      {/* Order Dialog */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto w-[92vw] sm:w-full mx-auto bg-white p-4 sm:p-6">
          <DialogHeader className="mb-3 sm:mb-4">
            <DialogTitle className="text-base sm:text-lg md:text-xl font-bold">Form Pemesanan Layanan</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitOrder} className="space-y-3 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Nama Lengkap *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Nomor Telepon *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="08xx-xxxx-xxxx"
                  required
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="flex items-center gap-1 text-[11px] sm:text-sm font-medium">
                  <HomeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">Kategori *</span>
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} required>
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rumah" className="text-xs sm:text-sm">🏠 Rumah</SelectItem>
                    <SelectItem value="Kantor" className="text-xs sm:text-sm">🏢 Kantor</SelectItem>
                    <SelectItem value="Tempat Ibadah" className="text-xs sm:text-sm">🕌 Tempat Ibadah</SelectItem>
                    <SelectItem value="Rumah Sakit" className="text-xs sm:text-sm">🏥 Rumah Sakit</SelectItem>
                    <SelectItem value="Sekolah" className="text-xs sm:text-sm">🏫 Sekolah</SelectItem>
                    <SelectItem value="Toko" className="text-xs sm:text-sm">🛍️ Toko</SelectItem>
                    <SelectItem value="Kos" className="text-xs sm:text-sm">🏬 Kos</SelectItem>
                    <SelectItem value="Pabrik" className="text-xs sm:text-sm">🏭 Pabrik</SelectItem>
                    <SelectItem value="Lainnya" className="text-xs sm:text-sm">📌 Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="service" className="flex items-center gap-1 text-[11px] sm:text-sm font-medium">
                  <Wrench className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">Layanan *</span>
                </Label>
                <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue placeholder="Pilih layanan" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.title} className="text-xs sm:text-sm">
                        {service.icon} {service.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="address" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Alamat Lengkap *
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGetLocation}
                  disabled={loadingLocation}
                  className="h-7 px-2 text-[10px] sm:text-xs text-primary hover:text-primary"
                >
                  {loadingLocation ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Memperbarui...
                    </>
                  ) : formData.locationLink ? (
                    <>
                      <Locate className="w-3 h-3 mr-1 text-green-600" />
                      Perbarui Lokasi
                    </>
                  ) : (
                    <>
                      <Locate className="w-3 h-3 mr-1" />
                      Gunakan Lokasi Saya
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Masukkan alamat lengkap atau gunakan tombol lokasi di atas"
                rows={2}
                required
                className="text-xs sm:text-sm resize-none min-h-[60px]"
              />
              {formData.locationLink && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-[10px] sm:text-xs text-green-600 bg-green-50 px-2 py-1.5 rounded border border-green-200">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="font-medium">✓ Lokasi GPS Tersimpan</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleGetLocation}
                      className="h-5 px-1.5 text-[9px] sm:text-[10px] text-green-700 hover:text-green-800 hover:bg-green-100"
                    >
                      🔄 Perbarui
                    </Button>
                  </div>
                  {formData.locationCoords.lat !== 0 && (
                    <div className="text-[9px] sm:text-[10px] text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                      <span className="font-mono">
                        📍 {formData.locationCoords.lat.toFixed(8)}, {formData.locationCoords.lng.toFixed(8)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs sm:text-sm font-medium">Deskripsi Kerusakan</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Jelaskan kerusakan atau masalah yang terjadi pada perangkat elektronik Anda"
                rows={3}
                className="text-xs sm:text-sm resize-none min-h-[70px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="preferredDate" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Tanggal Diinginkan
                </Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="preferredTime" className="text-xs sm:text-sm font-medium">Waktu Diinginkan</Label>
                <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue placeholder="Pilih waktu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00-10:00" className="text-xs sm:text-sm">08:00 - 10:00</SelectItem>
                    <SelectItem value="10:00-12:00" className="text-xs sm:text-sm">10:00 - 12:00</SelectItem>
                    <SelectItem value="13:00-15:00" className="text-xs sm:text-sm">13:00 - 15:00</SelectItem>
                    <SelectItem value="15:00-17:00" className="text-xs sm:text-sm">15:00 - 17:00</SelectItem>
                    <SelectItem value="17:00-19:00" className="text-xs sm:text-sm">17:00 - 19:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="urgent"
                checked={formData.urgent}
                onCheckedChange={(checked) => handleInputChange('urgent', checked)}
                className="mt-0.5 h-4 w-4"
              />
              <Label htmlFor="urgent" className="text-[11px] sm:text-xs leading-tight cursor-pointer">
                Saya membutuhkan layanan darurat (biaya tambahan mungkin berlaku)
              </Label>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-3">
              <Button type="submit" className="flex-1 h-10 sm:h-11 text-xs sm:text-sm font-medium shadow-sm">
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                Kirim via WhatsApp
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOrderDialogOpen(false)}
                className="flex-1 h-10 sm:h-11 text-xs sm:text-sm font-medium"
              >
                Batal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}