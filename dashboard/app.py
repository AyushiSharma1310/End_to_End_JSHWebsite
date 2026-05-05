import os
import dash
import json
from dash import dcc, html, Input, Output, State
import plotly.graph_objects as go
import pandas as pd
import requests
import dash_bootstrap_components as dbc
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

from flask import request, jsonify

# =========================
# LOAD ENV
# =========================
load_dotenv()

# =========================
# FLASK SERVER (MAIN)
# =========================
server = Flask(__name__)
CORS(server)

import psycopg2

conn = psycopg2.connect(
    dbname="hackathon2026_27",
    user="postgres",
    password="JSHS2026",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

from werkzeug.security import check_password_hash, generate_password_hash

# =========================
# USERNAME GENERATOR
# =========================
def generate_username():
    cursor.execute("SELECT COALESCE(MAX(id), 0) FROM participant_registrations")
    count = cursor.fetchone()[0] + 1
    return f"jsh26{str(count).zfill(5)}"


# =========================
# REGISTER API
# =========================
@server.route("/register", methods=["POST"])
def register():
    try:
        data = request.json

        # Basic validation
        required_fields = ["name", "email", "password", "mobile"]
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"{field} is required"}), 400

        # Generate username
        username = generate_username()

        # Hash password
        hashed_password = generate_password_hash(data["password"])

        # Insert into DB
        cursor.execute("""
            INSERT INTO participant_registrations (
                name, email, username, password, mobile,
                gender, state, district, city, pincode,
                category, organization, organization_address,
                project_investigator_name, project_investigator_designation,
                partner_organization, partner_address,
                partner_investigator_name, partner_investigator_email, partner_investigator_mobile,
                proposal_title, problem_statement, additional_info,
                team_name, team_members
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s)
        """, (
            data["name"], data["email"], username, hashed_password, data["mobile"],
            data.get("gender"), data.get("state"), data.get("district"), data.get("city"), data.get("pincode"),
            data.get("category"), data.get("organization"), data.get("organization_address"),
            data.get("project_investigator_name"), data.get("project_investigator_designation"),
            data.get("partner_organization"), data.get("partner_address"),
            data.get("partner_investigator_name"), data.get("partner_investigator_email"), data.get("partner_investigator_mobile"),
            data.get("proposal_title"), data.get("problem_statement"), data.get("additional_info"),
            data.get("team_name"), data.get("team_members")
        ))

        conn.commit()

        return jsonify({
            "message": "Registered successfully",
            "username": username
        }), 201

    except Exception as e:
        print("Register Error:", str(e))
        return jsonify({"error": "Server error"}), 500


# =========================
# LOGIN API
# =========================
@server.route("/login", methods=["POST"])
def login():
    try:
        data = request.json

        # Validate input
        if "username" not in data or "password" not in data:
            return jsonify({"error": "Username and password required"}), 400

        # Fetch user
        cursor.execute("""
            SELECT username, password 
            FROM participant_registrations 
            WHERE username = %s
        """, (data["username"],))

        user = cursor.fetchone()

        # Check password
        if user and check_password_hash(user[1], data["password"]):
            return jsonify({
                "message": "Login successful",
                "username": user[0]
            }), 200

        return jsonify({"error": "Invalid credentials"}), 401

    except Exception as e:
        print("Login Error:", str(e))
        return jsonify({"error": "Server error"}), 500
# =========================
# DASH APP (MOUNTED ON FLASK)
# =========================
app = dash.Dash(
    __name__,
    server=server,
    url_base_pathname="/dashboard/",
    external_stylesheets=[dbc.themes.BOOTSTRAP]
)

# =========================
# CONFIG
# =========================
BACKEND_URL = "http://localhost:5000"
CLIENT_APP_URL = os.getenv("CLIENT_APP_URL", "http://localhost:5173")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

if not GROQ_API_KEY:
    print("⚠️ GROQ_API_KEY not found in .env")

