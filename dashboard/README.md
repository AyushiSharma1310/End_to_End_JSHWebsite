# Jal Shakti Hackathon - Python Plotly Dash Dashboard

A PowerBI-like admin dashboard built with Python, Plotly, and Dash for visualizing hackathon registration analytics.

## Features

✨ **Interactive Visualizations**
- KPI Cards: Real-time metrics (Total Participants, Completed, In Progress, Teams)
- Bar Charts: Registration progress by step
- Pie Charts: Distribution of participants across registration steps
- Gantt Timeline: Visual representation of registration flow
- Heatmaps: Step distribution analysis
- Summary Tables: Detailed breakdown with percentages

🎨 **PowerBI-like Experience**
- Modern, responsive Bootstrap design
- Interactive hover tooltips and data exploration
- Color-coded visualizations for easy interpretation
- Mobile-responsive layout

🔌 **Backend Integration**
- Connects to existing Node.js backend API
- Fetches real-time dashboard data
- Authentication-ready for future enhancements

## Installation

### Prerequisites
- Python 3.8 or higher
- Node.js backend running on `http://localhost:5000`

### Setup Steps

1. **Navigate to dashboard directory:**
   ```bash
   cd c:\Projects\End_to_End_JSHWebsite\dashboard
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Ensure Node.js backend is running:**
   ```bash
   cd c:\Projects\End_to_End_JSHWebsite\server
   npm start
   ```

5. **Run the Dash application:**
   ```bash
   python app.py
   ```

6. **Open in browser:**
   Navigate to `http://localhost:8050`

## Usage

1. **Enter Username:** Provide an admin username (owner or admin account)
2. **Click "Load Dashboard":** Fetches data from the backend
3. **View Analytics:** Explore various visualizations
4. **Interact:** Hover over charts for detailed information
5. **Download:** Right-click on any chart to download as PNG

## Dashboard Components

### KPI Cards
- **Total Participants:** Overall hackathon registrations
- **Completed:** Users who completed all registration steps
- **In Progress:** Users still filling out forms
- **Teams Registered:** Number of teams formed

### Bar Chart
Shows the number of participants at each registration step with interactive legend.

### Pie Chart
Displays the percentage distribution across all registration stages.

### Gantt Timeline
Visual timeline representation of participant flow through registration steps.

### Heatmap
Color-intensity based visualization of participant distribution.

### Summary Table
Tabular view with step names, participant counts, and percentages.

## Customization

### Update Backend URL
Edit the `BACKEND_URL` variable in `app.py`:
```python
BACKEND_URL = "http://localhost:5000"
```

### Modify Colors
Update the color schemes in the chart creation functions:
```python
marker_color=['#0d6efd', '#0dcaf0', '#198754', '#ffc107', '#6f42c1']
```

### Change Port
Run on a different port:
```bash
python app.py  # Edit app.run_server(port=8050) in main
```

## Project Structure

```
dashboard/
├── app.py              # Main Dash application
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## Dependencies

- **dash**: Interactive web application framework
- **plotly**: Data visualization library
- **pandas**: Data manipulation and analysis
- **requests**: HTTP library for API calls
- **dash-bootstrap-components**: Bootstrap styling
- **python-dateutil**: Date utilities

## API Endpoints Used

### `/admin/dashboard?username={username}`
**Method:** GET  
**Returns:** Dashboard data including:
- `totalParticipants`: Total registration count
- `registrationStats`: Array of step-wise statistics
- `recentRegistrations`: Array of recent registrations

## Troubleshooting

### Port Already in Use
If port 8050 is already in use, modify the port in `app.py`:
```python
app.run_server(debug=True, port=8051)
```

### Backend Connection Error
Ensure the Node.js server is running on `http://localhost:5000`:
```bash
cd server
npm start
```

### Module Import Error
Reinstall requirements:
```bash
pip install -r requirements.txt --force-reinstall
```

## Future Enhancements

- [ ] Real-time data updates with WebSockets
- [ ] Export to PDF/Excel functionality
- [ ] Date range filtering
- [ ] Team analytics and performance metrics
- [ ] Email notifications
- [ ] User management interface
- [ ] Advanced filtering and search
- [ ] Custom dashboard builder

## License

This project is part of the Jal Shakti Hackathon 2026 system.

## Support

For issues or questions, please contact the admin team.

---

**Dashboard URL:** `http://localhost:8050`  
**Backend API:** `http://localhost:5000`  
**React Dashboard:** `http://localhost:5175`
