<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.73.6-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Cloudinary-Upload-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green?style=for-the-badge&logo=android&logoColor=white" />
  <img src="https://img.shields.io/badge/CLI-Only-red?style=for-the-badge" />
</p>

<h1 align="center">🏥 Healthcare App</h1>

<p align="center">
  A fully-featured cross-platform mobile healthcare application built with <strong>React Native CLI</strong>.<br/>
  Upload prescriptions, discover nearby pharmacies, manage reminders — all in one place.
</p>

---

## 📱 App Preview

| Splash               | Login         | Register          | Home              |
| -------------------- | ------------- | ----------------- | ----------------- |
| Animated ripple logo | Firebase auth | Validated sign-up | Quick-action grid |

| Nearby Pharmacy  | Upload Modal      | Reminder Tab      |
| ---------------- | ----------------- | ----------------- |
| Horizontal cards | File & URL upload | Prescription list |

---

## 🌟 Features

### Authentication

- 🔐 Email & Password **Login** via Firebase Authentication
- 📝 **Register** new account with display name
- 🔑 **Forgot Password** — sends reset email via Firebase
- 💾 **Persistent sessions** — token stored in AsyncStorage, user stays logged in on relaunch
- 🚪 **Logout** with confirmation dialog

### Screens & Navigation

- 🎬 **Splash Screen** — animated ripple rings + spring-scale logo, auto-navigates after 2.8s
- ⏳ **Preloader Screen** — spinning loader + animated progress bar while auth state resolves
- 🔑 **Login Screen** — clean card UI with animated entrance
- 📋 **Register Screen** — gradient header banner + validated form
- 🏠 **Home Screen** — navbar, quick-actions, tab switcher, promo banners, bottom navigation

### Nearby Pharmacy Tab

- 🗺️ Location header showing current city
- 🏪 Horizontal scrollable **pharmacy cards** with name, distance, and star rating
- 📤 **Upload Prescription** section with two options:
  - Upload from **device** (PNG, JPG, JPEG, PDF)
  - Upload from **remote URL** (link to an online document)
- ✅ Upload progress bar with percentage
- 🔔 Badge showing total prescriptions uploaded

### Reminder Tab

- 📋 Lists **all uploaded prescriptions** fetched from AsyncStorage
- 📊 Stats chips: Total / Images / PDFs count
- 🗂️ Each card shows: file name, date, size, format badge
- 👁️ **View** button opens the file in browser via Cloudinary URL
- 🗑️ **Delete** prescription with confirmation alert
- 😴 Elegant **empty state** with CTA to upload tab
- ⚡ Staggered list animation on mount

---

## 🛠️ Tech Stack

| Category            | Technology                   | Version          | Purpose                             |
| ------------------- | ---------------------------- | ---------------- | ----------------------------------- |
| **Framework**       | React Native CLI             | 0.73.6           | Core mobile framework               |
| **Language**        | JavaScript (ES2022)          | —                | App logic                           |
| **Auth**            | Firebase Authentication      | ^20.5.0          | Login, register, forgot password    |
| **Storage (Cloud)** | Cloudinary                   | REST API         | File & image uploads                |
| **Storage (Local)** | AsyncStorage                 | 1.21.0           | Token, user data, prescription list |
| **Navigation**      | React Navigation v6          | ^6.x             | Stack navigation between screens    |
| **Gradients**       | react-native-linear-gradient | ^2.8.3           | Splash, login, preloader UI         |
| **Bottom Sheet**    | react-native-modal           | ^13.0.1          | Upload prescription modal           |
| **File Picker**     | react-native-document-picker | ^9.1.1           | Pick PDF/image from device          |
| **Image Picker**    | react-native-image-picker    | ^7.1.2           | Pick images from gallery            |
| **Animations**      | React Native Animated API    | built-in         | All screen & component animations   |
| **Build Tool**      | Gradle                       | 8.3              | Android build system                |
| **Min SDK**         | Android SDK                  | 21 (Android 5.0) | Minimum Android support             |

---

## 📁 Project Structure