# =========================
# CHAT API
# =========================
@server.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        if not data or "message" not in data:
            return jsonify({"reply": "No message received"}), 400

        user_msg = data["message"].strip()

        if not user_msg:
            return jsonify({"reply": "Empty message"}), 400

        print("User message:", user_msg)

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {
                    "role": "system",
                    "content": """
You are an AI assistant for a government hackathon dashboard.

FORMAT RULES:
- Use proper markdown
- Add spacing between paragraphs
- Use bullet points and numbered lists properly
- Keep answers clean and readable
"""
                },
                {"role": "user", "content": user_msg}
            ],
            "temperature": 0.7
        }

        response = requests.post(
            GROQ_URL,
            json=payload,
            headers=headers,
            timeout=30
        )

        if response.status_code != 200:
            print("Groq error:", response.text)
            return jsonify({
                "reply": "⚠️ AI service temporarily unavailable. Please try again."
            }), 500

        result = response.json()

        reply = (
            result.get("choices", [{}])[0]
            .get("message", {})
            .get("content", "No response from AI")
        ).strip()

        return jsonify({"reply": reply})

    except requests.exceptions.Timeout:
        return jsonify({
            "reply": "⏳ Server timeout. Please try again."
        }), 500

    except Exception as e:
        print("Server error:", str(e))
        return jsonify({
            "reply": "⚠️ Internal server error"
        }), 500


# =========================
# DATA FUNCTIONS
# =========================
def fetch_dashboard_data():
    """Fetch dashboard data from backend"""
    try:
        if not ADMIN_USERNAME:
            print("❌ ADMIN_USERNAME missing")
            return None
        response = requests.get(f"{BACKEND_URL}/admin/dashboard?username={ADMIN_USERNAME}")
        print("STATUS:", response.status_code)
        print("DATA:", response.text)

        if response.status_code == 200:
            data = response.json()
            print("API Response",data)
            if data.get("success"):
                return data.get("data")
    except Exception as e:
        print(f"Error fetching data: {e}")
    return None


def fetch_user_profile(target_username):
    """Verify the target user exists in DB"""
    try:
        response = requests.get(f"{BACKEND_URL}/user/profile?username={target_username}")
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                return data.get("user")
    except Exception as e:
        print(f"Error fetching user profile: {e}")
    return None


# =========================
# UI HELPERS
# =========================
def create_kpi_card(title, value, color="primary"):
    """Create a KPI card component"""
    return dbc.Card(
        dbc.CardBody([
            html.H6(title, className="card-title text-muted"),
            html.H3(value, className=f"text-{color} fw-bold")
        ]),
        className="shadow-sm"
    )


def create_registration_bar_chart(registration_stats):
    """Create bar chart for registration progress"""
    if not registration_stats:
        return go.Figure()
    
    df = pd.DataFrame(registration_stats)

    # ✅ Debug
    print("RAW DATA:", registration_stats)
    print("DF HEAD:\n", df.head())
    print("COLUMNS:", df.columns)

    # ✅ Safety checks
    if df.empty:
        print("⚠️ Empty DataFrame")
        return go.Figure()

    # ✅ Fix column naming issues
    if "registrationStep" in df.columns:
        df.rename(columns={"registrationStep": "registration_step"}, inplace=True)

    # ✅ CRITICAL FIX (TYPE ISSUE)
    df["registration_step"] = df["registration_step"].astype(str)

    # ✅ Ensure count exists
    if "count" not in df.columns:
        print("❌ 'count' column missing")
        return go.Figure()
    step_labels = {
        "1": "Step 1", "2": "Step 2", "3": "Step 3",
        "4": "Step 4", "completed": "Completed"
    }
    df["step_name"] = df["registration_step"].map(step_labels)
    
    fig = go.Figure(data=[
        go.Bar(
            x=df["step_name"],
            y=df["count"],
            marker_color=['#0d6efd', '#0dcaf0', '#198754', '#ffc107', '#6f42c1'],
            text=df["count"],
            textposition="outside",
            hovertemplate="<b>%{x}</b><br>Participants: %{y}<extra></extra>"
        )
    ])
    
    fig.update_layout(
        title="Registration Progress by Step",
        xaxis_title="Registration Step",
        yaxis_title="Number of Participants",
        hovermode="x unified",
        template="plotly_white",
        height=400
    )
    return fig

