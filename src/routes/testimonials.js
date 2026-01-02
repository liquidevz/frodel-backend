import express from 'express';
import Testimonial from '../models/Testimonial.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Get all active testimonials
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: List of all testimonials
 */
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/testimonials/{id}:
 *   get:
 *     summary: Get single testimonial
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Testimonial details
 *       404:
 *         description: Testimonial not found
 */
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/testimonials:
 *   post:
 *     summary: Create testimonial (admin only)
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - testimonial
 *               - by
 *             properties:
 *               testimonial:
 *                 type: string
 *               by:
 *                 type: string
 *               order:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Testimonial created successfully
 */
router.post('/', protect, authorize('admin'), upload.single('image'), async (req, res) => {
  try {
    const { testimonial, by, order } = req.body;

    if (!testimonial || !by) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const imgSrc = req.file ? `/uploads/products/${req.file.filename}` : '';

    const newTestimonial = await Testimonial.create({
      testimonial,
      by,
      imgSrc,
      order: order || 0,
    });

    res.status(201).json({ success: true, data: newTestimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/testimonials/{id}:
 *   put:
 *     summary: Update testimonial (admin only)
 *     tags: [Testimonials]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               testimonial:
 *                 type: string
 *               by:
 *                 type: string
 *               order:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Testimonial updated successfully
 */
router.put('/:id', protect, authorize('admin'), upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.imgSrc = `/uploads/products/${req.file.filename}`;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/testimonials/{id}:
 *   delete:
 *     summary: Delete testimonial (admin only)
 *     tags: [Testimonials]
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
 *         description: Testimonial deleted successfully
 */
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
