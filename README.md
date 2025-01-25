### **Frontend Project README**

---

# **Hospital Management System - Frontend**

This project is the **frontend application** for a Hospital Management System built using **Next.js**. It allows users, doctors, and staff to interact with the system, manage appointments, view schedules, and handle queue management efficiently.

---

## **Technologies Used**

### **Frameworks and Libraries**
- **Next.js**: React-based framework for server-side rendering, static site generation, and routing.
- **React**: For building dynamic and reusable UI components.
- **Tailwind CSS**: Utility-first CSS framework for building modern, responsive layouts.
- **Axios**: For handling HTTP requests to interact with the backend API.
- **Context API** (Optional): For global state management.
  
---

## **Features**

### **General**
- **Responsive Design**: Optimized for all screen sizes using Tailwind CSS.
- **Modular Architecture**: Clear separation of concerns with reusable components.

### **For Doctors**
- **Appointment Management**:
  - View all appointments for a specific doctor.
  - Displays appointment details like status and date.
  
### **For Patients**
- **Book Appointments**: Ability to book an appointment with available doctors (future scope).
- **Manage Appointments**: Cancel or reschedule existing appointments (future scope).

### **For Front Desk Staff**
- **Queue Management**:
  - Add walk-in patients to the queue.
  - Prioritize urgent cases.
- **Appointment Overview**:
  - View all scheduled appointments with the ability to filter by doctor or status.

---

## **How to Run the Project**

### **1. Prerequisites**
- **Node.js** installed (version >= 16.0).
- A compatible **package manager**: `npm` or `yarn`.

### **2. Setup**
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd hospital-management-frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   OR
   ```bash
   yarn install
   ```

### **3. Environment Configuration**
1. Create a `.env.local` file in the project root.
2. Add the following variables:
   ```plaintext
   NEXT_PUBLIC_BACKEND_API=http://localhost:3001
   ```

### **4. Run the Development Server**
```bash
npm run dev
```
OR
```bash
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## **Folder Structure**

```plaintext
.
├── components
│   ├── DoctorAppointments.tsx        # Displays appointments for a specific doctor
│   └── QueueManagement.tsx           # Manages patient queues (future)
├── pages
│   ├── appointments
│   │   ├── index.tsx                 # Lists all appointments
│   │   └── [doctorId].tsx            # Displays appointments for a specific doctor
│   └── _app.tsx                      # Application entry point
├── styles
│   └── globals.css                   # Global CSS styles
├── public                            # Static assets
├── utils
│   └── api.ts                        # Contains API functions (e.g., fetchAppointments)
├── .env.local                        # Environment variables
├── package.json                      # Project metadata and dependencies
```

---

## **Future Enhancements**
- Add authentication for different user roles (e.g., admin, doctor, patient).
- Allow patients to reschedule or cancel their appointments.
- Real-time queue updates using WebSockets.

---

## **Video Demonstration**

[**https://youtu.be/QJx6WACe6eM**]

---

## **Contributing**
Feel free to contribute to the project by submitting issues or creating pull requests.

---

## **Contact**
For any inquiries or issues, reach out at: **gn86923@gamil.com**

