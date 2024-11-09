import { NextResponse } from 'next/server';
// import Document from '@/models/document';
import document from '@/models/document';
import dbConnect from '@/lib/connectdb';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

export async function POST(req) {
  try {
    await dbConnect();
    // console.log("Connected to the database");

    const formData = await req.formData();
    // console.log("Received form data", formData);

    const file = formData.get('file');
    // console.log("Received file:", file);

    if (!file) {
      // console.log("File not received");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // console.log("Buffer created");

    const filename = `${Date.now()}-${file.name}`;
    // console.log("Filename:", filename);

    const conn = mongoose.connection;
    const bucket = new GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });

    const uploadStream = bucket.openUploadStream(filename);
    const fileId = uploadStream.id;

    await new Promise((resolve, reject) => {
      uploadStream.end(buffer, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    const documentData = {
      name: formData.get('name'),
      category: formData.get('category'),
      date: formData.get('date'),
      type: formData.get('type'),
      status: formData.get('status'),
      fileUrl: `/api/files/${fileId}`,
    };

    const doc = new document(documentData);
    await doc.save();

    return NextResponse.json(doc, { status: 200 });
  } catch (error) {
    console.error('Error', error);
    return NextResponse.json({ error: "Failed to save document" }, { status: 500 });
  }
}

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };