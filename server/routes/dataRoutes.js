const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  getData,
  createData,
  updateData,
  deleteData,
} = require("../controllers/dataController");

router.use(auth);
router.get("/", getData);
router.post("/", createData);
router.put("/:id", updateData);
router.delete("/:id", deleteData);

module.exports = router;
    