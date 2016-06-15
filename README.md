# DVD extractor

A small application which manages DVD rips

## Functionality

1. Runs a small node server which shows a UI to explore folders and configure extracts using ffmpeg or handbrake
2. Once a folder is navigated and the DVDs configured, generates a bash file which has the relevant ffmpeg/handbrake commands
3. All extracts save log files which are then parsed and status shown on the UI
4. Once logs grow, important information extracted and saved into a condensed JSON file
5. All extract information is saved in a JSON file within the DVD folder, so at any point in the future the same bash commands can be re-generated! i.e. you can automate re-ripping of an entire library of DVD rips in one go!!!
