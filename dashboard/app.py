import dash
from dash import dcc, html, Input, Output, State
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import requests
from datetime import datetime
import dash_bootstrap_components as dbc

# Initialize Dash app with Bootstrap theme
app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])

# Backend API endpoint
BACKEND_URL = "http://localhost:5000"

def fetch_dashboard_data(username):
    """Fetch dashboard data from backend"""
    try:
        response = requests.get(f"{BACKEND_URL}/admin/dashboard?username={username}")
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                return data.get("data")
    except Exception as e:
        print(f"Error fetching data: {e}")
    return None

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
    
    fig = go.Figure(data=go.Heatmap(
        z=[df["count"].values],
        x=["Step 1", "Step 2", "Step 3", "Step 4", "Completed"][:len(df)],
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

                dbc.Button("Load Dashboard", id="load-btn", color="primary", className="w-100 mb-4"),

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
     Output("summary-table", "children")],
    Input("load-btn", "n_clicks"),
    State("username-input", "value"),
    prevent_initial_call=True
)
def update_dashboard(n_clicks, username):
    """Update all dashboard components"""
    if not username:
        return None, "Please enter a username", {}, {}, {}, {}, ""
    
    # Fetch data
    data = fetch_dashboard_data(username)
    
    if not data:
        return None, "No data found or error loading data", {}, {}, {}, {}, ""
    
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
    
    return data, kpi_cards, bar_fig, pie_fig, gantt_fig, heatmap_fig, summary_table

# Run app
if __name__ == "__main__":
    print("🚀 Starting Dash Dashboard on http://localhost:8050")
    print("📊 Admin Dashboard: http://localhost:8050")
    app.run_server(debug=True, port=8050)