def create_registration_pie_chart(registration_stats):
    """Create pie chart for registration distribution"""
    if not registration_stats:
        return go.Figure()
    
    df = pd.DataFrame(registration_stats)
    step_labels = {
        "1": "Step 1", "2": "Step 2", "3": "Step 3",
        "4": "Step 4", "completed": "Completed"
    }
    df["step_name"] = df["registration_step"].map(step_labels)
    
    fig = go.Figure(data=[
        go.Pie(
            labels=df["step_name"],
            values=df["count"],
            marker=dict(colors=['#0d6efd', '#0dcaf0', '#198754', '#ffc107', '#6f42c1']),
            hovertemplate="<b>%{label}</b><br>Participants: %{value}<br>Percentage: %{percent}<extra></extra>"
        )
    ])
    
    fig.update_layout(
        title="Registration Distribution",
        height=400,
        template="plotly_white"
    )
    return fig

def create_gantt_chart(registration_stats):
    """Create Gantt chart timeline for registration progress"""
    if not registration_stats:
        return go.Figure()
    
    df = pd.DataFrame(registration_stats)
    step_labels = {
        "1": "Step 1: Basic Info",
        "2": "Step 2: Details",
        "3": "Step 3: Team",
        "4": "Step 4: Submission",
        "completed": "Completed"
    }
    
    df["step_name"] = df["registration_step"].map(step_labels)
    
    # Create timeline data
    task_data = []
    for idx, row in df.iterrows():
        task_data.append({
            "Task": row["step_name"],
            "Start": "2026-01-01",
            "End": "2026-12-31",
            "Participants": row["count"]
        })
    
    timeline_df = pd.DataFrame(task_data)
    
    # Create a custom bar chart as timeline
    fig = go.Figure()
    
    for idx, row in timeline_df.iterrows():
        fig.add_trace(go.Bar(
            y=[row["Task"]],
            x=[row["Participants"]],
            orientation='h',
            name=row["Task"],
            text=f"{row['Participants']} participants",
            textposition='outside',
            marker=dict(color=['#0d6efd', '#0dcaf0', '#198754', '#ffc107', '#6f42c1'][idx])
        ))
    
    fig.update_layout(
        title="Registration Timeline Progress",
        xaxis_title="Number of Participants",
        showlegend=False,
        height=400,
        template="plotly_white",
        hovermode="y unified"
    )
    return fig


def create_heatmap(registration_stats):
    """Create heatmap for registration step distribution"""
    if not registration_stats or len(registration_stats) < 2:
        return go.Figure()
    
    df = pd.DataFrame(registration_stats)
    
    # Create a simple heatmap showing progression
    heatmap_data = df[["registration_step", "count"]].set_index("registration_step")
    
    
    step_labels = {
        "1": "Step 1",
        "2": "Step 2",
        "3": "Step 3",
        "4": "Step 4",
        "completed": "Completed"
    }

    df["registration_step"] = df["registration_step"].astype(str)
    df["step_name"] = df["registration_step"].map(step_labels).fillna("Unknown")

    fig = go.Figure(data=go.Heatmap(
        z=[df["count"].values],
        x=df["step_name"],   # ✅ dynamic
        y=["Participants"],
        colorscale="Blues",
        text=df["count"].values,
        texttemplate="%{text}",
        textfont={"size": 12},
        hovertemplate="<b>%{x}</b><br>Count: %{z}<extra></extra>"
    ))
    
    fig.update_layout(
        title="Registration Heatmap",
        height=250,
        template="plotly_white"
    )
    return fig
