import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
  },
  storeName: {
    type: String,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },

  businessEmail: {
    type: String,
  },

  productImage: {
    type: String,
  },
  productDescription: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPriceUSD: {
    type: Number,
    required: true,
    min: 0,
  },
  subtotalUSD: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    items: [orderItemSchema],
    totalAmountUSD: {
      type: Number,
      required: true,
      min: 0,
    },
    payment: {
      type: {
        type: String,
        enum: ["crypto", "card"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "processing", "paid", "failed", "refunded"],
        default: "pending",
      },
      amountUSD: {
        type: Number,
        // required: true,
        min: 0,
      },
      cryptoAmount: {
        type: Number,
        required: function () {
          return this.type === "crypto";
        }, // Required if crypto
      },
      cryptoCurrency: {
        type: String,
        enum: ["BTC", "ETH", "USDT", "SOL", null],
        required: function () {
          return this.type === "crypto";
        },
      },
      transactionHash: String,
      statusHistory: [
        {
          status: {
            type: String,
            required: true,
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
          notes: String,
        },
      ],
    },

    delivery: {
      name: String,
      email: String,
      address: String,
      city: String,
      state: String,
      zip: String,
      phone: String,
      estimatedDeliveryDate: Date,
      trackingId: String,
    },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
