import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json()

  if (!productIds || productIds.length === 0) {
    return new NextResponse('Product ids are required', { status: 400 })
  }

  try {
    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    })

    console.log(order)

    return NextResponse.json(order, {
      headers: corsHeaders,
    })
  } catch (error) {
    console.log('[CHECKOUT_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
