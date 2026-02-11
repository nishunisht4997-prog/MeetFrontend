# TODO: Modernize Home Page UI

- [x] Reduce .home-container max-width from 500px to 400px and padding from 40px to 30px
- [x] Remove 3D transforms (rotateX, translateZ) from h1 for flat modern look
- [x] Remove 3D transforms from .instructions
- [x] Simplify button hover effects: remove 3D rotations and scaling, keep subtle shadows
- [x] Change body background from #dfb6b2 to #f8f9fa
- [x] Change .center background to #f8f9fa
- [x] Change .home-container background to white with subtle border
- [x] Change button colors from #824d69 to #007bff, hover to #0056b3
- [x] Change input backgrounds to #ffffff, borders to #dee2e6
- [x] Adjust text colors for contrast (h1 to #333, instructions to #666)
- [x] Reduce overall shadows and gradients for cleaner style
- [ ] Reduce the size of the video icon in the heading from 32x32 to 24x24

# TODO: Fix Participants Join Issue

- [x] Fix inconsistent socket connections by using imported socket from socket.js instead of creating new io connection in Room.jsx
- [x] Remove duplicate socket state and setSocket call in Room.jsx
- [x] Ensure all components use the same socket instance for consistent backend communication
