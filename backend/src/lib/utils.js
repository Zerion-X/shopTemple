import jwt from 'jsonwebtoken';


function generateAuthToken(user, res) {
    // console.log(user.role);
    // console.log(user.user_id);
    const token = jwt.sign({user_id: user.user_id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'});

    res.cookie("jwt", token, {
        maxAge: 3600000, // 1 hour in milliseconds 
        httpOnly: true, // Cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === 'development' ? false : true, // Use secure cookies in production 
        sameSite: "strict" // Prevents the browser from sending this cookie along with cross-site requests
    });

    return token;
}

export { generateAuthToken };