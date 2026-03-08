# CollabSheet - Real-time Collaborative Spreadsheet

A modern, lightweight, real-time collaborative spreadsheet application with stunning UI, built with Next.js, TypeScript, Tailwind CSS, and Firebase.

## ✨ Features

### 🏠 Landing Page
- Beautiful, modern landing page with particle network animation
- Glassmorphism effects and gradient backgrounds
- Feature showcase with animated cards
- Responsive design with smooth animations
- Call-to-action sections

### 📊 Core Features

#### 1. Document Dashboard
- Grid view of all spreadsheets with cards
- Create, rename, and delete documents
- Real-time updates across sessions
- Last modified timestamps
- Staggered card animations
- Hover effects with gradient overlays

#### 2. Real-time Editor
- **Grid System:** 100 rows × 26 columns (A-Z)
- **Cell Editing:** Click to select, double-click or Enter to edit
- **Formula Engine:** 20+ functions
  - Math: `SUM`, `AVERAGE`, `COUNT`, `MAX`, `MIN`, `ABS`, `ROUND`, `SQRT`, `POWER`
  - Logic: `IF`
  - Text: `CONCAT`, `LEN`, `UPPER`, `LOWER`
  - Date: `NOW`, `TODAY`
  - Operators: `+`, `-`, `*`, `/`, `%`, `^`
  - Cell references (A1, B2) and ranges (A1:A10)
  - Circular reference detection
  - Error handling (`#ERROR!`, `#DIV/0!`, `#CIRCULAR!`)
- **Real-time Sync:**
  - Debounced writes (400ms)
  - Optimistic UI updates
  - Enhanced "Saved" indicator with pill badge
  - Cell-level granularity

#### 3. Live Presence
- Active users with color-coded avatars
- Real-time presence updates
- Cell selection indicators
- User name labels on selected cells
- Hover effects on avatars

#### 4. Authentication
- Google Sign-in (Firebase Auth)
- Anonymous sign-in with display name
- Persistent sessions
- User-specific colors

### 🎨 Bonus Features

- **Cell Formatting:** Bold, italic, text color (20 colors), background color (20 colors)
- **Column/Row Resize:** Drag to resize with Google Sheets-style handles
- **Column Reorder:** Drag & drop column headers (Extra Brownie!)
- **Keyboard Navigation:** Arrow keys, Tab, Enter, Escape, Delete
- **Export:** CSV and JSON export with enhanced dropdown
- **Share:** One-click link sharing with copy-to-clipboard
- **Formula Bar:** Live formula editing
- **Dark Theme:** Modern purple/indigo gradient theme

## 🎨 Advanced UI Features

### Visual Effects
- **Particle Network:** Canvas-based animated particle system with connections
- **Glassmorphism:** Backdrop blur effects throughout
- **Gradient Animations:** Animated gradient backgrounds and text
- **Floating Orbs:** Multiple animated background orbs
- **Shimmer Effects:** Hover shimmer on cards and buttons
- **Smooth Transitions:** 300-700ms transitions on all interactions

### Custom Animations
- **Float:** Smooth up/down motion (6s)
- **Glow:** Pulsing opacity effect (3s)
- **Shimmer:** Horizontal gradient sweep (3s)
- **Gradient Shift:** Animated background gradients (8s)
- **Staggered Entry:** Cards animate in sequence

### Enhanced Components
- **Buttons:** Gradient sweep animations, hover scale effects
- **Cards:** Hover glow, gradient overlays, smooth transitions
- **Inputs:** Focus rings, hover states, purple accents
- **Dialogs:** Glassmorphism, gradient icon badges
- **Toolbar:** Purple active states, enhanced color pickers
- **Status Indicators:** Pill badges with color-coded states

### Custom Scrollbar
- Purple accent color
- Smooth hover effects
- Matches overall theme

## 🏗️ Architecture

### Tech Stack
- **Framework:** Next.js 13.5.1 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + Custom CSS animations
- **UI Components:** shadcn/ui (Radix UI + Tailwind)
- **Backend:** Firebase
  - Firestore (document storage)
  - Realtime Database (presence)
  - Authentication (Google + Anonymous)
- **Icons:** Lucide React

