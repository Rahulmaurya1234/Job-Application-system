import express from "express";
import axios from "axios";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Circuit breaker state for AI service
let aiServiceFailures = 0;
const MAX_FAILURES = 5;
const CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 minute
let circuitBreakerUntil = 0;

// Validate AI service response
const validateAIResponse = (data) => {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid AI response format');
    }

    // Check for expected structure (adjust based on your AI service response)
    if (!data.jobs && !Array.isArray(data.jobs)) {
        throw new Error('AI response missing jobs array');
    }

    return data;
};

// Check if circuit breaker is active
const isCircuitBreakerActive = () => {
    return Date.now() < circuitBreakerUntil;
};

// Reset circuit breaker on success
const resetCircuitBreaker = () => {
    aiServiceFailures = 0;
    circuitBreakerUntil = 0;
};

// Trigger circuit breaker on failure
const triggerCircuitBreaker = () => {
    aiServiceFailures++;
    if (aiServiceFailures >= MAX_FAILURES) {
        circuitBreakerUntil = Date.now() + CIRCUIT_BREAKER_TIMEOUT;
        console.warn(`🚨 AI Service Circuit Breaker activated for ${CIRCUIT_BREAKER_TIMEOUT / 1000}s`);
    }
};

router.get("/jobs", protect, async (req, res) => {
    const startTime = Date.now();

    try {
        // Check circuit breaker
        if (isCircuitBreakerActive()) {
            const remaining = Math.ceil((circuitBreakerUntil - Date.now()) / 1000);
            return res.status(503).json({
                success: false,
                msg: `AI service temporarily unavailable. Try again in ${remaining}s`,
                circuitBreaker: true
            });
        }

        const user = await User.findById(req.user._id);
        if (!user?.resume) {
            return res.status(400).json({
                success: false,
                msg: "No resume uploaded. Please upload your resume first."
            });
        }

        let resumeUrl = user.resume;

        // Safety check for old Cloudinary URLs
        if (resumeUrl.includes("/upload/") && !resumeUrl.includes("/raw/upload/")) {
            resumeUrl = resumeUrl.replace("/upload/", "/raw/upload/");
        }

        // Validate resume URL format
        if (!resumeUrl.startsWith('http') || !resumeUrl.includes('cloudinary')) {
            return res.status(400).json({
                success: false,
                msg: "Invalid resume URL format"
            });
        }

        console.log("🔍 Processing AI request for user:", user._id);

        // Configure axios with Render-friendly timeout (25s for free tier)
        const axiosConfig = {
            timeout: 25000, // 25 seconds for Render free tier
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "CareerAI-Backend/1.0"
            },
            maxContentLength: 10 * 1024 * 1024, // 10MB max response
            maxBodyLength: 10 * 1024 * 1024,
            // Retry configuration
            retry: 2,
            retryDelay: 1000
        };

        let aiRes;
        try {
            aiRes = await axios.post(
                "https://job-application-system-1.onrender.com/analyze",
                { resumeUrl },
                axiosConfig
            );
        } catch (axiosError) {
            // Handle specific axios errors
            if (axiosError.code === 'ECONNABORTED') {
                triggerCircuitBreaker();
                return res.status(504).json({
                    success: false,
                    msg: "AI service timeout. Please try again later.",
                    error: "TIMEOUT"
                });
            }

            if (axiosError.response?.status === 429) {
                return res.status(429).json({
                    success: false,
                    msg: "AI service rate limited. Please try again in a few minutes.",
                    error: "RATE_LIMITED"
                });
            }

            if (axiosError.response?.status >= 500) {
                triggerCircuitBreaker();
                return res.status(502).json({
                    success: false,
                    msg: "AI service temporarily unavailable. Please try again later.",
                    error: "SERVICE_UNAVAILABLE"
                });
            }

            // Re-throw for general error handling
            throw axiosError;
        }

        // Validate AI response structure
        const validatedData = validateAIResponse(aiRes.data);

        // Reset circuit breaker on successful response
        resetCircuitBreaker();

        const processingTime = Date.now() - startTime;
        console.log(`✅ AI request completed in ${processingTime}ms`);

        // Return successful response
        res.json({
            success: true,
            ...validatedData,
            processingTime
        });

    } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error(`❌ AI request failed after ${processingTime}ms:`, {
            error: error.message,
            stack: error.stack,
            userId: req.user?._id
        });

        // Trigger circuit breaker for unexpected errors
        triggerCircuitBreaker();

        // Return appropriate error response
        if (error.message.includes('Invalid AI response')) {
            return res.status(502).json({
                success: false,
                msg: "AI service returned invalid data. Please try again.",
                error: "INVALID_RESPONSE"
            });
        }

        // Generic server error
        res.status(500).json({
            success: false,
            msg: "Internal server error. Please try again later.",
            error: "INTERNAL_ERROR"
        });
    }
});

export default router;