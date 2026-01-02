import express from 'express';
import Enquiry from '../models/Enquiry.js';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

/**
 * @swagger
 * /api/enquiries:
 *   get:
 *     summary: Get all enquiries (admin only)
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all enquiries
 *       401:
 *         description: Not authorized
 */
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const enquiries = await Enquiry.find().populate('items.productId').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/enquiries/{id}:
 *   get:
 *     summary: Get single enquiry (admin only)
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enquiry details
 *       404:
 *         description: Enquiry not found
 */
router.get('/:slug', protect, authorize('admin'), async (req, res) => {
  try {
    const enquiry = await Enquiry.findOne({ slug: req.params.slug }).populate('items.productId');
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/enquiries:
 *   post:
 *     summary: Create new enquiry (public)
 *     tags: [Enquiries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerEmail
 *               - customerPhone
 *               - items
 *             properties:
 *               customerName:
 *                 type: string
 *               customerEmail:
 *                 type: string
 *               customerPhone:
 *                 type: string
 *               companyName:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Enquiry created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, companyName, items, message } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    let totalValue = 0;
    const enrichedItems = [];

    for (const item of items) {
      const product = await Product.findOne({ slug: item.productSlug });
      if (product) {
        totalValue += product.price * item.quantity;
        enrichedItems.push({
          productSlug: item.productSlug,
          productId: product._id,
          quantity: item.quantity,
        });
      }
    }

    const enquiry = await Enquiry.create({
      customerName,
      customerEmail,
      customerPhone,
      companyName,
      items: enrichedItems,
      message,
      totalValue,
    });

    res.status(201).json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/enquiries/{id}:
 *   put:
 *     summary: Update enquiry status (admin only)
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, contacted, quoted, completed, rejected]
 *               adminNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Enquiry updated successfully
 *       404:
 *         description: Enquiry not found
 */
router.put('/:slug', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const enquiry = await Enquiry.findOneAndUpdate(
      { slug: req.params.slug },
      { status, adminNotes },
      { new: true, runValidators: true }
    ).populate('items.productId');

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/enquiries/{slug}/reply:
 *   post:
 *     summary: Reply to enquiry via email (admin only)
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: HTML email content
 *               quote:
 *                 type: string
 *                 format: binary
 *                 description: Optional quote file attachment
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       404:
 *         description: Enquiry not found
 */
router.post('/:slug/reply', protect, authorize('admin'), upload.single('quote'), async (req, res) => {
  try {
    const { message } = req.body;
    const enquiry = await Enquiry.findOne({ slug: req.params.slug });

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    const { transporter, emailSignature } = await import('../config/email.js');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Re: Your Enquiry - ${enquiry.slug}</h2>
        <div style="margin: 20px 0; line-height: 1.6; color: #374151;">
          ${message}
        </div>
        ${emailSignature}
      </div>
    `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: enquiry.customerEmail,
      subject: `Re: Your Enquiry - ${enquiry.slug}`,
      html: htmlContent,
    };

    if (req.file) {
      mailOptions.attachments = [{
        filename: req.file.originalname,
        path: req.file.path,
      }];
    }

    await transporter.sendMail(mailOptions);

    await Enquiry.findOneAndUpdate(
      { slug: req.params.slug },
      { status: 'contacted' }
    );

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/enquiries/{slug}:
 *   delete:
 *     summary: Delete enquiry (admin only)
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enquiry deleted successfully
 *       404:
 *         description: Enquiry not found
 */
router.delete('/:slug', protect, authorize('admin'), async (req, res) => {
  try {
    const enquiry = await Enquiry.findOneAndDelete({ slug: req.params.slug });

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.status(200).json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