### Project Structure
```
├── app/
│   ├── page.tsx                    # Landing page
│   ├── auth/page.tsx               # Login page
│   ├── dashboard/page.tsx          # User dashboard
│   ├── doc/[docId]/page.tsx        # Spreadsheet editor
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles + animations
├── components/
│   ├── auth/
│   │   └── AuthProvider.tsx        # Firebase Auth context
│   ├── editor/
│   │   ├── Spreadsheet.tsx         # Main grid
│   │   ├── Toolbar.tsx             # Formatting toolbar
│   │   ├── FormulaBar.tsx          # Formula input
│   │   ├── PresenceBar.tsx         # Active users
│   │   ├── SpreadsheetHeader.tsx   # Document header
│   │   └── ShareButton.tsx         # Share dialog
│   └── ui/
│       ├── particles.tsx           # Particle network
│       └── [shadcn components]     # UI primitives
├── lib/
│   ├── firebase.ts                 # Firebase config
│   ├── formula/                    # Formula engine
│   │   ├── tokenizer.ts
│   │   ├── parser.ts
│   │   └── evaluator.ts
│   ├── hooks/
│   │   ├── useCells.ts             # Cell state
│   │   └── usePresence.ts          # Presence tracking
│   └── utils/
│       ├── cellAddress.ts          # A1 notation
│       └── colorHash.ts            # User colors
└── types/index.ts                  # TypeScript types
```

### Data Flow
```
Components → Hooks → Firebase
     ↓
Optimistic Updates → Debounced Writes → Real-time Listeners
```

## � Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with:
  - Authentication (Google + Anonymous)
  - Firestore Database
  - Realtime Database

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Akash-regno/collabsheet.git
cd collabsheet
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**

Create a `.env` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebasedatabase.app/
```

4. **Set up Firebase Security Rules**

**Firestore:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /documents/{document} {
      allow read, write: if request.auth != null;
      match /cells/{cell} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

**Realtime Database:**
```json
{
  "rules": {
    "presence": {
      "$docId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

6. **Build for production**
```bash
npm run build
npm start
```

## 🎯 Usage

### User Flow
1. Visit landing page at `/`
2. Click "Get Started" → Login at `/auth`
3. After login → Dashboard at `/dashboard`
4. Create or open spreadsheet → Editor at `/doc/[id]`
5. Collaborate in real-time with team

### Formula Examples
```
=SUM(A1:A10)              # Sum range
=AVERAGE(B1:B5)           # Average
=A1 + B1 * 2              # Arithmetic
=IF(A1 > 10, "High", "Low")  # Conditional
=CONCAT(A1, " ", B1)      # String concatenation
=ROUND(A1 / B1, 2)        # Division with rounding
```

## 🎨 Design Highlights

### Color Palette
- **Primary:** Purple (#a855f7) to Indigo (#6366f1)
- **Accent:** Blue (#3b82f6), Pink (#ec4899)
- **Background:** Slate-950 with purple-950 gradients
- **Success:** Green (#22c55e)
- **Warning:** Amber (#f59e0b)
- **Error:** Red (#ef4444)

### Typography
- **Font:** Inter (system font)
- **Headings:** Gradient text effects
- **Body:** Slate-400 for secondary text

### Spacing
- Consistent 4px base unit
- Generous padding for touch targets
- Proper visual hierarchy

## 📊 Performance

### Optimizations
- Debounced writes (400ms)
- Optimistic UI updates
- Cell-level Firestore documents
- Canvas-based particles (GPU accelerated)
- CSS animations (no JavaScript overhead)
- Code splitting by route
- Lazy loading where appropriate

### Bundle Size
```
Route                    Size     First Load JS
/                       8.96 kB   268 kB
/auth                   3.07 kB   250 kB
/dashboard              8.96 kB   268 kB
/doc/[docId]           23.3 kB   282 kB
```

## 🔒 Security

- Firebase Authentication required
- Row-level security via Firestore rules
- Environment variables for sensitive config
- No server-side code execution
- CORS headers configured

## 🧪 Testing Real-time Collaboration

1. Open app in two browser windows
2. Sign in with different accounts
3. Open the same spreadsheet
4. Observe:
   - Real-time cell updates
   - Live presence indicators
   - Formula calculations sync
   - Formatting changes sync

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables
Add all Firebase config variables in Vercel dashboard.


**Made with ❤️ by Akash**
