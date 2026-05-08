import { ApiError } from '../middleware/errorHandler';

interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  experience?: string;
  education?: string[];
  summary?: string;
}

export const parseResume = async (file: Express.Multer.File): Promise<ParsedResumeData> => {
  try {
    // Basic resume parsing logic
    // In a real implementation, you would use a library like pdf-parse, mammoth, etc.
    // For now, return a basic structure
    
    const fileContent = file.buffer.toString('utf-8');
    
    // Extract basic information using regex patterns
    const emailMatch = fileContent.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const phoneMatch = fileContent.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    
    // Extract skills (common programming languages and technologies)
    const skillPatterns = [
      'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#', 'PHP',
      'Ruby', 'Go', 'Rust', 'TypeScript', 'Angular', 'Vue.js', 'Express.js',
      'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Kubernetes',
      'Git', 'HTML', 'CSS', 'SASS', 'LESS', 'Webpack', 'Babel', 'Jest',
      'Mocha', 'Chai', 'Cypress', 'Selenium', 'Agile', 'Scrum', 'DevOps'
    ];
    
    const foundSkills = skillPatterns.filter(skill => 
      fileContent.toLowerCase().includes(skill.toLowerCase())
    );

    return {
      email: emailMatch ? emailMatch[0] : undefined,
      phone: phoneMatch ? phoneMatch[0] : undefined,
      skills: foundSkills.length > 0 ? foundSkills : undefined,
      summary: fileContent.substring(0, 500) + (fileContent.length > 500 ? '...' : ''),
    };
  } catch (error) {
    throw new ApiError(500, 'Failed to parse resume');
  }
}; 