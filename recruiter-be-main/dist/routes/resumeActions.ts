
import { Router } from 'express';
import Candidate from '../models/Candidate';
import { authenticate } from '../middleware/auth';

const router = Router();

// Endpoint to fetch and stream/view the resume
router.get('/view-resume/:id', authenticate, async (req: any, res: any) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        
        if (!candidate || !candidate.resumeUrl) {
            return res.status(404).json({ message: "Resume URL not found for this candidate" });
        }

        // Logic: Redirect to the S3 bucket where the PDF is stored
        // Browsers will automatically open PDF links in a viewer
        res.redirect(candidate.resumeUrl);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resume", error });
    }
});

export default router;