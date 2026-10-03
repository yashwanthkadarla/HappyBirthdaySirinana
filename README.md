# Siri's birthday website: complete guide

The site stays LOCKED behind a countdown until midnight (00:00) on 7 November 2026, India time.
At zero it reveals itself with falling petals and an "Open your surprise" button.

## Step 1: Edit config.js (the only file you edit)
Open `config.js` in Notepad, TextEdit (plain text mode) or VS Code. Change only what is between the quotes.
- `from`: your name.
- `metDate`: the exact day you met, like "2024-10-03T00:00:00" (year-month-day).
- `unlockAt`: leave as is. It is already 7 Nov 2026, 00:00 India time.
- `photoCount`: how many photos you have (step 2 tells you the number).
- `captions`: optional text under specific photos.
- `letter`: replace every [bracket] and write your own lines. Set `sender` to your name.
- `timeline`: replace every [bracket] with your real dates and memories.
- `videos`: change each `title`. Delete a whole `{ ... },` line if you have fewer than 3 videos.
- `finale.message`: your last surprise message.
- `gate`: leave empty.

## Step 2: Photos
1. Put all original photos in the `originals` folder.
2. Install Python from python.org if needed, then in this folder run:
   `pip install pillow pillow-heif`
   `python3 prepare_photos.py` (on Windows use `python prepare_photos.py`)
3. It writes `1.jpg`, `2.jpg` ... into `photos`, in the order they were taken. Put the number it prints into `photoCount`.
   No Python? Rename photos by hand to 1.jpg, 2.jpg ... (lowercase .jpg, each under 500 KB).

## Step 3: Videos
Compress each in HandBrake (720p, Fast preset). Name them `video1.mp4`, `video2.mp4`, `video3.mp4`,
put them in `videos`, and keep each under ~30 MB.

## Step 4: Test on your computer
1. In this folder run `python3 -m http.server 8000` and open http://localhost:8000
2. You should see the countdown. To preview the unlocked site, TEMPORARILY set
   `unlockAt: "2020-01-01T00:00:00+05:30"` in config.js, refresh, and click Open.
3. To test the midnight moment, set it to 2 minutes from now and watch it flip.
4. CHANGE IT BACK to `"2026-11-07T00:00:00+05:30"` before uploading.

## Step 5: Put it on GitHub
Do NOT upload the `originals` folder (delete it first).
1. Create an account at github.com. Click + > New repository.
   Name: something hard to guess, like `siri-2years-k7x2`. Choose Public. Create.
2. Easiest way: install GitHub Desktop (desktop.github.com), sign in, File > Add local repository
   (pick this folder, accept "create repository"), then Commit all files and Publish repository
   (untick "Keep this code private").
   Browser way: click "uploading an existing file", drag files in. GitHub allows about 100 files and
   25 MB per file per upload, so upload the photos folder in two batches and use GitHub Desktop for big videos.
3. In the repo: Settings > Pages > Build and deployment > Source: Deploy from a branch >
   Branch: main, folder: / (root) > Save.
4. Wait 1-2 minutes. The link appears at the top of the Pages screen:
   https://YOUR-USERNAME.github.io/YOUR-REPO/
5. Open it on your phone to check. You should see the countdown.

## Step 6: Before the birthday
- Send Siri the link only on or before the day (she sees the countdown).
- Keep the page open at midnight and it unlocks live. If she opens it later, she gets the reveal screen.
- Changes later: edit the file, commit and push in GitHub Desktop, wait a minute, refresh.

## Honest limits
- The lock is a surprise lock, not security. Anyone technical who guesses file names like photos/1.jpg
  could view them early, because the repo is public. The site itself never loads them before midnight.
- The countdown uses the device clock. If her phone clock is wrong, the unlock time is off.
