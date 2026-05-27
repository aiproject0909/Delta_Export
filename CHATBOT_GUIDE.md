# Delta Export Chatbot Guide

## Overview
A professional AI-powered chatbot widget has been added to all pages of your website. The chatbot provides instant customer support and answers common questions about your spices and scrap export business.

## Features

✅ **Always Available** - 24/7 customer assistance
✅ **Mobile Friendly** - Responsive design works on all devices
✅ **Brand Matching** - Orange color scheme matches your Delta Export branding
✅ **Smart Responses** - Answers about products, pricing, shipping, and more
✅ **Easy to Customize** - Simple JavaScript file for easy modifications

## Files Added

1. **chatbot.js** - Main chatbot JavaScript logic
2. **chatbot.css** - Chatbot styling and animations
3. Both files linked to all HTML pages (index, about, products, scrap, contact, copper, brass, aluminium)

## How It Works

### User Experience
1. Visitors see a floating **orange chat button** in the bottom-right corner
2. Click the button to open the chat window
3. Type a question and press Enter or click the send button
4. The chatbot responds with helpful information
5. Click the X button or chat button again to close the window

### Chatbot Capabilities
The chatbot can answer questions about:
- **Products**: Spices, copper scrap, aluminium scrap, and metal scrap
- **Shipping & Delivery**: International export details
- **Quality Standards**: Certifications and guarantees
- **Bulk Orders**: Wholesale and special pricing
- **Contact Info**: How to reach the company
- **General Company Info**: About Delta Export

## Customization

### Adding New Responses
Edit `chatbot.js` and add new keyword patterns to the `getBotResponse()` method:

```javascript
// Example: Adding a new response for "sustainability"
if (this.matchesKeywords(message, ['sustainable', 'eco', 'environment'])) {
    return '🌱 We are committed to sustainable practices in all our exports...';
}
```

### Changing the Color Scheme
Edit `chatbot.css` - the chatbot uses your existing CSS variables:
- `--primary: #d35400` (orange)
- `--primary-dark: #a04000` (dark orange)

To change colors, modify the chat toggle button and message styles:
```css
.chatbot-toggle {
    background: var(--primary);  /* Change this color */
}
```

### Adjusting Position
In `chatbot.css`, modify the position of the chat widget:
```css
.chatbot-toggle {
    bottom: 20px;  /* Distance from bottom */
    right: 20px;   /* Distance from right */
}
```

### Changing the Welcome Message
In `chatbot.js`, modify the `addWelcomeMessage()` method:
```javascript
addWelcomeMessage() {
    setTimeout(() => {
        this.addMessage('👋 Your custom welcome message here!', 'bot');
        this.addMessage('Custom options here', 'bot');
    }, 300);
}
```

## Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance
- **File Sizes**: 
  - chatbot.js: ~8KB
  - chatbot.css: ~6KB
- **Load Impact**: Minimal - loads only when DOM is ready
- **No External Dependencies**: Works standalone with Font Awesome icons

## Accessibility Features
- Proper ARIA labels for screen readers
- Keyboard navigation (Enter to send messages)
- Focus management
- Clear visual states

## Troubleshooting

**Chatbot not appearing?**
- Check that both `chatbot.js` and `chatbot.css` are properly linked in the HTML file
- Open browser console (F12) to check for errors
- Verify Font Awesome is loaded

**Responses not showing?**
- Check your browser's console for JavaScript errors
- Ensure DOM is fully loaded before chatbot initializes

**Styling issues?**
- Check if CSS variables are properly defined in styles.css
- Ensure chatbot.css loads after styles.css
- Clear browser cache and reload

## Future Enhancements
Consider adding:
- Backend API integration for dynamic responses
- Product catalog search
- WhatsApp integration for direct chats
- Multi-language support
- Chat history storage
- Customer feedback rating

## Support
For questions or issues with the chatbot implementation, contact your developer.

---

**Last Updated**: May 2026
**Chatbot Version**: 1.0
