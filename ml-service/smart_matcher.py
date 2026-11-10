"""
==============================================================================
SMART RECRUITMENT, SALARY PREDICTION & ANALYTICS SYSTEM
SUBJECT 1: MACHINE LEARNING & NLP - SMART CANDIDATE MATCHING & AI SUITE
==============================================================================
Provides enterprise recruitment intelligence:
1. Candidate-Job Compatibility Scoring (Explainable 70% Skill + 30% Experience)
2. AI Resume Ranking (Batch ranking with percentiles and recommendations)
3. Deep Skill Gap Analysis (Categorized missing competencies & learning effort)
4. AI-Generated Interview Question Generator (Technical, Behavioral, System Design)
5. Career Role Recommendations (Next-step career progression tracks)
6. Salary Benchmarking (10th, 25th, Median, 75th, 90th percentile comparisons)
"""

from typing import List, Dict, Any
import hashlib

class SmartCandidateMatcher:
    """Explainable Multi-Criteria Candidate-Job Matching & AI Career Engine"""

    @staticmethod
    def match_candidate_to_job(
        candidate_skills: List[str],
        candidate_experience: float,
        job_required_skills: List[str],
        job_min_experience: float,
        job_max_experience: float
    ) -> Dict[str, Any]:
        """
        Executes hybrid deterministic + heuristic matching.
        Weights:
        - 70% Technical Skill Overlap
        - 30% Experience Fit
        """
        # Canonicalize skills for case-insensitive matching
        cand_set = {s.strip().lower() for s in candidate_skills if s and s.strip()}
        req_set = {s.strip().lower() for s in job_required_skills if s and s.strip()}

        if not req_set:
            skill_score = 75.0
            matched_skills = list(candidate_skills)
            missing_skills = []
        else:
            intersection = cand_set.intersection(req_set)
            matched_skills = [s for s in job_required_skills if s.strip().lower() in intersection]
            missing_skills = [s for s in job_required_skills if s.strip().lower() not in intersection]
            skill_score = round((len(intersection) / len(req_set)) * 100.0, 2)

        # Experience Fit Curve
        if candidate_experience < job_min_experience:
            if job_min_experience > 0:
                exp_score = (candidate_experience / job_min_experience) * 85.0
            else:
                exp_score = 100.0
            exp_status = 'UNDER_QUALIFIED'
        elif candidate_experience > job_max_experience:
            gap = candidate_experience - job_max_experience
            exp_score = max(70.0, 100.0 - (gap * 3.0))
            exp_status = 'OVER_QUALIFIED'
        else:
            exp_score = 100.0
            exp_status = 'OPTIMAL_FIT'

        # Composite Weighted Score
        final_score = round((skill_score * 0.70) + (exp_score * 0.30), 2)
        final_score = min(100.0, max(0.0, final_score))

        match_level = "Excellent" if final_score >= 85 else ("Good" if final_score >= 70 else ("Moderate" if final_score >= 50 else "Low"))
        
        reasons = []
        if len(matched_skills) > 0:
            reasons.append(f"Candidate demonstrated proficiency in key required skills: {', '.join(matched_skills)}.")
        if len(missing_skills) > 0:
            reasons.append(f"Missing key job requirements: {', '.join(missing_skills)}.")
        else:
            reasons.append("100% of core technical competencies satisfied.")

        if exp_status == 'OPTIMAL_FIT':
            reasons.append(f"Experience level ({candidate_experience} yrs) is inside target job bounds ({job_min_experience}-{job_max_experience} yrs).")
        elif exp_status == 'UNDER_QUALIFIED':
            reasons.append(f"Candidate has {candidate_experience} yrs experience, which is under the requested minimum of {job_min_experience} yrs.")
        else:
            reasons.append(f"Candidate possesses {candidate_experience} yrs experience, exceeding target range ({job_min_experience}-{job_max_experience} yrs).")

        summary_text = f"{match_level} Match ({final_score}%): " + " ".join(reasons)

        return {
            'final_match_score': final_score,
            'match_level': match_level,
            'skill_match_score': skill_score,
            'experience_score': round(exp_score, 2),
            'experience_status': exp_status,
            'matched_skills': matched_skills,
            'missing_skills': missing_skills,
            'matched_skills_count': len(matched_skills),
            'required_skills_count': len(job_required_skills),
            'explainable_summary': summary_text,
            'hr_recommendation': 'Proceed to Technical Interview' if final_score >= 75 else ('Manual HR Review' if final_score >= 55 else 'Hold for Consideration')
        }

    @classmethod
    def rank_candidates_for_job(
        cls,
        candidates: List[Dict[str, Any]],
        job_required_skills: List[str],
        job_min_exp: float,
        job_max_exp: float
    ) -> List[Dict[str, Any]]:
        """
        AI Resume Ranking: Evaluates and ranks multiple candidate resumes against a job.
        Returns candidates ordered by descending compatibility score with relative percentiles.
        """
        scored_candidates = []
        for cand in candidates:
            # Handle skills as array, comma-separated string, or nested
            skills = cand.get('skills') or cand.get('skills_list') or cand.get('extracted_skills') or []
            if isinstance(skills, str):
                skills = [s.strip() for s in skills.split(',') if s.strip()]
            elif isinstance(skills, (list, tuple, set)):
                skills = [str(s).strip() for s in skills if s and str(s).strip()]
            else:
                skills = []

            exp = float(cand.get('experience_years') if cand.get('experience_years') is not None else cand.get('experience', 0.0))
            cand_name = cand.get('full_name') or f"{cand.get('first_name', '')} {cand.get('last_name', '')}".strip() or cand.get('candidate_name') or 'Candidate'
            cand_code = cand.get('candidate_code') or f"CAN-{cand.get('id', 1000)}"

            match_res = cls.match_candidate_to_job(
                candidate_skills=skills,
                candidate_experience=exp,
                job_required_skills=job_required_skills,
                job_min_experience=job_min_exp,
                job_max_experience=job_max_exp
            )

            scored_candidates.append({
                'candidate_id': cand.get('id'),
                'candidate_code': cand_code,
                'candidate_name': cand_name,
                'name': cand_name,
                'email': cand.get('email', ''),
                'phone': cand.get('phone', ''),
                'experience_years': exp,
                'education_level': cand.get('education_level', 'BTECH'),
                'status': cand.get('status', 'AVAILABLE'),
                'match_score': match_res['final_match_score'],
                'skill_match_score': match_res['skill_match_score'],
                'experience_score': match_res['experience_score'],
                'experience_status': match_res['experience_status'],
                'match_level': match_res['match_level'],
                'matched_skills': match_res['matched_skills'],
                'missing_skills': match_res['missing_skills'],
                'matched_skills_count': match_res['matched_skills_count'],
                'required_skills_count': match_res['required_skills_count'],
                'hr_recommendation': match_res['hr_recommendation'],
                'explainable_summary': match_res['explainable_summary'],
                'summary': match_res['explainable_summary']
            })

        # Sort descending by match score, secondary sort by experience
        scored_candidates.sort(key=lambda c: (c['match_score'], c['experience_years']), reverse=True)

        total = len(scored_candidates)
        for idx, item in enumerate(scored_candidates):
            item['rank'] = idx + 1
            item['percentile'] = round(((total - idx) / total) * 100.0, 1) if total > 0 else 100.0

        return scored_candidates

    @staticmethod
    def analyze_skill_gaps(candidate_skills: List[str], job_required_skills: List[str]) -> Dict[str, Any]:
        """
        Detailed Skill Gap Analysis: Highlights possessed competencies,
        deficiencies, and recommended upskilling paths.
        """
        cand_set = {s.strip().lower() for s in candidate_skills if s and s.strip()}
        req_set = {s.strip().lower() for s in job_required_skills if s and s.strip()}

        matched = [s for s in job_required_skills if s.strip().lower() in cand_set]
        missing = [s for s in job_required_skills if s.strip().lower() not in cand_set]

        gap_details = []
        for skill in missing:
            # Heuristic effort estimation
            effort_weeks = 3
            priority = 'HIGH' if skill.lower() in ['python', 'java', 'react.js', 'sql', 'docker'] else 'MEDIUM'
            gap_details.append({
                'skill': skill,
                'priority': priority,
                'estimated_learning_effort': f"{effort_weeks} - 4 weeks",
                'suggested_course_topic': f"Production {skill} Design Patterns & Hands-on Implementation"
            })

        readiness_index = round((len(matched) / len(job_required_skills) * 100.0), 2) if job_required_skills else 100.0

        return {
            'total_required_skills': len(job_required_skills),
            'matched_skills_count': len(matched),
            'missing_skills_count': len(missing),
            'readiness_percentage': readiness_index,
            'matched_skills': matched,
            'missing_skills_breakdown': gap_details,
            'upskilling_summary': f"Candidate possesses {len(matched)} of {len(job_required_skills)} required skills. Closing {len(missing)} skill gap(s) would increase eligibility to 100%."
        }

    @staticmethod
    def generate_interview_questions(
        candidate_skills: List[str],
        job_role: str,
        missing_skills: List[str] = None
    ) -> Dict[str, Any]:
        """
        AI-Generated Interview Questions: Produces personalized technical,
        architecture, and skill-gap exploration questions for HR panels.
        """
        cand_skills_clean = [s.strip() for s in candidate_skills if s.strip()]
        missing_clean = [s.strip() for s in (missing_skills or []) if s.strip()]

        technical_questions = []
        architecture_questions = []
        gap_questions = []
        behavioral_questions = [
            "Describe a high-stakes production incident or bug you encountered. How did you triage, diagnose, and resolve it under SLA pressure?",
            "How do you balance rapid feature delivery against architectural technical debt and unit test coverage in an Agile sprint?",
            "Walk us through an instance where you had to collaborate with cross-functional stakeholders (e.g. Product, QA, DevOps) with conflicting priorities."
        ]

        # Skill-specific technical questions generator
        for skill in cand_skills_clean[:4]:
            sk_lower = skill.lower()
            if 'python' in sk_lower:
                technical_questions.append({
                    'skill': skill,
                    'question': "How do Python's GIL (Global Interpreter Lock), multiprocessing, and asyncio event loops differ when designing I/O-bound vs CPU-bound services?",
                    'evaluation_focus': "Deep concurrency understanding and asynchronous programming."
                })
            elif 'react' in sk_lower:
                technical_questions.append({
                    'skill': skill,
                    'question': "Explain the React Fiber reconciliation algorithm, state batching in React 18, and strategies to prevent unnecessary re-renders in large component trees.",
                    'evaluation_focus': "Frontend performance profiling and virtual DOM mechanics."
                })
            elif 'java' in sk_lower:
                technical_questions.append({
                    'skill': skill,
                    'question': "Compare JVM garbage collectors (G1, ZGC) and explain how memory leaks can occur in Java despite automatic garbage collection.",
                    'evaluation_focus': "Memory management, JVM tuning, and heap profiling."
                })
            elif 'sql' in sk_lower or 'mysql' in sk_lower:
                technical_questions.append({
                    'skill': skill,
                    'question': "How do B-Tree indexes, composite indexing, and query execution plans (`EXPLAIN ANALYZE`) impact query performance in high-throughput workloads?",
                    'evaluation_focus': "Database optimization and indexing strategies."
                })
            elif 'docker' in sk_lower:
                technical_questions.append({
                    'skill': skill,
                    'question': "What are the best practices for multi-stage Docker builds, non-root user execution, and minimizing image layer cache invalidation?",
                    'evaluation_focus': "Container security and operational optimization."
                })
            else:
                technical_questions.append({
                    'skill': skill,
                    'question': f"Describe the architectural patterns and production challenges you navigated while implementing {skill} in your previous projects.",
                    'evaluation_focus': f"Practical hands-on mastery of {skill}."
                })

        # Gap exploration questions
        for skill in missing_clean[:2]:
            gap_questions.append({
                'skill': skill,
                'question': f"The role requires familiarity with {skill}, which was not highlighted on your profile. Have you worked with comparable technologies, and how do you approach quickly mastering unfamiliar frameworks?",
                'evaluation_focus': "Learning velocity and adaptability to new tooling."
            })

        # Role-based system design question
        architecture_questions.append({
            'role': job_role,
            'question': f"Design a resilient, horizontally scalable microservice architecture for {job_role}. How would you manage distributed caching, database sharding, and API rate limiting?",
            'evaluation_focus': "High-level distributed systems design and fault tolerance."
        })

        return {
            'job_role': job_role,
            'generated_for_skills': cand_skills_clean,
            'technical_questions': technical_questions,
            'architecture_questions': architecture_questions,
            'skill_gap_questions': gap_questions,
            'behavioral_questions': behavioral_questions,
            'total_questions_count': len(technical_questions) + len(architecture_questions) + len(gap_questions) + len(behavioral_questions)
        }

    @staticmethod
    def recommend_career_roles(candidate_skills: List[str], experience_years: float) -> List[Dict[str, Any]]:
        """
        AI Career Role Recommendation: Analyzes candidate's technical profile
        and proposes suitable advancement tracks and transition pathways.
        """
        skills_set = {s.strip().lower() for s in candidate_skills}

        career_tracks = [
            {
                'role_title': 'Senior Full-Stack Architect',
                'target_experience': '5+ years',
                'required_key_skills': ['react.js', 'node.js', 'mysql', 'docker', 'aws'],
                'market_salary_benchmark_lpa': '₹24 - 38 LPA',
                'description': 'Lead end-to-end cloud applications with microservices and high-availability architecture.'
            },
            {
                'role_title': 'AI / ML Engineer & Generative AI Specialist',
                'target_experience': '3+ years',
                'required_key_skills': ['python', 'machine learning', 'scikit-learn', 'nlp', 'pandas'],
                'market_salary_benchmark_lpa': '₹22 - 35 LPA',
                'description': 'Develop automated inference pipelines, natural language models, and predictive ML systems.'
            },
            {
                'role_title': 'Cloud DevOps & Site Reliability Engineer',
                'target_experience': '4+ years',
                'required_key_skills': ['docker', 'kubernetes', 'aws', 'linux', 'ci/cd'],
                'market_salary_benchmark_lpa': '₹20 - 32 LPA',
                'description': 'Automate infrastructure as code, container orchestration, and continuous deployment pipelines.'
            },
            {
                'role_title': 'Core Enterprise Java Backend Specialist',
                'target_experience': '4+ years',
                'required_key_skills': ['java', 'spring boot', 'mysql', 'redis', 'microservices'],
                'market_salary_benchmark_lpa': '₹22 - 34 LPA',
                'description': 'Build transaction-heavy, low-latency enterprise banking and recruitment backends.'
            }
        ]

        recommendations = []
        for track in career_tracks:
            req_set = {s.lower() for s in track['required_key_skills']}
            matching = [s for s in track['required_key_skills'] if s.lower() in skills_set]
            missing = [s for s in track['required_key_skills'] if s.lower() not in skills_set]
            readiness = round((len(matching) / len(track['required_key_skills'])) * 100.0, 1)

            recommendations.append({
                'role_title': track['role_title'],
                'market_salary_range': track['market_salary_benchmark_lpa'],
                'match_readiness_percentage': readiness,
                'matched_skills': matching,
                'recommended_learning_skills': missing,
                'description': track['description']
            })

        recommendations.sort(key=lambda r: r['match_readiness_percentage'], reverse=True)
        return recommendations

    @staticmethod
    def calculate_salary_benchmarks(job_role: str, experience_years: float, location: str = 'Bengaluru') -> Dict[str, Any]:
        """
        Salary Benchmarking: Computes 10th, 25th (Q1), 50th (Median), 75th (Q3),
        and 90th percentile compensation for a role and experience tier.
        """
        # Baseline model calibrated against Indian Tech Market (Lakhs INR)
        base_lpa = 7.0 + (experience_years * 2.8)

        # Tier-1 Location multiplier
        loc_mult = 1.15 if location.lower() in ['bengaluru', 'bangalore', 'mumbai', 'gurugram'] else 1.0

        p50 = round(base_lpa * loc_mult, 2)
        p10 = round(p50 * 0.70, 2)
        p25 = round(p50 * 0.85, 2)
        p75 = round(p50 * 1.25, 2)
        p90 = round(p50 * 1.50, 2)

        return {
            'job_role': job_role,
            'experience_years': experience_years,
            'location': location,
            'currency': 'INR',
            'percentiles_lpa': {
                '10th_percentile': p10,
                '25th_percentile_q1': p25,
                '50th_percentile_median': p50,
                '75th_percentile_q3': p75,
                '90th_percentile': p90
            },
            'percentiles_inr': {
                '10th_percentile': int(p10 * 100000),
                '25th_percentile_q1': int(p25 * 100000),
                '50th_percentile_median': int(p50 * 100000),
                '75th_percentile_q3': int(p75 * 100000),
                '90th_percentile': int(p90 * 100000)
            },
            'market_competitiveness': 'Market Average (Competitive)'
        }
