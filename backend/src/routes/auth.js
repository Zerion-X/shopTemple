import express from "express"
import Joi from "joi"
const router = express.Router();


function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(1024).required(),
    name: Joi.string().min(3).max(50).required()
  });

  return schema.validate(req);
}


router.post('/login', async (req, res) => {
    res.status(201).json({
        name: req.body.name,
        email: req.body.email,
    });
});

router.post('/signup', async (req, res) => {
    res.status(201).json({
        name: req.body.name,
        email: req.body.email,
    });
});

router.post('/logout', async (_, res) => {
    res.status(200).send("Logged out successfully");
});


export default router;