import express from "express";
import Contact from "../models/contactsModel.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/contacts", authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id });
    res.json(contacts);
  } catch (error) {
    console.error(error);
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, category } = req.body;
    const newContact = new Contact({
      name,
      email,
      phone,
      category,
      // user: req.user._id,
    });
    const contact = await newContact.save();
    res.json(contact);
  } catch (error) {
    console.error(error);
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateContact = await Contact.findById(id);
    if (!updateContact) return res.status(404).send("Contact not found");
    if (updateContact.user.toString() !== req.user._id)
      return res.status(401).send("Unauthorized");
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedContact);
  } catch (error) {
    console.error(error);
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).send("Contact not found");
    if (contact.user.toString() !== req.user._id)
      return res.status(401).send("Unauthorized");
    await contact.remove();
    res.json({ msg: "Contact removed" });
  } catch (error) {
    console.error(error);
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});
export default router;
