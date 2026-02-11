# Meet Frontend TODO

## Completed Tasks ✅

### Socket Connection Fix
- [x] Fixed socket connection issue where participants couldn't join
- [x] Moved socket emits to 'connect' event listener to ensure connection is established before emitting join events
- [x] Host now receives join request messages from participants
- [x] Participants can now successfully join meetings

### Navbar Enhancement
- [x] Created Navbar component with logo and color theme selector
- [x] Added 9 different color themes (rosa-intenso, azul-electrico, verde-lima, etc.)
- [x] Implemented dynamic color changing functionality
- [x] Updated CSS variables and button styles to use selected theme color
- [x] Added navbar to App.jsx and styled it as fixed header

### Code Improvements
- [x] Updated main.jsx to import index.css
- [x] Added proper CSS variables for color themes
- [x] Fixed logo sizing with explicit width/height attributes

## Remaining Tasks 🔄

### Testing
- [ ] Test join functionality across multiple browsers/tabs
- [ ] Verify host receives participant join requests
- [ ] Test accept/reject functionality
- [ ] Test video/audio streams after joining
- [ ] Test color theme changes affect UI elements

### Potential Enhancements
- [ ] Add more color themes
- [ ] Implement theme persistence (localStorage)
- [ ] Add dark/light mode toggle
- [ ] Improve mobile responsiveness for navbar
