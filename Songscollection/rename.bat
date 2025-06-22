@echo off
setlocal enabledelayedexpansion

:: Set counter
set count=1

:: Loop through all mp3 files sorted alphabetically
for /f "delims=" %%f in ('dir /b /a-d *.mp3 ^| sort') do (
    set "oldname=%%f"
    set "newname=music!count!.mp3"

    echo Renaming "!oldname!" to "!newname!"
    ren "%%f" "!newname!"
    set /a count+=1
)

echo All files renamed successfully.
pause
