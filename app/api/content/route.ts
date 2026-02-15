import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const CONTENT_PATH = path.join(process.cwd(), 'data', 'content.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function GET() {
    try {
        const data = await fs.readFile(CONTENT_PATH, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const action = formData.get('action');

        if (action === 'saveContent') {
            const content = formData.get('content') as string;
            await fs.writeFile(CONTENT_PATH, content, 'utf-8');
            return NextResponse.json({ message: 'Content saved successfully' });
        }

        if (action === 'uploadImage' || action === 'uploadFile') {
            const file = formData.get('file') as File;
            if (!file) {
                return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const filePath = path.join(UPLOADS_DIR, fileName);

            await fs.writeFile(filePath, buffer);
            return NextResponse.json({ url: `/uploads/${fileName}` });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('CMS API Error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
