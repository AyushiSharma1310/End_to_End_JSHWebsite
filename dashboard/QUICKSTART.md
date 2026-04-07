# Quick Start Guide - Python Plotly Dash Dashboard

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Python Dependencies
Open PowerShell and run:
```powershell
cd C:\Projects\End_to_End_JSHWebsite\dashboard
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Start Node.js Backend (if not running)
Open a new PowerShell window:
```powershell
cd C:\Projects\End_to_End_JSHWebsite\server
npm start
```

### Step 3: Start Python Dashboard
In the first PowerShell window (with venv activated):
```powershell
python app.py
```

### Step 4: Open Dashboard
Open your browser and go to:
```
http://localhost:8050
```

## 📊 What You Get

### Dashboard Views:
1. **KPI Cards** - Quick metrics at a glance
   - Total Participants
   - Completed Registrations
   - In Progress
   - Teams Registered

2. **Registration Bar Chart** - Visual breakdown by step

3. **Distribution Pie Chart** - Percentage analysis

4. **Timeline Gantt Chart** - Progress visualization

5. **Heatmap** - Intensity mapping of participants

6. **Summary Table** - Detailed tabular data

## 🔄 Running All Services

**Option 1: Separate Terminals (Recommended)**
```powershell
# Terminal 1: Backend
cd C:\Projects\End_to_End_JSHWebsite\server
npm start

# Terminal 2: Frontend (React)
cd C:\Projects\End_to_End_JSHWebsite\client
npm run dev

# Terminal 3: Dashboard (Python)
cd C:\Projects\End_to_End_JSHWebsite\dashboard
python app.py
```

**Available Endpoints:**
- React Admin Dashboard: http://localhost:5175
- Python Plotly Dashboard: http://localhost:8050
- Backend API: http://localhost:5000

## 🎯 Features

✅ PowerBI-like Interactive Visualizations  
✅ Real-time Data Fetching  
✅ Responsive Design (Mobile-Friendly)  
✅ Interactive Charts with Hover Tooltips  
✅ Download Charts as PNG  
✅ Summary Statistics  
✅ Clean Bootstrap Styling  

## 🔑 How to Use

1. **Enter Your Username:** Use an admin or owner account username
2. **Click "Load Dashboard":** Fetches live data from backend
3. **Explore:** Interact with charts (hover, zoom, pan)
4. **Export:** Right-click charts to download as PNG

## 📝 Example Credentials

To test the dashboard, you can use:
- **Admin Username:** `admin001`
- Any completed user registrations

## 🛠️ Troubleshooting

### Issue: "Connection refused at localhost:5000"
**Solution:** Ensure Node.js backend is running
```powershell
cd server
npm start
```

### Issue: "ModuleNotFoundError"
**Solution:** Reinstall dependencies
```powershell
pip install -r requirements.txt --force-reinstall
```

### Issue: "Port 8050 already in use"
**Solution:** Change port in app.py line last and run:
```powershell
python app.py
```

## 📚 File Structure

```
C:\Projects\End_to_End_JSHWebsite\
├── server/          # Node.js Backend
│   ├── index.js
│   └── package.json
├── client/          # React Frontend
│   ├── src/
│   └── package.json
└── dashboard/       # Python Plotly Dashboard (NEW)
    ├── app.py
    ├── requirements.txt
    └── README.md
```

## 💡 Tips

- **Deactivate venv:** Type `deactivate` in PowerShell
- **Multiple instances:** Use different ports (8051, 8052, etc.)
- **Debug mode:** Edit `app.py` and change `debug=False`
- **Stop server:** Press Ctrl+C in PowerShell

## 🎨 Customization

### Change Dashboard Title
Edit `app.py` line ~120:
```python
html.h1("Your Custom Title", className="mb-4 mt-4 text-primary fw-bold")
```

### Change Colors
Edit color arrays in chart functions. Available colors:
- `#0d6efd` - Blue
- `#0dcaf0` - Cyan
- `#198754` - Green
- `#ffc107` - Yellow
- `#6f42c1` - Purple

## 📧 Support

For issues or enhancements, check:
1. Backend API is running and accessible
2. Python environment is activated
3. All dependencies are installed

---

**Happy Analyzing! 📊**
