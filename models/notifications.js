import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true,
        },
        type: {
            type: String,
            enum: ['in-app', 'email', 'push'],
            //    required: true,
        },
        read: {
            type: Boolean,
            default: false, 
        },

        status: {
            type: String, 
            enum: ["success", "error", "warning"]  
        },
      
        data: {
            type: Object,
            default: null,
        },
        createdAt: {
            type: Date,
            default: Date.now, 
        },
    },
    { timestamps: true }
);

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;