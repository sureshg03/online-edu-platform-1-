# Quick Reference Guide - New Features

## 🔧 Maintenance Mode Usage

### How to Enable Maintenance Mode:
1. Navigate to **System Settings** tab
2. Find the large **Website Maintenance Mode** card at the top
3. Click **"Enable Maintenance"** button
4. Confirm the action
5. Website is now in maintenance mode (red card with lock icon)

### How to Disable Maintenance Mode:
1. Navigate to **System Settings** tab  
2. Find the red **Website Maintenance Mode** card
3. Click **"Disable Maintenance"** button
4. Website returns to normal operation (green card with unlock icon)

### Visual Indicators:
- **🔓 Green Card** = Website is LIVE
- **🔒 Red Card** = Website is UNDER MAINTENANCE

---

## ✏️ Edit LSC Admin

### Steps to Edit:
1. Navigate to **LSC Admins** tab
2. Find the LSC Admin you want to edit
3. Click the **blue Edit button** (✏️) in the Actions column
4. Modal opens with form pre-filled with existing data
5. Modify the fields you want to change
6. Click **"Update LSC Admin"** button
7. Success notification appears
8. Table refreshes with updated data

### Notes:
- Password field is empty in edit mode (for security)
- Leave password blank to keep existing password
- Enter new password to change it
- All other fields are pre-populated

---

## 🗑️ Delete LSC Admin

### Steps to Delete:
1. Navigate to **LSC Admins** tab
2. Find the LSC Admin you want to delete
3. Click the **red Delete button** (🗑️) in the Actions column
4. **Confirmation dialog** appears showing LSC code
5. Click **OK** to confirm deletion or **Cancel** to abort
6. Success notification appears
7. LSC Admin is removed from the table

### Warning:
⚠️ **Deletion is permanent and cannot be undone!**

---

## 💾 Database Query Execution

### How to Execute Queries:
1. Navigate to **Database** tab
2. Click on a table name in the left sidebar to view structure
3. Type your SQL query in the query builder textarea
4. Click **"Execute Query"** button
5. Results appear in table format below

### Example Queries:
```sql
-- Select all LSC admins
SELECT * FROM admin_one_lscadmin LIMIT 10;

-- Count total applications
SELECT COUNT(*) as total FROM admin_one_application;

-- Get recent audit logs
SELECT * FROM admin_one_auditlog ORDER BY timestamp DESC LIMIT 20;

-- Find pending verifications
SELECT email, name FROM admin_one_application WHERE is_verified = FALSE;
```

### Important Notes:
- ✅ Only **SELECT queries** are allowed (for security)
- ❌ INSERT, UPDATE, DELETE, DROP queries will be **blocked**
- 📊 Results show row count in success message
- 🔍 Use LIMIT clause to control result size

### Security Features:
- All queries logged in audit log
- Only read-only operations permitted
- Error messages are sanitized
- Admin authentication required

---

## 🎯 Quick Actions (FAB Menu)

### How to Use:
1. Look for the **purple circular button** at bottom-right corner
2. Click to expand the menu
3. Three sub-buttons appear above:
   - **🔄 Refresh** (top) - Refreshes dashboard stats
   - **➕ Quick Add** (middle) - Opens LSC Admin form
   - **ℹ️ Help** (bottom) - Shows help information
4. Click any action button
5. Menu automatically closes after action

### Visual Effects:
- Main button rotates 45° when expanded
- Color changes from purple-blue to red when open
- Sub-buttons fan out with smooth animation
- Hover effects on all buttons

---

## 🔐 System Settings

### Adding New Settings:
1. Navigate to **System Settings** tab
2. Click **"Add Setting"** button
3. Fill in the form:
   - **Setting Key** (e.g., `max_upload_size`)
   - **Setting Value** (e.g., `10MB`)
   - **Setting Type** (general, email, security, system)
   - **Description** (explanation of the setting)
4. Click **Create Setting**
5. New setting appears in the list

### Current Settings:
- **maintenance_mode** - Controls website maintenance state
- Add more as needed for your application

---

## 📱 Responsive Design

All features work on:
- 💻 **Desktop** - Full layout with all features
- 📱 **Tablet** - Adapted grid layouts
- 📱 **Mobile** - Single column, touch-friendly buttons

---

## 🚨 Error Handling

### If Something Goes Wrong:
1. **Toast notifications** appear at top-right
2. **Red toasts** = Errors
3. **Green toasts** = Success
4. **Blue toasts** = Information

### Common Issues:

**Query Not Executing?**
- Check if query starts with SELECT
- Verify table names are correct
- Check for syntax errors

**Can't Delete LSC Admin?**
- Ensure you have proper permissions
- Check if admin has dependent records

**Maintenance Mode Not Toggling?**
- Verify backend connection
- Check browser console for errors
- Ensure database is accessible

---

## 🎨 Color Codes

### Tab Colors:
- **Dashboard** - Purple (#8B5CF6)
- **LSC Admins** - Purple (#A855F7)
- **System Settings** - Green (#10B981)
- **Database** - Amber (#F59E0B)
- **Backups** - Indigo (#6366F1)
- **Audit Logs** - Orange (#F97316)
- **Security** - Red (#EF4444)
- **Email Config** - Teal (#14B8A6)
- **Maintenance** - Purple (#8B5CF6)
- **Guidelines** - Indigo (#6366F1)

---

## ⌨️ Keyboard Shortcuts

### General:
- **Esc** - Close modals/forms
- **Enter** - Submit forms (when focused)
- **Tab** - Navigate between form fields

---

## 📞 Support

### Need Help?
1. Click the **ℹ️ Help** button in FAB menu
2. Check the **Guidelines** tab for documentation
3. Review **Audit Logs** to see what happened
4. Check **System Health** in Maintenance tab

---

## ✅ Best Practices

### Database Queries:
- Always use LIMIT clause
- Test queries on small datasets first
- Backup before running complex queries
- Review table structure before querying

### LSC Admin Management:
- Use meaningful LSC codes
- Keep contact information updated
- Regularly audit admin list
- Remove inactive admins

### Maintenance Mode:
- Schedule maintenance during low traffic
- Notify users in advance
- Test before enabling
- Disable as soon as maintenance is complete

### System Settings:
- Document all custom settings
- Use descriptive keys
- Keep values consistent
- Review regularly

---

## 🔄 Update Frequency

### Auto-Refresh:
- Dashboard stats on page load
- Data refreshes when switching tabs
- Manual refresh available via FAB menu

### Manual Actions Required:
- Maintenance mode toggle
- LSC Admin create/edit/delete
- Query execution
- Settings updates

---

**Last Updated:** November 2, 2025
**Version:** 2.0
**Status:** Production Ready ✅
