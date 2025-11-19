"use server";

import { getNewsDetailAPI } from '@/app/lib/api/config/news';
import { NewsDetailDto } from '@/app/lib/types';
import { error } from 'console';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const fileName = url.searchParams.get('filename'); 

  if (!id) {
    return new NextResponse(JSON.stringify({ error: 'Missing id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res: NewsDetailDto = await getNewsDetailAPI(Number(id));
    const base64 = res.newsAttachment.find(item => item.filename === fileName)?.base64 ?? '';

    if (!base64) {
        throw error
    }

    const pdfBuffer = Buffer.from(base64, 'base64');

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}`,
      },
    });
  } catch (err) {
    console.error('Error downloading file:', err);
    return new Response(JSON.stringify({ error: 'Failed to download file' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}