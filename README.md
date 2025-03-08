# GOLD To Google Calendar Schedule Converter

A webapp tool that converts a class schedule on GOLD to Google Calendar. Built with React.

This tool makes it easy for UCSB students to instantly get their class schedules from GOLD onto their Google Calendar. This tool helps students to say on track and reminded of when their classes are and when they are free. Built with React for a seamless, cross platform experience. 

Approach: We will create a database that mirrors the GOLD API. Using that database, we will create .csv files that are formatted for import to Google Calendar. We will then import these events onto the user's Google Calendar.

User Roles:
1. Those looking to convert their GOLD class schedule to Google Calendar

Link: https://fanciful-kangaroo-2eef8e.netlify.app/

# Installation

### Prerequisites
- Git
- npm

### Installation Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/ucsb-cs148-w25/pj01-scheduleconverter
   ```

2. **Navigate to the Project Directory**
   ```bash
   cd pj01-scheduleconverter/schedule-converter
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. Create a .env file in the /schedule-converter folder with the following environmental variables:
    ```
    REACT_APP_GOOGLE_CLIENT_ID=<your_id>
    REACT_APP_GOOGLE_CLIENT_SECRET=<your_id>
    REACT_APP_GOOGLE_API_KEY=<your_id>
    REACT_APP_UCSB_API_KEY=<your_id>
    ```

5. Run locally: 
    ```bash
    npm start
    ```
6. Visit site at `http://localhost:3000`

| Name          | GitHub IDs          |
|--------------------|-------------------|
| Abby Fan         | Abby-Fan04        |
| Ashton Wong        | ashton-wong         |
| Bharat Saiju        | bsaiju          |
| Christian Lee     |   applechristian
| Giovanni Long     |   giozucca          |
| Nathan Alexander  |   nathanalexander626 |
| Yungong Wang      |   yungongWang  |