# =========================
# DASH LAYOUT
# =========================
# App Layout
app.layout = dbc.Container(
    [
        dbc.Row([
            # 🔹 Sidebar (Filters / Slicers)
            dbc.Col([
                html.H4("⚙️ Filters", className="text-primary fw-bold mb-3"),

                dbc.Label("Search Username"),
                dbc.Input(
                    id="username-input",
                    placeholder="Enter username...",
                    type="text",
                    className="mb-3"
                ),

                dbc.Button("Load Dashboard", id="load-btn", color="primary", className="w-100"),
                dbc.Button(
                    "Download User Review PDF",
                    id="download-review-btn",
                    href="#",
                    target="_blank",
                    color="success",
                    className="w-100 mt-2 mb-1",
                    disabled=True
                ),
                html.Small("Load a username to enable download.", className="text-muted d-block mb-4", id="download-help"),

                html.Hr(),

                # 🔹 Category Filter (Static for now, dynamic later if needed)
                dbc.Label("Category"),
                dcc.Dropdown(
                    options=[
                        {"label": "All", "value": "all"},
                        {"label": "Student", "value": "student"},
                        {"label": "Professional", "value": "professional"},
                    ],
                    value="all",
                    id="category-filter",
                    className="mb-3"
                ),

                # 🔹 Focus Area Filter
                dbc.Label("Focus Area"),
                dcc.Dropdown(
                    options=[
                        {"label": "Water Conservation", "value": "water"},
                        {"label": "AI Solutions", "value": "ai"},
                        {"label": "Infrastructure", "value": "infra"},
                    ],
                    value="water",
                    id="focus-filter",
                    className="mb-3"
                ),

            ], width=12, lg=2, className="bg-white p-3 shadow-sm"),

            # 🔹 Main Dashboard
            dbc.Col([
                # Header
                html.H2("📊 Jal Shakti Hackathon Admin Dashboard",
                        className="text-primary fw-bold mb-4"),

                # 🔹 KPI Cards
                dbc.Row([
                    dbc.Col(html.Div(id="kpi-container"), width=12)
                ], className="mb-4"),

                # 🔹 Categories / Focus Cards (NEW SECTION)
                dbc.Row([
                    dbc.Col(dbc.Card([
                        dbc.CardBody([
                            html.H5("💡 Categories", className="fw-bold"),
                            html.P("Student / Professional / Open Innovation")
                        ])
                    ], className="shadow-sm"), width=12, lg=6),

                    dbc.Col(dbc.Card([
                        dbc.CardBody([
                            html.H5("🎯 Focus Areas", className="fw-bold"),
                            html.P("Water, AI, Infrastructure, Sustainability")
                        ])
                    ], className="shadow-sm"), width=12, lg=6),
                ], className="mb-4"),

                # 🔹 Charts Row 1
                dbc.Row([
                    dbc.Col(dcc.Graph(id="bar-chart"), width=12, lg=6),
                    dbc.Col(dcc.Graph(id="pie-chart"), width=12, lg=6),
                ], className="mb-4"),

                # 🔹 Timeline + Heatmap
                dbc.Row([
                    dbc.Col([
                        html.H5("📅 Registration Timeline", className="fw-bold"),
                        dcc.Graph(id="gantt-chart")
                    ], width=12, lg=8),

                    dbc.Col([
                        html.H5("🔥 Activity Heatmap", className="fw-bold"),
                        dcc.Graph(id="heatmap-chart")
                    ], width=12, lg=4),
                ], className="mb-4"),

                # 🔹 Summary Table
                dbc.Row([
                    dbc.Col([
                        html.H5("📋 Summary", className="fw-bold"),
                        html.Div(id="summary-table")
                    ])
                ])

            ], width=12, lg=10)

        ]),

        # Hidden store
        dcc.Store(id="dashboard-data-store"),

    ],
    fluid=True,
    className="bg-light"
)

