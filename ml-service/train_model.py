"""
==============================================================================
SMART RECRUITMENT, SALARY PREDICTION & ANALYTICS SYSTEM
SUBJECT 1: MACHINE LEARNING WITH PYTHON - MODEL TRAINING & EVALUATION PIPELINE
==============================================================================
Trains and evaluates:
1. Linear Regression (Baseline Parametric Regressor - Ordinary Least Squares)
2. Random Forest Regressor (Ensemble Non-Parametric Regressor - 100 Trees)

Evaluates both models using:
- K-Fold Cross Validation (k=5)
- MAE  (Mean Absolute Error)
- MSE  (Mean Squared Error)
- RMSE (Root Mean Squared Error)
- R² Score (Coefficient of Determination)
- Feature Importance extraction (Random Forest MDI & Linear Regression coefficients)

Saves serialization artifacts to models/ directory.
"""

import os
import json
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, 'datasets', 'salary_dataset.csv')
MODELS_DIR = os.path.join(BASE_DIR, 'models')

def train_and_evaluate():
    print("=" * 70)
    print("🚀 SUBJECT 1: TRAINING SALARY PREDICTION REGRESSION MODELS WITH 5-FOLD CV")
    print("=" * 70)

    os.makedirs(MODELS_DIR, exist_ok=True)

    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at: {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)
    print(f" Loaded dataset with {len(df)} samples across {df.shape[1]} features.")

    # Features and Target
    feature_cols = [
        'experience_years',
        'education_level',
        'job_role',
        'technical_skills_count',
        'location',
        'company_size'
    ]
    target_col = 'salary_inr'

    X = df[feature_cols]
    y = df[target_col]

    # Preprocessing Pipeline
    numeric_features = ['experience_years', 'technical_skills_count']
    categorical_features = ['education_level', 'job_role', 'location', 'company_size']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
        ]
    )

    # 80/20 Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )

    print(f" Training samples: {len(X_train)} | Test verification samples: {len(X_test)}")

    # -------------------------------------------------------------------------
    # MODEL 1: Linear Regression
    # -------------------------------------------------------------------------
    lr_pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', LinearRegression())
    ])

    print("\n Fitting Model 1: Linear Regression...")
    lr_pipeline.fit(X_train, y_train)
    y_pred_lr = lr_pipeline.predict(X_test)

    # Evaluation Metrics: Linear Regression
    mae_lr = mean_absolute_error(y_test, y_pred_lr)
    mse_lr = mean_squared_error(y_test, y_pred_lr)
    rmse_lr = np.sqrt(mse_lr)
    r2_lr = r2_score(y_test, y_pred_lr)

    # 5-Fold Cross Validation for Linear Regression
    cv = KFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores_lr = cross_val_score(lr_pipeline, X, y, cv=cv, scoring='r2')

    # -------------------------------------------------------------------------
    # MODEL 2: Random Forest Regressor
    # -------------------------------------------------------------------------
    rf_pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(
            n_estimators=100,
            max_depth=12,
            min_samples_split=4,
            random_state=42,
            n_jobs=1
        ))
    ])

    print(" Fitting Model 2: Random Forest Regressor (Ensemble of 100 trees)...")
    rf_pipeline.fit(X_train, y_train)
    y_pred_rf = rf_pipeline.predict(X_test)

    # Evaluation Metrics: Random Forest
    mae_rf = mean_absolute_error(y_test, y_pred_rf)
    mse_rf = mean_squared_error(y_test, y_pred_rf)
    rmse_rf = np.sqrt(mse_rf)
    r2_rf = r2_score(y_test, y_pred_rf)

    # 5-Fold Cross Validation for Random Forest
    cv_scores_rf = cross_val_score(rf_pipeline, X, y, cv=cv, scoring='r2')

    # -------------------------------------------------------------------------
    # Feature Importance Extraction
    # -------------------------------------------------------------------------
    feature_names = rf_pipeline.named_steps['preprocessor'].get_feature_names_out()
    rf_importances = rf_pipeline.named_steps['regressor'].feature_importances_

    feature_importance_list = []
    for name, imp in zip(feature_names, rf_importances):
        clean_name = name.replace('cat__', '').replace('num__', '')
        feature_importance_list.append({
            'feature': clean_name,
            'importance': round(float(imp), 4),
            'importance_percentage': round(float(imp * 100), 2)
        })

    feature_importance_list.sort(key=lambda x: x['importance'], reverse=True)

    # Grouped feature importances by domain
    grouped_importance = {
        'Experience (Years)': round(float(sum(f['importance'] for f in feature_importance_list if 'experience_years' in f['feature'])), 4),
        'Job Role / Domain': round(float(sum(f['importance'] for f in feature_importance_list if 'job_role' in f['feature'])), 4),
        'Education Level': round(float(sum(f['importance'] for f in feature_importance_list if 'education_level' in f['feature'])), 4),
        'Location / Tier': round(float(sum(f['importance'] for f in feature_importance_list if 'location' in f['feature'])), 4),
        'Company Size': round(float(sum(f['importance'] for f in feature_importance_list if 'company_size' in f['feature'])), 4),
        'Skills Count': round(float(sum(f['importance'] for f in feature_importance_list if 'technical_skills_count' in f['feature'])), 4),
    }

    # -------------------------------------------------------------------------
    # Comparative Metrics Summary
    # -------------------------------------------------------------------------
    metrics_summary = {
        'training_samples': len(X_train),
        'test_samples': len(X_test),
        'k_fold_cv_splits': 5,
        'linear_regression': {
            'model_name': 'Linear Regression (OLS)',
            'mae': round(float(mae_lr), 2),
            'mse': round(float(mse_lr), 2),
            'rmse': round(float(rmse_lr), 2),
            'r2_score': round(float(r2_lr), 4),
            'r2_percentage': round(float(r2_lr * 100), 2),
            'cv_r2_scores': [round(float(s), 4) for s in cv_scores_lr],
            'cv_r2_mean': round(float(np.mean(cv_scores_lr)), 4),
            'cv_r2_std': round(float(np.std(cv_scores_lr)), 4),
        },
        'random_forest': {
            'model_name': 'Random Forest Regressor (100 Trees Ensemble)',
            'mae': round(float(mae_rf), 2),
            'mse': round(float(mse_rf), 2),
            'rmse': round(float(rmse_rf), 2),
            'r2_score': round(float(r2_rf), 4),
            'r2_percentage': round(float(r2_rf * 100), 2),
            'cv_r2_scores': [round(float(s), 4) for s in cv_scores_rf],
            'cv_r2_mean': round(float(np.mean(cv_scores_rf)), 4),
            'cv_r2_std': round(float(np.std(cv_scores_rf)), 4),
        },
        'feature_importances': {
            'top_individual_features': feature_importance_list[:10],
            'grouped_by_domain': grouped_importance
        },
        'best_performing_model': 'Random Forest Regressor' if r2_rf > r2_lr else 'Linear Regression',
        'r2_delta': round(float(abs(r2_rf - r2_lr)), 4),
    }

    print("\n" + "=" * 70)
    print("📊 COMPARATIVE MODEL EVALUATION SUMMARY WITH 5-FOLD CV")
    print("=" * 70)
    print(f" Metric            | Linear Regression       | Random Forest Regressor")
    print("-" * 70)
    print(f" MAE (INR)         | ₹{mae_lr:18,.2f} | ₹{mae_rf:18,.2f}")
    print(f" MSE               | {mse_lr:19,.2f} | {mse_rf:19,.2f}")
    print(f" RMSE (INR)        | ₹{rmse_lr:18,.2f} | ₹{rmse_rf:18,.2f}")
    print(f" R² (Holdout Test) | {r2_lr:19.4f} | {r2_rf:19.4f}")
    print(f" 5-Fold CV Mean R² | {np.mean(cv_scores_lr):19.4f} | {np.mean(cv_scores_rf):19.4f}")
    print(f" 5-Fold CV Std Dev | ±{np.std(cv_scores_lr):18.4f} | ±{np.std(cv_scores_rf):18.4f}")
    print("=" * 70)

    # -------------------------------------------------------------------------
    # Persist Artifacts
    # -------------------------------------------------------------------------
    lr_file = os.path.join(MODELS_DIR, 'salary_lr_pipeline.joblib')
    rf_file = os.path.join(MODELS_DIR, 'salary_rf_pipeline.joblib')
    metrics_file = os.path.join(MODELS_DIR, 'model_metrics.json')

    joblib.dump(lr_pipeline, lr_file)
    joblib.dump(rf_pipeline, rf_file)

    with open(metrics_file, 'w', encoding='utf-8') as f:
        json.dump(metrics_summary, f, indent=4)

    print(f" Saved Linear Regression Pipeline: {lr_file}")
    print(f" Saved Random Forest Pipeline:     {rf_file}")
    print(f" Saved Metrics Metadata:           {metrics_file}")
    print("=" * 70)

    return metrics_summary

if __name__ == '__main__':
    train_and_evaluate()