```
HealthCareApp/
│
├── App.js                          # Root entry point
├── babel.config.js                 # Babel configuration
├── package.json                    # Dependencies
│
├── android/                        # Android native project (generated)
├── ios/                            # iOS native project (generated)
│
└── src/
    ├── screens/
    │   ├── SplashScreen.js         # Animated splash with ripple rings
    │   ├── PreloaderScreen.js      # Auth-resolving loader screen
    │   ├── LoginScreen.js          # Firebase email/password login
    │   ├── RegisterScreen.js       # Firebase new user registration
    │   └── HomeScreen.js           # Main app shell with tabs & bottom nav
    │
    ├── tabs/
    │   ├── NearbyPharmacyTab.js    # Pharmacy list + prescription upload
    │   └── ReminderTab.js          # Uploaded prescriptions manager
    │
    ├── components/
    │   ├── AppButton.js            # Reusable animated button (gradient, outline, ghost)
    │   ├── AppInput.js             # Reusable floating-label text input
    │   ├── PharmacyCard.js         # Pharmacy display card with press animation
    │   ├── PrescriptionCard.js     # Prescription list item with view/delete
    │   └── UploadModal.js          # Bottom sheet — file & URL upload with progress
    │
    ├── navigation/
    │   └── AppNavigator.js         # Stack navigator (Splash→Preloader→Login/Home)
    │
    ├── services/
    │   ├── authService.js          # Firebase auth wrapper (login/register/logout)
    │   ├── cloudinaryService.js    # Cloudinary upload: device file + remote URL
    │   └── storageService.js       # AsyncStorage CRUD for token, user, prescriptions
    │
    ├── context/
    │   └── AuthContext.js          # Global auth state via React Context API
    │
    └── utils/
        └── constants.js            # Colors, font sizes, spacing, API config
```

---

## 🎨 Animations

Every screen and interaction is animated using React Native's built-in **Animated API**:

| Location            | Animation Type      | Description                                                 |
| ------------------- | ------------------- | ----------------------------------------------------------- |
| `SplashScreen`      | Loop + Spring       | Ripple rings pulse outward, logo springs in, text slides up |
| `PreloaderScreen`   | Rotation + Timing   | Spinning border loader, animated progress bar fills         |
| `LoginScreen`       | Spring + Timing     | Header slides down, form card slides up on mount            |
| `RegisterScreen`    | Parallel spring     | Form fades + springs in simultaneously                      |
| `HomeScreen`        | Stagger             | Navbar → actions → banners enter sequentially               |
| `NearbyPharmacyTab` | Stagger             | Each section (header, list, upload card) staggers in        |
| `ReminderTab`       | Stagger per item    | Each list card fades + slides up with index-based delay     |
| `AppButton`         | Spring press        | Scales down on press-in, bounces back on release            |
| `AppInput`          | Color interpolation | Border animates from gray → teal on focus                   |
| `PharmacyCard`      | Spring press        | Card gently scales on touch                                 |
| `UploadModal`       | SlideInUp           | Bottom sheet slides up from screen bottom                   |
| Tab Indicator       | Spring              | Sliding pill indicator animates between tabs                |

---

## ⚙️ Prerequisites

Make sure your development environment is ready:

