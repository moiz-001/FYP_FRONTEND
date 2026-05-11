# Environment Setup for React Native
# This script sets the necessary environment variables for Node, Java, and Android SDK.

$env:ANDROID_HOME = "C:\Users\Abdul Moiz\AppData\Local\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
$env:Path = "C:\Program Files\nodejs;" + $env:Path + ";$env:ANDROID_HOME\platform-tools;$env:JAVA_HOME\bin"

# Log variables for verification
Write-Host "ANDROID_HOME: $env:ANDROID_HOME"
Write-Host "JAVA_HOME: $env:JAVA_HOME"
Write-Host "Node version:"
node -v
Write-Host "Java version:"
java -version
Write-Host "ADB version:"
adb version

# Run React Native Doctor
Write-Host "Running React Native Doctor..."
npx react-native doctor
