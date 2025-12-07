import { db } from '@/lib/db'

const services = [
  {
    title: 'Servis AC',
    description: 'Perbaikan AC split, AC window, AC central',
    icon: '❄️',
    features: JSON.stringify(['Cuci AC', 'Isi Freon', 'Perbaikan Komponen'])
  },
  {
    title: 'Pompa Air',
    description: 'Service pompa air sumur, pompa booster',
    icon: '💧',
    features: JSON.stringify(['Instalasi Baru', 'Perbaikan', 'Maintenance'])
  },
  {
    title: 'Kipas Angin',
    description: 'Service kipas angin stand, wall, exhaust',
    icon: '🌀',
    features: JSON.stringify(['Ganti Bearing', 'Service Motor', 'Perbaikan'])
  },
  {
    title: 'Mesin Cuci',
    description: 'Service mesin cuci top load, front load',
    icon: '🌊',
    features: JSON.stringify(['Ganti Sparepart', 'Perbaikan', 'Instalasi'])
  },
  {
    title: 'Elektronik Lain',
    description: 'Kulkas, TV, microwave, dispenser',
    icon: '📺',
    features: JSON.stringify(['Diagnosa', 'Perbaikan', 'Sparepart'])
  },
  {
    title: 'Instalasi Listrik',
    description: 'Pemasangan dan perbaikan instalasi listrik',
    icon: '⚡',
    features: JSON.stringify(['Instalasi Baru', 'Perbaikan', 'Maintenance'])
  }
]

async function seedServices() {
  try {
    console.log('Seeding services...')
    
    for (const service of services) {
      const existingService = await db.service.findFirst({
        where: { title: service.title }
      })
      
      if (!existingService) {
        await db.service.create({
          data: service
        })
        console.log(`Created service: ${service.title}`)
      } else {
        console.log(`Service already exists: ${service.title}`)
      }
    }
    
    console.log('Services seeded successfully!')
  } catch (error) {
    console.error('Error seeding services:', error)
  } finally {
    await db.$disconnect()
  }
}

seedServices()