import pandas as pd
import numpy as np
from typing import List
from sklearn.linear_model import LinearRegression

def load_data(file_path: str) -> pd.DataFrame:
    """Load data from a CSV file into a DataFrame."""
    try:
        df = pd.read_csv(file_path)
        df.columns = [col.replace(' ', '_').lower() for col in df.columns]
        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        return pd.DataFrame()
    
def get_features(df: pd.DataFrame) -> List[str]:
    return list(df.columns)
    
def five_number_summary(df: pd.DataFrame) -> pd.DataFrame:
    """Generate a five-number summary for each column in the DataFrame."""
    summary = df.describe().T[['min', '25%', '50%', '75%', 'max']]
    summary.columns = ['Min', 'Q1', 'Median', 'Q3', 'Max']
    return summary.reset_index().rename(columns={'index': 'Feature'})

def correlation_matrix(df: pd.DataFrame) -> pd.DataFrame:
    """Generate a correlation matrix for the DataFrame."""
    numeric_df = df.select_dtypes(include=['int64', 'float64'])
    corr = numeric_df.corr()
    return corr.reset_index().rename(columns={'index': 'Feature'})

def missing_values_summary(df: pd.DataFrame) -> pd.DataFrame:
    """Generate a summary of missing values in the DataFrame."""
    missing_values = df.isnull().sum()
    missing_summary = pd.DataFrame(missing_values, columns=['MissingValues'])
    missing_summary['Percentage'] = (missing_summary['MissingValues'] / len(df)) * 100
    return missing_summary.reset_index().rename(columns={'index': 'Feature'})

def data_types_summary(df: pd.DataFrame) -> pd.DataFrame:
    """Generate a summary of data types in the DataFrame."""
    data_types = df.dtypes.reset_index()
    data_types.columns = ['Feature', 'Data Type']
    return data_types


def unique_values_summary(df: pd.DataFrame) -> pd.DataFrame:
    """Generate a summary of unique values in the DataFrame."""
    unique_values = df.nunique()
    unique_summary = pd.DataFrame(unique_values, columns=['Unique Values'])
    return unique_summary.reset_index().rename(columns={'index': 'Feature'})

def categorical_summary(df: pd.DataFrame) -> pd.DataFrame:
    """Generate a summary of categorical features in the DataFrame."""
    categorical_features = df.select_dtypes(include=['object', 'category']).columns
    categorical_summary = pd.DataFrame(columns=['Feature', 'Unique Values'])
    
    for feature in categorical_features:
        unique_values = df[feature].unique()
        categorical_summary = categorical_summary.append({'Feature': feature, 'Unique Values': unique_values}, ignore_index=True)
    
    return categorical_summary

def numerical_summary(df: pd.DataFrame) -> pd.DataFrame:
    """Generate a summary of numerical features in the DataFrame."""
    numerical_features = df.select_dtypes(include=['int64', 'float64']).columns
    numerical_summary = pd.DataFrame(columns=['Feature', 'Mean', 'Std', 'Min', 'Max'])
    
    for feature in numerical_features:
        mean = df[feature].mean()
        std = df[feature].std()
        min_val = df[feature].min()
        max_val = df[feature].max()
        numerical_summary = numerical_summary.append({'Feature': feature, 'Mean': mean, 'Std': std, 'Min': min_val, 'Max': max_val}, ignore_index=True)
    
    return numerical_summary

def generate_feature_analysis_data(df, feature):
    series = df[feature]

    result = pd.DataFrame({
        'distinct': [series.nunique()],
        'distinct_percent': [f"{series.nunique() / len(series) * 100:.2f}%"],
        'missing': [series.isna().sum()],
        'missing_percent': [f"{series.isna().sum() / len(series) * 100:.2f}%"]
    })

    if np.issubdtype(series.dtype, np.number):
        stats = pd.DataFrame({
            'minimum': [series.min()],
            'q1': [series.quantile(0.25)],
            'median': [series.median()],
            'q3': [series.quantile(0.75)],
            'maximum': [series.max()],
            'mean': [series.mean()]
        })

        result = pd.concat([result, stats], axis=1)

    return result

def extra_meta_data(df: pd.DataFrame) -> pd.DataFrame:
    numerical_features = df.select_dtypes(include=['int64', 'float64']).columns
    categorical_features = df.select_dtypes(exclude=['int64', 'float64']).columns

    result = pd.DataFrame(data={
        'number_rows': len(df),
        'num_categorial_features': len(categorical_features),
        'num_numerical_features': len(numerical_features)
    })

    return result

def get_feature_data_method(df: pd.DataFrame, feature: str, data: str) -> pd.DataFrame:
    if data == 'unique':
        result = pd.DataFrame(df[feature].value_counts())
        return result
    
    elif data == 'missing':
        missing_count = df[feature].isna().sum()
        not_missing_count = df[feature].notna().sum()
        result = {"missing": int(missing_count), "not_missing": int(not_missing_count)}
        return result
    

def run_linear_regression(df: pd.DataFrame, label: str) -> int:
    df.columns = map(str.lower, df.columns)
    df.columns = [col.replace(' ', '_') for col in df.columns]
    
    label = label.strip()
    X = df.copy()[df.select_dtypes(include=['int64', 'float64']).columns]
    y = X.pop(label)
    
    reg = LinearRegression().fit(X,y)

    return reg.score(X, y)