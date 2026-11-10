"""
==============================================================================
SMART RECRUITMENT, SALARY PREDICTION & ANALYTICS SYSTEM
SUBJECT 1: MACHINE LEARNING & NLP - RESUME PARSING & SKILL EXTRACTION ENGINE
==============================================================================
Features:
- Multi-format text ingestion (PDF binary extraction using pypdf, or plaintext)
- Contact entity extraction (Email, Phone via contextual regular expressions)
- Education degree recognition (MCA, BTECH, MTECH, BCA, BSC, PHD)
- Experience heuristics calculation
- Standardized skill taxonomy matching (> 80 industry tech skills)
"""

import re
import os
from typing import Dict, List, Any
import pypdf

# Standardized Technical Taxonomy
SKILL_TAXONOMY = {
    'PROGRAMMING': [
        'python', 'java', 'javascript', 'typescript', 'c\\+\\+', 'c#', 'golang', 'go',
        'rust', 'ruby', 'php', 'swift', 'kotlin', 'dart', 'scala', 'r'
    ],
    'FRAMEWORKS': [
        'react', 'react\\.js', 'angular', 'vue', 'vue\\.js', 'next\\.js', 'node\\.js',
        'express', 'express\\.js', 'spring boot', 'spring', 'django', 'flask',
        'fastapi', 'asp\\.net', 'laravel'
    ],
    'DATABASES': [
        'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'sqlite',
        'oracle', 'cassandra', 'neo4j', 'dynamodb'
    ],
    'CLOUD_DEVOPS': [
        'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s',
        'terraform', 'jenkins', 'ci/cd', 'git', 'github', 'gitlab', 'linux'
    ],
    'AI_ML': [
        'machine learning', 'deep learning', 'nlp', 'natural language processing',
        'computer vision', 'scikit-learn', 'tensorflow', 'pytorch', 'pandas',
        'numpy', 'keras', 'opencv', 'generative ai', 'llm', 'transformers'
    ],
    'WEB_CORE': [
        'html5', 'html', 'css3', 'css', 'tailwind', 'bootstrap', 'rest api',
        'restful', 'graphql', 'microservices'
    ]
}

# Degree dictionary
EDUCATION_PATTERNS = {
    'PHD': r'\b(ph\.?d|doctor of philosophy|doctorate)\b',
    'MTECH': r'\b(m\.?tech|master of technology|m\.?e\.?)\b',
    'MCA': r'\b(mca|master of computer applications?)\b',
    'BTECH': r'\b(b\.?tech|bachelor of technology|b\.?e\.?|b\.?s\.? in computer)\b',
    'BCA': r'\b(bca|bachelor of computer applications?)\b',
    'BSC_CS': r'\b(b\.?sc|bachelor of science)\b',
    'DIPLOMA': r'\b(diploma)\b',
}