- **Node.js** ≥ 18 → [nodejs.org](https://nodejs.org)
- **React Native CLI** environment → [Official Setup Guide](https://reactnative.dev/docs/environment-setup)
- **Android Studio** with Android SDK 34 installed
- **JDK 17** (recommended for Gradle 8.x)
- A **Firebase** project → [console.firebase.google.com](https://console.firebase.google.com)
- A **Cloudinary** account → [cloudinary.com](https://cloudinary.com)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SharmadG/HealthCareApp.git
cd HealthCareApp
```

### 2. Install dependencies

```bash
npm install
```

> ⚠️ Use this pinned version for AsyncStorage to avoid Kotlin version conflicts:
>
> ```bash
> npm install @react-native-async-storage/async-storage@1.21.0
> ```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) → Create or open a project
2. Enable **Authentication → Sign-in method → Email/Password**
3. Click **Add App → Android**
   - Package name: `com.healthcareapp`
   - Download `google-services.json`
   - Place it in `android/app/google-services.json`
4. Open `android/build.gradle` and add inside `buildscript > dependencies`:
   ```groovy
   classpath('com.google.gms:google-services:4.4.1')
   ```
5. Open `android/app/build.gradle` and add at the very bottom:
   ```groovy
   apply plugin: 'com.google.gms.google-services'
   ```

### 4. Cloudinary Setup

1. Sign in at [cloudinary.com](https://cloudinary.com)
2. Go to **Settings → Upload → Upload Presets**
3. Click **Add upload preset** → set **Signing Mode** to `Unsigned` → Save
4. Open `src/utils/constants.js` and fill in:
   ```js
   export const CLOUDINARY_CONFIG = {
     CLOUD_NAME: "your_cloud_name", // from Cloudinary dashboard
     UPLOAD_PRESET: "your_unsigned_preset", // preset you just created
     API_URL: "https://api.cloudinary.com/v1_1/your_cloud_name/upload",
   };
   ```

### 5. Fix Kotlin Version (Android)

Open `android/build.gradle` and set:

```groovy
buildscript {
    ext {
        kotlinVersion = "1.9.24"   // must be this or higher
        ...
    }
}
```

### 6. Run the app

```bash
# Start Metro bundler
npx react-native start --reset-cache

# In a second terminal — run on Android
npm run android
```

---

## 🔧 Troubleshooting

| Error                                                 | Fix                                                                                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `Cannot find module 'react-native-reanimated/plugin'` | Remove the plugin from `babel.config.js` — we use only the core Animated API                                                    |
| `serviceOf Unresolved reference`                      | Pin Gradle to `8.0.2` in `android/gradle/wrapper/gradle-wrapper.properties`                                                     |
| `Plugin com.facebook.react.settings not found`        | You're missing the `android/` folder. Run `npx react-native@0.73.6 init HealthCareApp` first                                    |
| `AsyncStorage Kotlin version mismatch`                | Run `npm install @react-native-async-storage/async-storage@1.21.0` and set `kotlinVersion = "1.9.24"` in `android/build.gradle` |
| `BUILD FAILED` after changing Gradle                  | Run `cd android && ./gradlew clean && cd ..` then retry                                                                         |
| Metro bundler stale cache                             | Run `npx react-native start --reset-cache`                                                                                      |

---

## 🔐 Environment & Security

> **Never commit sensitive keys to GitHub.**

The following values must be configured locally and are **not included** in this repository:

- `android/app/google-services.json` — Firebase config (add to `.gitignore`)
- `ios/GoogleService-Info.plist` — Firebase iOS config (add to `.gitignore`)
- `src/utils/constants.js` → `CLOUDINARY_CONFIG` — replace placeholder values with your own

Add this to your `.gitignore`:

```
# Firebase
android/app/google-services.json
ios/GoogleService-Info.plist
```

---

## 📦 Key Dependencies

| Package                                     | Version | What it does                         |
| ------------------------------------------- | ------- | ------------------------------------ |
| `react-native`                              | 0.73.6  | Core framework                       |
| `@react-navigation/native`                  | ^6.1.17 | Navigation container                 |
| `@react-navigation/native-stack`            | ^6.9.26 | Stack screen navigation              |
| `@react-native-firebase/app`                | ^20.5.0 | Firebase core                        |
| `@react-native-firebase/auth`               | ^20.5.0 | Firebase Authentication              |
| `@react-native-async-storage/async-storage` | 1.21.0  | Local key-value storage              |
| `react-native-document-picker`              | ^9.1.1  | Pick files (PDF, images) from device |
| `react-native-image-picker`                 | ^7.1.2  | Pick images from camera/gallery      |
| `react-native-linear-gradient`              | ^2.8.3  | Gradient backgrounds & buttons       |
| `react-native-modal`                        | ^13.0.1 | Animated bottom sheet modal          |
| `react-native-screens`                      | ^3.31.1 | Native screen optimization           |
| `react-native-safe-area-context`            | ^4.10.1 | Safe area insets handling            |

---

## 🏗️ Architecture & Design Decisions

- **No Expo** — React Native CLI only, giving full control over native modules
- **Context API** for global auth state — lightweight, no Redux overhead needed
- **Service layer** pattern — `authService`, `cloudinaryService`, `storageService` are all decoupled from UI
- **Reusable components** — `AppButton` and `AppInput` are used across every screen with consistent props API
- **AsyncStorage as local DB** — prescriptions persist across sessions without a backend
- **XHR for Cloudinary uploads** — enables real-time upload progress (fetch API doesn't support `onprogress`)
- **Firebase native SDK** (`@react-native-firebase`) — more reliable than the JS SDK on mobile, handles token refresh automatically

---

## 👨‍💻 Author

**Sharmad**

- Built as part of a React Native interview assignment
- Demonstrates: UI/UX fidelity, animations, Firebase auth, file uploads, component reusability, and clean architecture

---

## 📄 License

This project is for evaluation/interview purposes.

---

<p align="center">Made with ❤️ using React Native</p>
