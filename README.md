# LabSys

A **Lab** Reservation **Sys**tem implemented as a web application for reserving slots in computer laboratories in DLSU's Manila campus.

## Project Overview

LabSys is designed to streamline reservation for computer laboratories for both the user and technician views. The navigable user-friendly interface of this web application ensures that reserving slots is easy and intutitive for users, and maintenance is simple and efficient for technicians.

## Features

### User View
- View Slot Availability
- Account Registration
- Login
- Logout
- Reserve
- Edit reservation
- See reservations
- View/Edit User profile
- Delete User Account

### Technician View
- Login
- Logout
- Reserve for a student
- Remove reservation
- Edit reservation

## Development

### Commit Message Format
Follow **Conventional Commits** standard:

| Type | Purpose |
|------|---------|
| `feat` | Add a new feature (functions, logic) |
| `fix` | Fix a bug (incorrect output, logic errors) |
| `refactor` | Improve code without changing behavior |
| `perf` | Optimize performance (faster loops, better memory) |
| `style` | Formatting changes (indentation, comments) |
| `test` | Add or update test cases |
| `build` | Modify build files or compilation setup |
| `docs` | Update README, specs, or comments |
| `chore` | Non-code maintenance (renaming files) |

**Format:**
```
<type>: <description>

[optional body]

[optional footer]
```

## Academic Context

This project is part of a web application development course focused on design and development of the frontend and backend of web applications and frontend-backend integration.

## How to Run Locally

1. Navigate to the root directory. Run npm init -y then npm install to initialize the folder and install dependencies.
2. Run seeds [TO UPDATE] to fill in the database. The database name should be `lab-reservation`
3. Run server.js to connect to MongoDB.
4. Access through localhost:3000


## License

This project is developed for educational purposes at De La Salle University.

## Contributing

This is an academic project. Contributions are limited to enrolled students as part of the course requirements.
