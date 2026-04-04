const Account = require("../models/Account");
const Reservation = require("../models/Reservation");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs").promises;

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Form validation
    const errors = {};
    if(!email) {
        errors.email = "Missing email address.";
    }
    if(!password) {
        errors.email = "Missing password.";
    }

    if(Object.keys(errors).length > 0) {
        return res.status(400).json({ message: "Validation failed.", errors: errors });
    }

    try {
        const account = await Account.findOne({ email });
        if(!account) {
            return res.status(401).json({ message: "Invalid email address or password." });
        }

        const isMatch = await bcrypt.compare(password, account.passwordHash);
        if(!isMatch) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        res.json({
			_id: account._id,
			firstName: account.firstName,
			lastName: account.lastName,
			email: account.email,
			contactNumber: account.contactNumber,
			college: account.college,
			description: account.description,
			photo: account.photo,
			role: account.role
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.signup = async (req, res) => {
    const { _id, firstName, lastName, email, password, 
        contactNumber, college, description, photo, 
        role 
        } = req.body;
    
    // Form validation
    const errors = {};
    if(!firstName) {
        errors.firstName = "Missing first name.";
    }
    if(!lastName) {
        errors.lastName = "Missing last name.";
    }
    if(!email) {
        errors.email = "Missing email address.";
    } else if(!/^[^\s@]+@dlsu.edu.ph/.test(email)) {
        errors.email = "Invalid email address provided.";
    }
    // ID number validation: https://kroongho.livejournal.com/84664.html
    let isValidID = true;
    if(_id.length !== 8) {
        isValidID = false;
    } else {
        let sum = 0;
        for(let i = 8; i >= 1; i--) {
            sum += parseInt(_id.charAt(8 - i)) * i;
        }
        
        isValidID = sum % 11 === 0;
    }
    if(!_id || !isValidID) {
        if(!_id) {
            errors._id = "Missing ID number.";
        } else {
            errors._id = "Invalid ID number provided.";
        }        
    }
    if(!password) {
        errors.password = "Missing password.";
    } else if(password.length < 8) {
        errors.password = "Password length is less than 8 characters.";
    }

    if(Object.keys(errors).length > 0) {
        return res.status(422).json({ message: "Validation failed.", errors: errors });
    }

    try {
        let errorMsg = "";
        const existingId = await Account.findOne({ _id });
        const existingEmail = await Account.findOne({ email });

        if(existingId) {
            errorMsg += "ID number already in use.";
        }
        if(existingEmail) {
            errorMsg = errorMsg ? `${errorMsg} Email address already in use.` 
                                : "Email address already in use.";
        }

        if(errorMsg) {
            return res.status(409).json({ message: errorMsg });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await Account.create({
            _id: _id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            passwordHash: hashedPassword,
            contactNumber: contactNumber || "",
            college: college || "none",
            description: description || "",
            photo: photo || "",
            role: role || "student"
        });

        res.status(201).json({ message: "Account created successfully!" });
    } catch(err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Server crashed during signup." });
    }
};

exports.saveProfile = async (req, res) => {
    try {
        const { id, firstName, lastName,
                contactNumber, college, description
            } = req.body;
        
        const currentUser = await Account.findOne({ _id: id });
        if(!currentUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Form validation
        const errors = {};
        if(!firstName) {
            errors.firstName = "Missing last name.";
        }
        if(!lastName) {
            errors.lastName = "Missing last name.";
        }
        // Only check contact number if it is not empty
        if(contactNumber && !/^09[0-9]{9}$/.test(contactNumber)) {
            errors.contactNumber = "Invalid contact number."
        }

        if(Object.keys(errors).length > 0) {
            return res.status(422).json({ message: "Validation failed.", errors: errors });
        }
        
        let updateDetails = { 
            firstName: firstName,
            lastName: lastName,
			contactNumber: contactNumber,
			college: college,
			description: description,
        };
        
        // Only process photo upload if profile pic was also changed
        if(req.files && req.files.photo) {
            let photoFile = req.files.photo;
            if(Array.isArray(photoFile)) {
                photoFile = photoFile[0];
            }

            // Unique filename so no filename conflicts can happen
            const uniqueName = Date.now() + '-' + photoFile.name.replace(/\s+/g, '-');
            const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads', uniqueName);

            // Save new file
            await photoFile.mv(uploadPath);
            updateDetails.photo = `/uploads/${uniqueName}`;

            // If there is an old profile pic, delete it
            if(currentUser.photo) {
                const oldPhotoPath = path.join(__dirname, '..', '..', 'public', currentUser.photo);
                try {
                    await fs.unlink(oldPhotoPath);
                    // console.log("Successfully deleted old photo:", currentUser.photo);
                } catch(deleteErr) {
                    console.error("Could not delete old photo. It might not exist on disk:", deleteErr.message);
                }
            }
        }

        const updatedUser = await Account.findOneAndUpdate(
            { _id: id },
            { $set: updateDetails },
            { returnDocument: "after" }
        );

        res.status(200).json({ message: "Profile changes saved!", user: updatedUser });
    } catch(err) {
        console.error("Account updating error:", err);
        res.status(500).json({ message: "Server error while updating account details." });
    }
}

exports.deleteAccount = async (req, res) => {
    try {
        const accountToDelete = await Account.findOne({ _id: req.params._id });
        if(!accountToDelete) {
            return res.status(404).json({ message: "Account not found." });
        }

        // Delete all reservations made by this user
        const deletedReservations = await Reservation.deleteMany({ studentID: accountToDelete._id });
        if(deletedReservations.deletedCount > 0) {
            console.log(`Deleted ${deletedReservations.deletedCount} reservations.`);
        }

        // Delete parent (Account) AFTER children (Reservations)
        await Account.findOneAndDelete({ _id: accountToDelete._id });

        // Delete profile pic in uploads folder if they have one
        if(accountToDelete.photo) {
            try {
				await fs.unlink(path.join(__dirname, '..', '..', 'public', accountToDelete.photo));
			    // console.log("Successfully deleted photo:", accountToDelete.photo);
            } catch(deleteErr) {
                console.error("Could not delete photo. It might not exist on disk:", deleteErr.message);
            }
        }

        res.status(200).json({ message: "Account successfully deleted." });
    } catch(err) {
        console.error("Account deletion error:", err);
        res.status(500).json({ message: "Server error while deleting account." });
    }
}