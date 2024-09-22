import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional
  }, 
  { timestamps: true, collection: "documents" });


export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);