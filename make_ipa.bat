@echo off
echo Packaging Simulator APP into IPA for TrollStore...
mkdir Payload
REM Assumes you extracted the .tar.gz from EAS into a folder named TapCount.app
xcopy /E /I "TapCount.app" "Payload\TapCount.app"
tar -a -c -f TapCount.ipa Payload
rmdir /S /Q Payload
echo Done! TapCount.ipa created.
pause
