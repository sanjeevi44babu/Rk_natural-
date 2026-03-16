const Data = require("../models/Data");

exports.getData = async (req, res) => {
  res.json(await Data.find({ user: req.user.id }));
};

exports.createData = async (req, res) => {
  res.status(201).json(
    await Data.create({ ...req.body, user: req.user.id })
  );
};

exports.updateData = async (req, res) => {
  res.json(
    await Data.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
};

exports.deleteData = async (req, res) => {
  await Data.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
