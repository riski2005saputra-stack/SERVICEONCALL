import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const services = await db.service.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: services.map(service => ({
        ...service,
        features: JSON.parse(service.features)
      }))
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, icon, features } = body

    if (!title || !description || !icon || !features) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const service = await db.service.create({
      data: {
        title,
        description,
        icon,
        features: JSON.stringify(features)
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...service,
        features: JSON.parse(service.features)
      }
    })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    )
  }
}