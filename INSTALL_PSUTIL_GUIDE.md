# Install psutil for Live System Metrics

## Why Install psutil?

Currently, your Maintenance section shows:
- CPU Usage: 0% (N/A - install psutil)
- Memory Usage: 0% (N/A - install psutil)
- Disk Usage: 0% (N/A - install psutil)

After installing psutil, you'll see **real-time live metrics**:
- ✅ CPU Usage: Shows actual percentage (e.g., 15.3%)
- ✅ Memory Usage: Shows actual percentage (e.g., 67.8%)
- ✅ Disk Usage: Shows actual percentage (e.g., 45.2%)
- ✅ Available Memory: Shows in GB
- ✅ Free Disk Space: Shows in GB

---

## Installation (Windows)

### Method 1: Using pip (Recommended)

```powershell
# Navigate to backend directory
cd "C:\Users\sowmy\OneDrive\Desktop\Project\online-edu-platform(1)\online-edu-platform(1)\backend"

# Install psutil
pip install psutil

# Verify installation
python -c "import psutil; print(f'CPU: {psutil.cpu_percent()}%')"
```

### Method 2: If using virtual environment

```powershell
# Activate virtual environment first
.\venv\Scripts\Activate.ps1

# Then install
pip install psutil

# Verify
python -c "import psutil; print(f'CPU: {psutil.cpu_percent()}%')"
```

---

## After Installation

### 1. Restart Django Server

**Stop server (if running):**
- Press `Ctrl+C` in terminal

**Start server again:**
```powershell
cd "C:\Users\sowmy\OneDrive\Desktop\Project\online-edu-platform(1)\online-edu-platform(1)\backend"
python manage.py runserver
```

### 2. Test in Browser

1. Navigate to **Maintenance** tab in Super Admin Control
2. Click **Refresh** button
3. You should now see:
   ```
   CPU Usage: 15.3%        (instead of 0%)
   Memory Usage: 67.8%     (instead of 0%)
   Disk Usage: 45.2%       (instead of 0%)
   Available Memory: 4.25 GB
   Free Disk Space: 125.3 GB
   ```

---

## Troubleshooting

### Error: "pip is not recognized"

**Solution:**
```powershell
# Use full Python path
python -m pip install psutil
```

### Error: "Permission denied"

**Solution 1: Run as Administrator**
- Right-click PowerShell
- Select "Run as Administrator"
- Run install command

**Solution 2: User installation**
```powershell
pip install --user psutil
```

### Error: "Microsoft Visual C++ required"

**Solution:**
Download and install Microsoft Visual C++ Build Tools:
https://visualstudio.microsoft.com/visual-cpp-build-tools/

Then retry:
```powershell
pip install psutil
```

### Still Not Working?

**Check Python version:**
```powershell
python --version
```
psutil requires Python 3.6+

**Check if already installed:**
```powershell
pip show psutil
```

---

## Alternative: Pre-compiled Wheel

If pip installation fails, download pre-compiled wheel:

1. Visit: https://www.lfd.uci.edu/~gohlke/pythonlibs/#psutil
2. Download matching your Python version:
   - Example: `psutil-5.9.6-cp311-cp311-win_amd64.whl` (for Python 3.11, 64-bit)
3. Install:
   ```powershell
   pip install path\to\downloaded\psutil-5.9.6-cp311-cp311-win_amd64.whl
   ```

---

## Verification

After installation, test in Python:

```python
python

>>> import psutil
>>> print(f"CPU: {psutil.cpu_percent()}%")
>>> print(f"Memory: {psutil.virtual_memory().percent}%")
>>> print(f"Disk: {psutil.disk_usage('/').percent}%")
>>> exit()
```

Expected output:
```
CPU: 15.3%
Memory: 67.8%
Disk: 45.2%
```

---

## What psutil Provides

### System Metrics:
- ✅ CPU usage percentage
- ✅ CPU count (physical and logical)
- ✅ Memory total, available, used, free
- ✅ Disk total, used, free
- ✅ Disk I/O statistics
- ✅ Network I/O statistics

### Process Metrics:
- Process CPU usage
- Process memory usage
- Process list
- Process details

### System Info:
- Boot time
- Users logged in
- System uptime

---

## Requirements.txt

If you want to add to requirements file:

**Create/Update `backend/requirements.txt`:**
```txt
Django==5.2.16
djangorestframework==3.15.2
django-cors-headers==4.6.0
mysqlclient==2.2.6
psutil==6.1.0  # ← Add this line
```

**Install all requirements:**
```powershell
pip install -r requirements.txt
```

---

## Benefits Summary

### Without psutil (Current):
```json
{
  "cpu_usage": "N/A (install psutil)",
  "memory_usage": "N/A (install psutil)",
  "disk_usage": "N/A (install psutil)",
  "note": "Install psutil for detailed metrics"
}
```

### With psutil (After Installation):
```json
{
  "cpu_percent": 15.3,
  "cpu_usage": "15.3%",
  "memory_percent": 67.8,
  "memory_usage": "67.8%",
  "disk_percent": 45.2,
  "disk_usage": "45.2%",
  "memory_available": "4.25 GB",
  "disk_free": "125.30 GB"
}
```

---

## Optional: System Monitoring

With psutil installed, you can also monitor:

**CPU per core:**
```python
import psutil
print(psutil.cpu_percent(percpu=True))
# Output: [15.2, 23.1, 18.5, 20.3]
```

**Memory details:**
```python
mem = psutil.virtual_memory()
print(f"Total: {mem.total / (1024**3):.2f} GB")
print(f"Available: {mem.available / (1024**3):.2f} GB")
print(f"Used: {mem.used / (1024**3):.2f} GB")
print(f"Percent: {mem.percent}%")
```

**Disk details:**
```python
disk = psutil.disk_usage('/')
print(f"Total: {disk.total / (1024**3):.2f} GB")
print(f"Used: {disk.used / (1024**3):.2f} GB")
print(f"Free: {disk.free / (1024**3):.2f} GB")
print(f"Percent: {disk.percent}%")
```

---

## Installation Command Summary

**Quick Install (Copy & Paste):**

```powershell
# Navigate to backend
cd "C:\Users\sowmy\OneDrive\Desktop\Project\online-edu-platform(1)\online-edu-platform(1)\backend"

# Install psutil
pip install psutil

# Verify
python -c "import psutil; print('✅ psutil installed successfully!'); print(f'CPU: {psutil.cpu_percent()}%')"

# Restart Django
python manage.py runserver
```

**That's it!** Your system metrics will now show live percentages! 🎉

---

## Need Help?

If installation fails, check:
1. ✅ Python version (3.6+ required)
2. ✅ pip is installed (`pip --version`)
3. ✅ Internet connection
4. ✅ Antivirus not blocking
5. ✅ Run as Administrator

**Still issues?** The system works fine without psutil - it just shows N/A instead of live metrics.
