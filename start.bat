@echo off

rem Öffne ein neues Terminal-Fenster und führe "react-native start" aus
start cmd /k "react-native start"

rem Warte einen Moment (z. B. 10 Sekunden) auf den Start von Metro
timeout /t 2

rem Führe "react-native run-android" im aktuellen Terminal aus
react-native run-android