"""
Dataset Generator for Smart Recruitment & Salary Prediction
Generates a realistic, statistically coherent dataset for Indian Tech Market (INR / LPA)
Features:
- experience_years (0 to 18)
- education_level (BCA, BSC_CS, BTECH, MCA, MTECH, PHD)
- job_role (Full Stack Developer, ML Engineer, Java Developer, Data Analyst, Frontend Developer, DevOps Engineer, Cloud Architect)
- technical_skills_count (1 to 10)
- location (Bengaluru, Hyderabad, Pune, Chennai, Delhi NCR, Mumbai)
- company_size (STARTUP, MID_SIZE, ENTERPRISE)
- salary_inr (Target output)
- salary_lpa (Target in Lakhs Per Annum)
"""

import csv
import random
import os

random.seed(42)

# Base salaries by role (in INR for 0 years experience in Mid-size company)
ROLE_BASE = {
    'Frontend Developer': 420000,
    'Java Developer': 480000,
    'Full Stack Developer': 520000,
    'Data Analyst': 450000,
    'ML Engineer': 600000,
    'DevOps Engineer': 580000,
    'Cloud Architect': 750000,
}

# Annual growth rate per year of experience by role
ROLE_INCREMENT_PER_YEAR = {
    'Frontend Developer': 140000,
    'Java Developer': 160000,
    'Full Stack Developer': 180000,
    'Data Analyst': 130000,
    'ML Engineer': 220000,
    'DevOps Engineer': 200000,
    'Cloud Architect': 240000,
}

# Education multiplier
EDU_WEIGHT = {
    'BCA': 0.90,
    'BSC_CS': 0.88,
    'BTECH': 1.05,
    'MCA': 1.08,
    'MTECH': 1.18,
    'PHD': 1.35,
}

# Location multiplier (Tier-1 vs Tier-2 cost of living index)
LOC_WEIGHT = {
    'Bengaluru': 1.20,
    'Hyderabad': 1.12,
    'Pune': 1.05,
    'Mumbai': 1.15,
    'Delhi NCR': 1.10,
    'Chennai': 1.02,
}

# Company size multiplier
SIZE_WEIGHT = {
    'STARTUP': 0.95,
    'MID_SIZE': 1.00,
    'ENTERPRISE': 1.22,
}

ROLES = list(ROLE_BASE.keys())
EDUCATIONS = list(EDU_WEIGHT.keys())
LOCATIONS = list(LOC_WEIGHT.keys())
SIZES = list(SIZE_WEIGHT.keys())

def generate_records(num_records=1200):
    records = []
    for _ in range(num_records):
        exp = round(random.uniform(0.5, 16.0), 1)
        role = random.choices(ROLES, weights=[20, 20, 22, 12, 14, 12, 8])[0]
        edu = random.choices(EDUCATIONS, weights=[15, 10, 35, 25, 12, 3])[0]
        loc = random.choices(LOCATIONS, weights=[30, 22, 18, 10, 12, 8])[0]
        size = random.choices(SIZES, weights=[25, 45, 30])[0]

        # Skills correlated with experience
        base_skills = min(10, max(2, int(exp * 0.6) + random.randint(1, 4)))
        skills_count = base_skills

        base = ROLE_BASE[role]
        increment = ROLE_INCREMENT_PER_YEAR[role]

        # Non-linear diminishing returns curve for high experience (logarithmic/polynomial effect)
        exp_component = increment * (exp ** 0.92)

        # Skills premium (each skill adds ~3% compounding value)
        skills_component = (skills_count * 0.035) * base

        raw_salary = (base + exp_component + skills_component)
        raw_salary *= EDU_WEIGHT[edu]
        raw_salary *= LOC_WEIGHT[loc]
        raw_salary *= SIZE_WEIGHT[size]

        # Add realistic market variance (+/- 8% random noise)
        noise = random.uniform(0.92, 1.08)
        final_salary = round(raw_salary * noise, -3)  # Rounded to nearest 1000

        # Boundary checks
        final_salary = max(300000, min(5000000, final_salary))
        salary_lpa = round(final_salary / 100000.0, 2)

        records.append({
            'experience_years': exp,
            'education_level': edu,
            'job_role': role,
            'technical_skills_count': skills_count,
            'location': loc,
            'company_size': size,
            'salary_inr': int(final_salary),
            'salary_lpa': salary_lpa,
        })
    return records

if __name__ == '__main__':
    dataset_dir = os.path.join(os.path.dirname(__file__), 'datasets')
    os.makedirs(dataset_dir, exist_ok=True)
    out_path = os.path.join(dataset_dir, 'salary_dataset.csv')

    data = generate_records(1500)
    fieldnames = [
        'experience_years', 'education_level', 'job_role',
        'technical_skills_count', 'location', 'company_size',
        'salary_inr', 'salary_lpa'
    ]

    with open(out_path, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)

    print(f"Generated {len(data)} realistic recruitment records at: {out_path}")
