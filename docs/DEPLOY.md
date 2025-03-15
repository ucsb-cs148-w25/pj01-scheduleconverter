https://docs.google.com/document/d/1ehmfZgcEHeWAkiIFzn15bNfA3P_mixPrMOjk6vceaME/edit?usp=sharing

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
