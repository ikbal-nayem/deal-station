# **App Name**: LocalPerks

## Core Features:

- Offer Listing: Display a list of available offers fetched from the Java API based on user's location.
- Map View: Show offers on an interactive map using OSM, with custom markers for each offer.
- Location Detection: Request user's location permission and store coordinates, falling back to a default city if permission is denied.
- Member Offer Highlighting: Visually differentiate member-only offers with special highlights and MdStar/MdVerified icons.
- Login Overlay for Member Offers: Blur member-only offer content and display a 'Login to View' overlay for unauthenticated users.
- Offer Details Bottom Sheet: Show full offer details, QR code, and 'Open in Maps' button in a slide-up bottom sheet on card click.
- StaleWhileRevalidate Caching: Implement StaleWhileRevalidate strategy for offer list to ensure fast loading and offline availability.

## Style Guidelines:

- Primary color: A deep, muted blue (#3B5998) to create a sense of trust and reliability, while maintaining a modern feel. Darker variant: #2A4365; Lighter variant: #5C7CB2.
- Secondary color: Teal (#008080) for a sense of calm and sophistication. Darker variant: #006666; Lighter variant: #4DB6B6.
- Background color: A very light desaturated blue (#F0F8FF), close to white, providing a clean and unobtrusive backdrop. A slightly darker variant for modals and sheets: #E0F2F7.
- Accent color: A vibrant violet (#8A2BE2) used for interactive elements and highlights, drawing the user's eye without overwhelming the interface. A more subtle variant for hover states: #A352CC.
- Theme color: A warm orange (#FF4500) to evoke excitement and impulse. Darker variant: #E63900; Lighter variant: #FF7F50.
- Body and headline font: 'PT Sans', a modern sans-serif font with a touch of warmth, suitable for both headlines and body text, ensures readability on mobile devices.
- Use Md or Hi icons from React-Icons for a clean, modern look. Emphasize MdStar or MdVerified for member offers.
- Mobile: Single column list; Desktop: Side-by-side List and Map view (split screen).
- Subtle slide-up animations for the bottom sheet, creating a smooth and engaging user experience.