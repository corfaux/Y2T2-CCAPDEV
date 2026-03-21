const Account = require("../models/Account");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs").promises;

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const account = await Account.findOne({ email });
        if (!account) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, account.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        res.json({
			_id: account._id,
			firstName: account.firstName,
			lastName: account.lastName,
			email: account.email,
			contactNumber: account.contactNumber,
			idNumber: account.idNumber,
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
    try {
        const { firstName, lastName, email, password, 
                contactNumber, idNumber, college, description, photo, 
                role 
              } = req.body;

        const existingUser = await Account.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAccount = new Account({
            firstName: firstName,
            lastName: lastName,
            email: email,
            passwordHash: hashedPassword,
            contactNumber: contactNumber,
            idNumber: idNumber,
            college: college,
            description: description,
            photo: photo,
            role: role
        });

        await newAccount.save();

        res.status(201).json({ message: "Account created successfully!" });
    } catch(err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Server crashed during signup." });
    }
};

exports.saveProfile = async (req, res) => {
    try {
        const { email, contactNumber, idNumber, college, 
                        description
                    } = req.body;
        
        const currentUser = await Account.findOne({ email: email });
        if(!currentUser) {
                return res.status(404).json({ message: "User not found." });
        }
        
        let updateDetails = { 
			contactNumber: contactNumber,
			idNumber: idNumber,
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
                    console.log("Successfully deleted old photo:", currentUser.photo);
                } catch(deleteErr) {
                    console.error("Could not delete old photo. It might not exist on disk:", deleteErr.message);
                }
            }
        }

        const updatedUser = await Account.findOneAndUpdate(
            { email: email },
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
        const email = req.params.email;
        const currentAccount = await Account.findOne({ email: email });
        const deletedAccount = await Account.findOneAndDelete({ email: email });

        if(!deletedAccount) {
            return res.status(404).json({ message: "Account not found." });
        }

        // Delete profile pic in uploads folder if they have one
        if(currentAccount.photo) {
            try {
				fs.unlink(path.join(__dirname, '..', '..', 'public', currentAccount.photo));
			    console.log("Successfully deleted photo:", currentAccount.photo);
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