# Callback to load and update dashboard
@app.callback(
    [Output("dashboard-data-store", "data"),
     Output("kpi-container", "children"),
     Output("bar-chart", "figure"),
     Output("pie-chart", "figure"),
     Output("gantt-chart", "figure"),
     Output("heatmap-chart", "figure"),
     Output("summary-table", "children"),
     Output("download-review-btn", "href"),
     Output("download-review-btn", "disabled"),
     Output("download-review-btn", "title"),
     Output("download-help", "children")],
    Input("load-btn", "n_clicks"),
    State("username-input", "value"),
    prevent_initial_call=True
)
def update_dashboard(n_clicks, username):
    """Update all dashboard components"""
    if not username or not str(username).strip():
        return None, "Please enter a username", {}, {}, {}, {}, "", "#", True, "Enter a username and click Load Dashboard", "Load a username to enable download."

    cleaned_username = str(username).strip()

    # Verify target user exists
    target_user = fetch_user_profile(cleaned_username)
    if not target_user:
        return None, "No user data found for that username", {}, {}, {}, {}, "", "#", True, "User not found", "Please check the username and try again."

    # Fetch dashboard data (uses ADMIN_USERNAME for auth)
    data = fetch_dashboard_data()
    dashboard_warning = None
    if not data:
        dashboard_warning = "Dashboard data unavailable (admin auth not set)."
        data = {"totalParticipants": 0, "registrationStats": [], "recentRegistrations": []}
    
    # Extract data
    total_participants = data.get("totalParticipants", 0)
    registration_stats = data.get("registrationStats", [])
    recent_registrations = data.get("recentRegistrations", [])
    
    # Create KPI cards
    kpi_cards = dbc.Row([
        dbc.Col([
            create_kpi_card("Total Participants", total_participants, "primary")
        ], width=12, md=6, lg=3),
        dbc.Col([
            create_kpi_card("Completed", 
                          next((s["count"] for s in registration_stats if s["registration_step"] == "completed"), 0),
                          "success")
        ], width=12, md=6, lg=3),
        dbc.Col([
            create_kpi_card("In Progress", 
                          sum(s["count"] for s in registration_stats if s["registration_step"] != "completed"),
                          "warning")
        ], width=12, md=6, lg=3),
        dbc.Col([
            create_kpi_card("Teams Registered", 
                          len([r for r in recent_registrations if getattr(r, 'team_name', None)]),
                          "info")
        ], width=12, md=6, lg=3),
    ])
    
    # Create charts
    bar_fig = create_registration_bar_chart(registration_stats)
    pie_fig = create_registration_pie_chart(registration_stats)
    gantt_fig = create_gantt_chart(registration_stats)
    heatmap_fig = create_heatmap(registration_stats)
    
    # Create summary table
    table_data = []
    for stat in registration_stats:
        step_labels = {
            "1": "Step 1", "2": "Step 2", "3": "Step 3",
            "4": "Step 4", "completed": "Completed"
        }
        table_data.append({
            "Step": step_labels.get(stat["registration_step"], stat["registration_step"]),
            "Participants": stat["count"],
            "Percentage": f"{(stat['count']/total_participants*100):.1f}%" if total_participants > 0 else "0%"
        })
    
    summary_df = pd.DataFrame(table_data)
    
    summary_table = dbc.Table.from_dataframe(
        summary_df,
        striped=True,
        bordered=True,
        hover=True,
        className="shadow-sm"
    )
    
    cleaned_username = str(username).strip()
    download_href = f"{CLIENT_APP_URL}/view-submission?username={cleaned_username}"

    return (
        data,
        kpi_cards if not dashboard_warning else html.Div(
            dashboard_warning,
            className="text-warning fw-bold"
        ),
        bar_fig,
        pie_fig,
        gantt_fig,
        heatmap_fig,
        summary_table,
        download_href,
        False,
        download_href,
        f"Ready to download review PDF for {cleaned_username}."
    )

# =========================
# RUN
# =========================
if __name__ == "__main__":
    server.run(host="0.0.0.0", port=8050, debug=True)