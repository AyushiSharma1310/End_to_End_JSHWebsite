import os
import dash
import json
from dash import dcc, html, Input, Output, State
import plotly.graph_objects as go
import pandas as pd
import requests
import dash_bootstrap_components as dbc
import flask
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])
server = Flask(__name__)
CORS(server)

load_dotenv()

# =========================
# CONFIG
# =========================
BACKEND_URL = "http://localhost:5000"
CLIENT_APP_URL = os.getenv("CLIENT_APP_URL", "http://localhost:5173")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    print("Groq error:", response.text)
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

# =========================
# DASH APP INIT (ONLY ONCE)
# =========================



# =========================
# GROQ CHAT ENDPOINT (ONLY ONCE)
# =========================
@server.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        # ✅ SAFETY: handle empty body
        if not data or "message" not in data:
            return jsonify({"reply": "No message received"}), 400

        user_msg = data["message"].strip()

        if not user_msg:
            return jsonify({"reply": "Empty message"}), 400

        # ✅ DEBUG LOG (helps you see request in terminal)
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
                    "content": "You are an AI assistant inside a government hackathon dashboard. Be helpful, professional, and concise."
                },
                {
                    "role": "user",
                    "content": user_msg
                }
            ],
            "temperature": 0.7   # ✅ optional but recommended
        }

        response = requests.post(
            GROQ_URL,
            json=payload,
            headers=headers,
            timeout=30
        )

        # ✅ HANDLE API FAILURE CLEANLY
        if response.status_code != 200:
            print("Groq error:", response.text)
            return jsonify({
                "reply": "⚠️ AI service temporarily unavailable. Please try again."
            }), 500

        result = response.json()

        # ✅ SAFE PARSING (prevents crash if structure changes)
        reply = (
            result.get("choices", [{}])[0]
            .get("message", {})
            .get("content", "No response from AI")
        )

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
    try:
        if not ADMIN_USERNAME:
            return None

        r = requests.get(f"{BACKEND_URL}/admin/dashboard?username={ADMIN_USERNAME}")
        if r.status_code == 200:
            data = r.json()
            return data.get("data") if data.get("success") else None
    except:
        return None
    return None


def fetch_user_profile(username):
    try:
        r = requests.get(f"{BACKEND_URL}/user/profile?username={username}")
        if r.status_code == 200:
            data = r.json()
            return data.get("user") if data.get("success") else None
    except:
        return None
    return None


# =========================
# UI HELPERS
# =========================
def create_kpi_card(title, value, color="primary"):
    return dbc.Card(
        dbc.CardBody([
            html.H6(title, className="text-muted"),
            html.H3(value, className=f"text-{color}")
        ]),
        className="shadow-sm"
    )


def create_registration_bar_chart(stats):
    if not stats:
        return go.Figure()

    df = pd.DataFrame(stats)
    return go.Figure(data=[go.Bar(x=df["registration_step"], y=df["count"])])


def create_registration_pie_chart(stats):
    if not stats:
        return go.Figure()

    df = pd.DataFrame(stats)
    return go.Figure(data=[go.Pie(labels=df["registration_step"], values=df["count"])])


def create_gantt_chart(stats):
    if not stats:
        return go.Figure()

    df = pd.DataFrame(stats)
    return go.Figure(data=[go.Bar(x=df["count"], y=df["registration_step"], orientation="h")])


def create_heatmap(stats):
    if not stats:
        return go.Figure()

    df = pd.DataFrame(stats)
    return go.Figure(data=go.Heatmap(z=[df["count"].values]))


# =========================
# LAYOUT
# =========================
app.layout = dbc.Container([
    dbc.Row([
        dbc.Col([
            html.H4("Filters"),
            dbc.Input(id="username-input", placeholder="Enter username"),
            dbc.Button("Load Dashboard", id="load-btn", color="primary"),
            html.Div(id="download-help")
        ], width=2),

        dbc.Col([
            html.H2("Dashboard"),

            dbc.Row([html.Div(id="kpi-container")]),

            dbc.Row([
                dbc.Col(dcc.Graph(id="bar-chart")),
                dbc.Col(dcc.Graph(id="pie-chart")),
            ]),

            dbc.Row([
                dbc.Col(dcc.Graph(id="gantt-chart")),
                dbc.Col(dcc.Graph(id="heatmap-chart")),
            ]),

            html.Div(id="summary-table")
        ], width=10)
    ]),

    dcc.Store(id="dashboard-data-store")
], fluid=True)


# =========================
# CALLBACK
# =========================
@app.callback(
    [
        Output("dashboard-data-store", "data"),
        Output("kpi-container", "children"),
        Output("bar-chart", "figure"),
        Output("pie-chart", "figure"),
        Output("gantt-chart", "figure"),
        Output("heatmap-chart", "figure"),
        Output("summary-table", "children"),
    ],
    Input("load-btn", "n_clicks"),
    State("username-input", "value"),
    prevent_initial_call=True
)
def update_dashboard(n, username):

    if not username:
        return None, "Enter username", {}, {}, {}, {}, ""

    user = fetch_user_profile(username)
    if not user:
        return None, "User not found", {}, {}, {}, {}, ""

    data = fetch_dashboard_data() or {
        "totalParticipants": 0,
        "registrationStats": [],
        "recentRegistrations": []
    }

    stats = data["registrationStats"]

    kpis = dbc.Row([
        dbc.Col(create_kpi_card("Total", data["totalParticipants"])),
        dbc.Col(create_kpi_card("Completed", sum(s["count"] for s in stats if s["registration_step"] == "completed"))),
        dbc.Col(create_kpi_card("In Progress", sum(s["count"] for s in stats if s["registration_step"] != "completed"))),
    ])

    table = pd.DataFrame(stats)
    table_ui = dbc.Table.from_dataframe(table) if not table.empty else "No data"

    return (
        data,
        kpis,
        create_registration_bar_chart(stats),
        create_registration_pie_chart(stats),
        create_gantt_chart(stats),
        create_heatmap(stats),
        table_ui
    )


# =========================
# RUN
# =========================
if __name__ == "__main__":
     server.run(host="0.0.0.0", port=8050, debug=True)