class ResumeParser:
    """Enterprise Resume Extraction and Tokenization Engine"""

    @staticmethod
    def extract_text_from_pdf(pdf_path: str) -> str:
        """Extracts UTF-8 text from PDF pages using pypdf"""
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")

        extracted_text = []
        try:
            reader = pypdf.PdfReader(pdf_path)
            for page_idx, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    extracted_text.append(page_text)
            return "\n".join(extracted_text)
        except Exception as e:
            raise RuntimeError(f"Error reading PDF file {pdf_path}: {str(e)}")

    @staticmethod
    def extract_contact_info(text: str) -> Dict[str, str]:
        """Extracts email and phone using regex"""
        # Email pattern
        email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
        emails = re.findall(email_pattern, text)
        email = emails[0].lower() if emails else ""

        # Indian / International Phone Pattern
        phone_pattern = r'(?:\+?91[\s-]?)?[6789]\d{9}|\b\d{3}[-.\s]??\d{3}[-.\s]??\d{4}\b'
        phones = re.findall(phone_pattern, text)
        phone = phones[0].strip() if phones else ""

        return {
            'email': email,
            'phone': phone
        }

    @staticmethod
    def extract_education(text: str) -> str:
        """Identifies the highest or most relevant education degree"""
        text_lower = text.lower()
        # Ranked by academic seniority
        for degree in ['PHD', 'MTECH', 'MCA', 'BTECH', 'BCA', 'BSC_CS', 'DIPLOMA']:
            pattern = EDUCATION_PATTERNS[degree]
            if re.search(pattern, text_lower):
                return degree
        return "BTECH"  # Default baseline assumption

    @staticmethod
    def extract_skills(text: str) -> List[str]:
        """Matches resume tokens against technical skills ontology"""
        text_lower = " " + text.lower() + " "
        found_skills = set()

        for category, skills in SKILL_TAXONOMY.items():
            for skill_regex in skills:
                # Use word boundaries so 'c' does not match every word with 'c'
                pattern = r'(?<![a-zA-Z0-9])' + skill_regex + r'(?![a-zA-Z0-9])'
                if re.search(pattern, text_lower):
                    clean_name = skill_regex.replace('\\', '').replace('.', '').title()
                    # Formatting canonical names
                    if clean_name.lower() == 'reactjs' or clean_name.lower() == 'react':
                        clean_name = 'React.js'
                    elif clean_name.lower() == 'nodejs' or clean_name.lower() == 'node':
                        clean_name = 'Node.js'
                    elif clean_name.lower() == 'expressjs' or clean_name.lower() == 'express':
                        clean_name = 'Express.js'
                    elif clean_name.lower() == 'c++':
                        clean_name = 'C++'
                    elif clean_name.lower() == 'aws':
                        clean_name = 'AWS'
                    elif clean_name.lower() == 'nlp':
                        clean_name = 'Natural Language Processing'
                    found_skills.add(clean_name)

        return sorted(list(found_skills))

    @staticmethod
    def extract_experience_years(text: str) -> float:
        """Parses experience keywords or ranges"""
        text_lower = text.lower()
        patterns = [
            r'(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience',
            r'experience\s*(?:of|:)?\s*(\d+(?:\.\d+)?)\s*(?:years?|yrs?)',
            r'total\s+experience\s*(?:of|:)?\s*(\d+(?:\.\d+)?)\s*(?:years?|yrs?)'
        ]
        for pat in patterns:
            match = re.search(pat, text_lower)
            if match:
                try:
                    exp = float(match.group(1))
                    if 0.0 <= exp <= 35.0:
                        return exp
                except ValueError:
                    pass

        # Fallback heuristic: Count distinct year mentions (e.g., 2021 to 2024 -> 3 yrs)
        year_matches = [int(y) for y in re.findall(r'\b(201[0-9]|202[0-6])\b', text)]
        if len(year_matches) >= 2:
            span = max(year_matches) - min(year_matches)
            if 0 < span <= 20:
                return float(span)

        return 2.0  # Safe default baseline

    @classmethod
    def parse_resume(cls, file_path_or_text: str, is_raw_text: bool = False) -> Dict[str, Any]:
        """Master parsing orchestration returning structured profile"""
        if is_raw_text:
            text = file_path_or_text
        else:
            text = cls.extract_text_from_pdf(file_path_or_text)

        contacts = cls.extract_contact_info(text)
        education = cls.extract_education(text)
        skills = cls.extract_skills(text)
        experience = cls.extract_experience_years(text)

        return {
            'text_length': len(text),
            'extracted_email': contacts['email'],
            'extracted_phone': contacts['phone'],
            'education_level': education,
            'experience_years': experience,
            'skills': skills,
            'skills_count': len(skills),
            'summary_snippet': text[:400].strip() if text else "",
        }

def parse_resume_text(raw_text: str) -> Dict[str, Any]:
    """Convenience functional wrapper for parsing raw resume text string"""
    res = ResumeParser.parse_resume(raw_text, is_raw_text=True)
    res['extracted_skills'] = res['skills']
    return res

if __name__ == '__main__':
    sample_text = """
    Rahul Verma
    Email: rahul.verma@example.com | Phone: +91 9876543210
    Education: Master of Computer Applications (MCA) - 2023
    Total Experience: 3.5 years as Full Stack Developer
    Technical Skills: Python, React.js, Node.js, Express.js, MySQL, MongoDB, AWS, Docker, Machine Learning
    Experience:
    Built enterprise web applications using Node.js and React.js.
    Designed normalized MySQL relational databases and integrated MongoDB document stores.
    """
    result = ResumeParser.parse_resume(sample_text, is_raw_text=True)
    import pprint
    print("Parsed Resume Output:")
    pprint.pprint(result)
