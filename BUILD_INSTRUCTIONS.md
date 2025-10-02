# Walkies App - Build Instructions

Quick reference for building and deploying the Walkies mobile app.

## 📱 Quick Start

```bash
cd walkies-app
npm start              # Run in browser at localhost:3000
```

## 🔨 Build Commands

### Web Build
```bash
npm run build         # Creates production build in build/
```

### Sync Platforms
```bash
npx cap sync          # Sync web assets to iOS and Android
```

## 🍎 iOS Build

### Development
```bash
npx cap open ios      # Opens Xcode
```
Then in Xcode:
- Select your device/simulator
- Press ⌘+R to run

### Production (App Store)
1. In Xcode: Product > Archive
2. Window > Organizer
3. Distribute App > App Store Connect
4. Upload to App Store Connect
5. Configure in App Store Connect dashboard
6. Submit for review

**Requirements:**
- macOS with Xcode 14+
- Apple Developer Account ($99/year)
- Valid signing certificates

## 🤖 Android Build

### Development
```bash
npx cap open android  # Opens Android Studio
```
Then in Android Studio:
- Select your device/emulator
- Click Run button

### Production (Play Store)

#### 1. Generate Signing Key (first time only)
```bash
cd android/app
keytool -genkey -v -keystore walkies-release.keystore -alias walkies -keyalg RSA -keysize 2048 -validity 10000
```
Save the passwords securely!

#### 2. Configure Gradle Signing
Create `android/key.properties`:
```
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=walkies
storeFile=app/walkies-release.keystore
```

Add to `android/app/build.gradle` in `android` block:
```gradle
signingConfigs {
    release {
        def keystorePropertiesFile = rootProject.file("key.properties")
        def keystoreProperties = new Properties()
        keystoreProperties.load(new FileInputStream(keystorePropertiesFile))

        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        // ... existing config
    }
}
```

#### 3. Build Release AAB
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

#### 4. Find Your AAB
```
android/app/build/outputs/bundle/release/app-release.aab
```

#### 5. Upload to Play Console
1. Go to Google Play Console
2. Select your app
3. Production > Create new release
4. Upload app-release.aab
5. Fill in release details
6. Review and publish

**Requirements:**
- Android Studio 2022.1.1+
- Google Play Developer Account ($25 one-time)

## 🔄 Development Workflow

### Making Code Changes
1. Edit files in `src/`
2. Test in browser: `npm start`
3. Build: `npm run build`
4. Sync: `npx cap sync`
5. Test on device

### Adding Dependencies
```bash
npm install package-name
npm run build
npx cap sync
```

### Updating Capacitor
```bash
npm install @capacitor/core@latest @capacitor/cli@latest
npx cap sync
```

## 🎨 Customization

### App Name & ID
Edit `capacitor.config.ts`:
```typescript
const config: CapacitorConfig = {
  appId: 'com.yourcompany.app',
  appName: 'Your App Name',
  webDir: 'build'
};
```
Then run: `npx cap sync`

### App Icons

#### iOS
Replace files in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- Sizes: 20x20 to 1024x1024
- Use online generator: https://appicon.co

#### Android
Replace files in `android/app/src/main/res/mipmap-*/ic_launcher.png`
- Sizes: 48x48 to 192x192
- Use Android Asset Studio

### Splash Screen

#### iOS
Replace `ios/App/App/Assets.xcassets/Splash.imageset/splash.png`
- Size: 2732x2732px
- Background: #0f172a (dark blue)

#### Android
Replace files in `android/app/src/main/res/drawable*/splash.png`
- Sizes: mdpi (320x), hdpi (480x), xhdpi (720x), xxhdpi (1080x), xxxhdpi (1440x)

## 🐛 Common Issues

### iOS Won't Build
```bash
cd ios/App
rm -rf Pods Podfile.lock
pod install
cd ../..
npx cap sync ios
```

### Android Won't Build
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### Changes Not Showing
```bash
npm run build
npx cap copy
```

### Port 3000 Already in Use
```bash
killall node
npm start
```

## 📦 App Store Assets

### iOS Screenshots Required
- 6.7" (iPhone 15 Pro Max): 1290x2796
- 6.5" (iPhone 11 Pro Max): 1242x2688
- 5.5" (iPhone 8 Plus): 1242x2208
- iPad Pro 12.9": 2048x2732

### Android Screenshots Required
- Phone: 16:9 or 9:16
- 7-inch tablet: 16:9 or 9:16
- 10-inch tablet: 16:9 or 9:16
- Minimum: 320px, Maximum: 3840px

### Feature Graphic (Android)
- Size: 1024x500
- Format: PNG or JPEG

## ✅ Pre-Launch Checklist

- [ ] Test all screens and navigation
- [ ] Test on real iOS device
- [ ] Test on real Android device
- [ ] Replace all placeholder data
- [ ] Set up analytics
- [ ] Configure error tracking
- [ ] Add privacy policy URL
- [ ] Test payment flows (if applicable)
- [ ] Prepare marketing materials
- [ ] Create app store screenshots
- [ ] Write app description
- [ ] Test on different screen sizes
- [ ] Performance audit
- [ ] Security audit

## 🚀 Quick Deploy

### iOS (TestFlight Beta)
```bash
npm run build
npx cap sync ios
npx cap open ios
```
Then: Product > Archive > Distribute to TestFlight

### Android (Internal Testing)
```bash
npm run build
npx cap sync android
cd android && ./gradlew bundleRelease
```
Upload AAB to Play Console Internal Testing track

## 📞 Support Resources

- **Capacitor Docs**: https://capacitorjs.com/docs
- **React Router**: https://reactrouter.com
- **iOS Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/
- **Android Material Design**: https://material.io/design
- **App Store Connect**: https://appstoreconnect.apple.com
- **Google Play Console**: https://play.google.com/console

## 🎉 You're Ready!

Your Walkies app is fully configured and ready to build. Follow the steps above to deploy to iOS App Store and Google Play Store!
