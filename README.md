
# README.md

## Project: Steer Appointment Bot

This project is a full-stack application designed to handle user creation, user insurance updates, and appointment scheduling. It integrates seamlessly with Dialogflow for handling session parameters.

---

## Table of Contents

1. [Running the Project Locally](#running-the-project-locally)  
2. [Deploying on Google Cloud Functions](#deploying-on-google-cloud-functions)  
3. [Setting up a Virtual Private Cloud (VPC)](#setting-up-a-virtual-private-cloud-vpc)  
4. [Whitelisting MongoDB IP for VPC](#whitelisting-mongodb-ip-for-vpc)  
5. [Environment Variables](#environment-variables)  
6. [Database Structure](#database-structure)  
7. [API Routes and Parameters](#api-routes-and-parameters)  

---

### Running the Project Locally

1. **Prerequisites:**
   - Node.js (version 20) installed.
   - MongoDB instance (cloud-hosted or local).
   - `.env` file configured with required environment variables (see [Environment Variables](#environment-variables)).

2. **Clone the repository:**
   ```bash
   git clone https://github.com/himanshugpt25/steer-health.git
   cd steer-health
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set the `NODE_ENV` variable:**
   - Set the `NODE_ENV` to `development` in your `.env` file or your terminal session.

5. **Run tests:**
   ```bash
   npm run test
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Access the application:**
   - The local server will be running at `http://localhost:PORT`.
   - Replace `PORT` with the port number specified in your `.env` file.

---

### Deploying on Google Cloud Functions

1. **Set up Google Cloud CLI:**
   - Install and authenticate with the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Set the `NODE_ENV` variable:**
   - Ensure the `NODE_ENV` is set to `production` in the environment variables configuration on Google Cloud.

4. **Deploy to Google Cloud Functions:**
   - Use the following command to deploy:
     ```bash
     npm run deploy
     ```
   - This script performs the following:
     - Runs tests (`npm run test`).
     - Compiles TypeScript to JavaScript (`npm run build`).
     - Deploys the function `steerappointmentbot` to Google Cloud Functions with an HTTP trigger.

5. **Set environment variables in the Google Cloud Console:**
   - Go to the **Cloud Functions** page.
   - Select the `steerappointmentbot` function.
   - Click **Edit** > **Runtime, Build, Connections and Security Settings**.
   - Add the environment variables required (see [Environment Variables](#environment-variables)).

---

### Setting up a Virtual Private Cloud (VPC)

1. **Create a VPC:**
   - Navigate to **VPC Network** in the Google Cloud Console.
   - Click **Create VPC Network**.
   - Give it a name (e.g., `steer-vpc`) and configure subnets as needed.

2. **Create a Serverless VPC Connector:**
   - Go to **Serverless VPC Access** in the Google Cloud Console.
   - Click **Create Connector**.
   - Choose the VPC you created earlier.
   - Provide a name for the connector and specify an IP range, such as `10.8.0.0/28`.

3. **Associate the Serverless VPC Connector with your Cloud Function:**
   - Go to **Cloud Functions** in the Google Cloud Console.
   - Select your deployed function (`steerappointmentbot`).
   - Click **Edit** and go to the **Networking** section.
   - Under **VPC Connector**, select the Serverless VPC Connector you created earlier.  
     This step ensures that your Cloud Function communicates securely with resources in your VPC, like your MongoDB instance.

---

### Whitelisting MongoDB IP for VPC

1. **Get the static IP of your VPC:**
   - When you create a Serverless VPC Connector, it uses a static IP for outgoing traffic.  
     This IP can be retrieved from your Google Cloud console.

2. **Whitelist the IP in MongoDB:**
   - If using a cloud-hosted MongoDB (e.g., MongoDB Atlas):
     - Go to the **Network Access** section in the MongoDB Atlas dashboard.
     - Add the VPC's static IP to the **IP Whitelist** to allow access from your VPC.

---

### Environment Variables

Create a `.env` file with the following variables for local development. For production, set these in the Google Cloud Console.

```plaintext
NODE_ENV=development
PORT=8080
MONGODB_URI=<Your MongoDB connection string>
```

- For local development, set `NODE_ENV=development`.
- For deployment, set `NODE_ENV=production`.

---

### Database Structure

This project relies on a MongoDB database with the following collections:

1. **`patients` Collection:**
   - Stores information about patients, including their names, birthdates, and insurance details.
   - If this collection does not exist in the database, it will be created automatically by the application code.

2. **`appointments` Collection:**
   - Stores appointment data, including patient IDs, appointment types, and times.
   - This collection is also created automatically by the application code if it does not exist.

**Note:** Ensure the MongoDB URI provided in the `MONGODB_URI` environment variable has the necessary permissions to create collections.

---

### API Routes and Parameters

#### 1. **User Creation**
   **Route:** `POST /users`  
   **Middleware:** 
   - `logRequest`
   - `validateUserCreation`
   **Handler:** `findOrCreateUser`

   **Expected Parameters (in request body, under `sessionParameters`):**
   - `firstName` (string): User's first name.
   - `lastName` (string): User's last name.
   - `birthDate` (object): User's date of birth, in the following format:
     ```typescript
     {
       day: number;
       month: number;
       year: number;
     }
     ```

---

#### 2. **Update Insurance**
   **Route:** `POST /users/update`  
   **Middleware:** 
   - `logRequest`
   - `validateInsuranceUpdate`
   **Handler:** `updateInsurance`

   **Expected Parameters (in request body, under `sessionParameters`):**
   - `patientId` (string): Unique identifier of the user.
   - `insurancePolicyNumber` (string): Insurance policy number.

---

#### 3. **Request Appointment**
   **Route:** `POST /appointments`  
   **Middleware:** 
   - `logRequest`
   - `validateAppointmentCreation`
   **Handler:** `requestAppointment`

   **Expected Parameters (in request body, under `sessionParameters`):**
   - `patientId` (string): Unique identifier of the user.
   - `appointmentType` (string): Type of appointment (e.g., general, specialist).
   - `appointmentTime` (object): Requested time for the appointment, in the following format:
     ```typescript
     {
       year: number;
       month: number;
       day: number;
       hours: number;
       minutes: number;
     }
     ```

   **Additional Logic:**
   - The route checks if the user already has an upcoming appointment scheduled in the future.
   - If an upcoming appointment exists, the API prevents the user from scheduling a new appointment.

---

### Notes

- All API routes are triggered via HTTP POST and are designed to handle input provided by the Dialogflow webhook.
- Ensure your VPC is correctly configured to allow secure access to the MongoDB database.