"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResume = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const parseResume = async (file) => {
    try {
        const fileContent = file.buffer.toString('utf-8');
        const emailMatch = fileContent.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
        const phoneMatch = fileContent.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
        const skillPatterns = [
            'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#', 'PHP',
            'Ruby', 'Go', 'Rust', 'TypeScript', 'Angular', 'Vue.js', 'Express.js',
            'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Kubernetes',
            'Git', 'HTML', 'CSS', 'SASS', 'LESS', 'Webpack', 'Babel', 'Jest',
            'Mocha', 'Chai', 'Cypress', 'Selenium', 'Agile', 'Scrum', 'DevOps'
        ];
        const foundSkills = skillPatterns.filter(skill => fileContent.toLowerCase().includes(skill.toLowerCase()));
        return {
            email: emailMatch ? emailMatch[0] : undefined,
            phone: phoneMatch ? phoneMatch[0] : undefined,
            skills: foundSkills.length > 0 ? foundSkills : undefined,
            summary: fileContent.substring(0, 500) + (fileContent.length > 500 ? '...' : ''),
        };
    }
    catch (error) {
        throw new errorHandler_1.ApiError(500, 'Failed to parse resume');
    }
};
exports.parseResume = parseResume;
//# sourceMappingURL=resumeService.js.map