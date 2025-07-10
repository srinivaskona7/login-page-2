const express = require('express');
const Joi = require('joi');
const emailService = require('../services/emailService');

const router = express.Router();

// Validation schemas
const sendNotificationSchema = Joi.object({
  type: Joi.string().valid('otp', 'welcome', 'password-reset', 'general').required(),
  to: Joi.string().email().required(),
  firstName: Joi.string().when('type', {
    is: Joi.valid('otp', 'welcome'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  otp: Joi.string().length(6).when('type', {
    is: 'otp',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  resetToken: Joi.string().when('type', {
    is: 'password-reset',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  subject: Joi.string().max(200).when('type', {
    is: 'general',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  message: Joi.string().max(5000).when('type', {
    is: 'general',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

// Send notification
router.post('/send', async (req, res) => {
  try {
    // Validate input
    const { error, value } = sendNotificationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { type, to, firstName, otp, resetToken, subject, message } = value;

    let result;

    switch (type) {
      case 'otp':
        result = await emailService.sendOTPEmail(to, firstName, otp);
        break;
      case 'welcome':
        result = await emailService.sendWelcomeEmail(to, firstName);
        break;
      case 'password-reset':
        result = await emailService.sendPasswordResetEmail(to, firstName, resetToken);
        break;
      case 'general':
        result = await emailService.sendGeneralEmail(to, subject, message);
        break;
      default:
        return res.status(400).json({ error: 'Invalid notification type' });
    }

    if (result.success) {
      res.json({
        message: 'Notification sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        error: 'Failed to send notification',
        details: result.error
      });
    }

  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Send bulk notifications (for admin use)
router.post('/send-bulk', async (req, res) => {
  try {
    const { recipients, type, subject, message } = req.body;

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients array is required' });
    }

    if (recipients.length > 100) {
      return res.status(400).json({ error: 'Maximum 100 recipients allowed per request' });
    }

    const results = [];
    const errors = [];

    for (const recipient of recipients) {
      try {
        let result;
        
        if (type === 'general') {
          result = await emailService.sendGeneralEmail(recipient.email, subject, message);
        } else {
          errors.push({ email: recipient.email, error: 'Invalid notification type for bulk send' });
          continue;
        }

        if (result.success) {
          results.push({ email: recipient.email, messageId: result.messageId });
        } else {
          errors.push({ email: recipient.email, error: result.error });
        }
      } catch (error) {
        errors.push({ email: recipient.email, error: error.message });
      }
    }

    res.json({
      message: 'Bulk notification processing completed',
      successful: results.length,
      failed: errors.length,
      results,
      errors
    });

  } catch (error) {
    console.error('Send bulk notification error:', error);
    res.status(500).json({ error: 'Failed to send bulk notifications' });
  }
});

// Get notification status (placeholder for future implementation)
router.get('/status/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    
    // This would typically check the status with the email provider
    // For now, we'll return a placeholder response
    res.json({
      messageId,
      status: 'delivered', // delivered, pending, failed, bounced
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get notification status error:', error);
    res.status(500).json({ error: 'Failed to get notification status' });
  }
});

module.exports = router;