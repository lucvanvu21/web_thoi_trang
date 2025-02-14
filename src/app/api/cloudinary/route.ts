import cloudinaryV2 from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image } = body;
    const data = await cloudinaryV2.uploader.upload(image); 
    return NextResponse.json(data);
  } catch (error) {
    console.log('---->error:', error);
    return NextResponse.error();
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;
    if (id) {
     const data =  await cloudinaryV2.uploader.destroy(id as string);
     return NextResponse.json(data);
    }
  } catch (error) {
    console.log('---->error:', error);
    return NextResponse.error();
  }
}
