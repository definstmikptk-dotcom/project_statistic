from flask import Flask, render_template, jsonify
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
DATA_FILE = os.path.join(os.path.dirname(__file__), "latihan1.csv")

def load_data():
    return pd.read_csv(DATA_FILE)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/data")
def api_data():
    df = load_data()
    numeric = df.select_dtypes(include=np.number).drop(columns=["Student_ID"], errors="ignore")

    stats = []
    for col in numeric.columns:
        s = numeric[col].dropna()
        stats.append({
            "variable": col,
            "mean": round(float(s.mean()), 3),
            "median": round(float(s.median()), 3),
            "std": round(float(s.std()), 3),
            "min": round(float(s.min()), 3),
            "max": round(float(s.max()), 3)
        })

    corr = numeric.corr().round(3).fillna(0).to_dict()
    gender = df["Gender"].value_counts().to_dict() if "Gender" in df.columns else {}

    # Distribution of exam scores
    bins = [0, 50, 60, 70, 80, 90, 101]
    labels = ["<50", "50–59", "60–69", "70–79", "80–89", "90–100"]
    exam_dist = pd.cut(df["Exam_Score"], bins=bins, labels=labels, right=False).value_counts().reindex(labels, fill_value=0)

    # Practical indicators
    decisions = {
        "exam_mean": round(float(df["Exam_Score"].mean()), 2),
        "attendance_mean": round(float(df["Attendance"].mean()), 2),
        "study_mean": round(float(df["Study_Hours"].mean()), 2),
        "screen_mean": round(float(df["Screen_Hours"].mean()), 2),
        "sleep_mean": round(float(df["Sleep_Hours"].mean()), 2),
        "satisfaction_mean": round(float(df["Satisfaction"].mean()), 2),
        "high_score_pct": round(float((df["Exam_Score"] >= 80).mean() * 100), 1),
        "low_score_pct": round(float((df["Exam_Score"] < 60).mean() * 100), 1),
        "high_attendance_pct": round(float((df["Attendance"] >= 85).mean() * 100), 1),
        "low_attendance_pct": round(float((df["Attendance"] < 75).mean() * 100), 1),
    }

    return jsonify({
        "rows": int(len(df)),
        "columns": list(df.columns),
        "stats": stats,
        "gender": gender,
        "exam_distribution": {"labels": labels, "values": [int(x) for x in exam_dist.values]},
        "correlation": corr,
        "decisions": decisions,
        "preview": df.head(8).to_dict(orient="records")
    })

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
