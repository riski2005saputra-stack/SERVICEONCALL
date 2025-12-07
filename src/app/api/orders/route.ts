import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const orders = await db.serviceOrder.findMany({
      where: status ? { status } : undefined,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: orders
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      phone, 
      email, 
      serviceType, 
      address, 
      description, 
      preferredDate, 
      preferredTime, 
      isUrgent 
    } = body

    if (!name || !phone || !serviceType || !address) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, phone, serviceType, address' },
        { status: 400 }
      )
    }

    const order = await db.serviceOrder.create({
      data: {
        name,
        phone,
        email: email || null,
        serviceType,
        address,
        description: description || null,
        preferredDate: preferredDate || null,
        preferredTime: preferredTime || null,
        isUrgent: isUrgent || false
      }
    })

    return NextResponse.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}